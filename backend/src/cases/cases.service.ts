import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { CaseStatus, UserRole } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { CreateCaseDto, AssignSellerDto } from './dto/case.dto';
import { canTransition, generateCaseNumber } from '../common/case-workflow';

const caseInclude = {
  buyer: { select: { id: true, fullName: true, email: true, phone: true } },
  seller: { select: { id: true, fullName: true, email: true, phone: true } },
  bankCreditCheck: true,
  appraisalRequest: {
    include: {
      appraiser: { select: { id: true, fullName: true, email: true } },
    },
  },
  events: {
    orderBy: { createdAt: 'desc' as const },
    include: { user: { select: { id: true, fullName: true, role: true } } },
  },
  documents: { orderBy: { createdAt: 'desc' as const } },
};

@Injectable()
export class CasesService {
  constructor(
    private prisma: PrismaService,
    private notifications: NotificationsService,
  ) {}

  async create(buyerId: string, dto: CreateCaseDto) {
    const caseNumber = generateCaseNumber();
    const newCase = await this.prisma.case.create({
      data: {
        caseNumber,
        buyerId,
        status: CaseStatus.DRAFT,
        propertyAddress: dto.propertyAddress,
        propertyType: dto.propertyType,
        propertyArea: dto.propertyArea,
        propertySource: dto.propertySource ?? 'EXTERNAL',
        askingPrice: dto.askingPrice,
        buyerIncome: dto.buyerIncome,
        buyerNotes: dto.buyerNotes,
      },
      include: caseInclude,
    });

    await this.addEvent(newCase.id, buyerId, 'CASE_CREATED', null, CaseStatus.DRAFT, 'پرونده ایجاد شد');
    return newCase;
  }

  async findAll(userId: string, role: UserRole) {
    const where = this.buildAccessFilter(userId, role);
    return this.prisma.case.findMany({
      where,
      include: caseInclude,
      orderBy: { updatedAt: 'desc' },
    });
  }

  async findOne(id: string, userId: string, role: UserRole) {
    const caseRecord = await this.prisma.case.findUnique({
      where: { id },
      include: caseInclude,
    });
    if (!caseRecord) throw new NotFoundException('پرونده یافت نشد');
    this.assertAccess(caseRecord, userId, role);
    return caseRecord;
  }

  async submit(id: string, userId: string, role: UserRole) {
    const caseRecord = await this.findOne(id, userId, role);
    if (caseRecord.status !== CaseStatus.DRAFT) {
      throw new BadRequestException('فقط پرونده پیش‌نویس قابل ارسال است');
    }
    if (role === UserRole.BUYER && caseRecord.buyerId !== userId) {
      throw new ForbiddenException();
    }

    return this.transition(id, userId, CaseStatus.SUBMITTED, 'درخواست توسط خریدار ارسال شد');
  }

  async sendToBank(id: string, userId: string) {
    const caseRecord = await this.findOne(id, userId, UserRole.ADMIN);
    if (caseRecord.status !== CaseStatus.SUBMITTED) {
      throw new BadRequestException('پرونده باید در وضعیت ثبت شده باشد');
    }

    await this.prisma.bankCreditCheck.upsert({
      where: { caseId: id },
      create: { caseId: id },
      update: {},
    });

    const updated = await this.transition(id, userId, CaseStatus.BANK_REVIEW, 'پرونده به بانک ارجاع شد');

    await this.notifications.notifyUser(
      caseRecord.buyerId,
      'ارجاع به بانک',
      `پرونده ${caseRecord.caseNumber} برای بررسی اعتباری به بانک ارسال شد.`,
      id,
    );

    const bankUsers = await this.prisma.user.findMany({ where: { role: UserRole.BANK_OPS } });
    for (const bankUser of bankUsers) {
      await this.notifications.notifyUser(
        bankUser.id,
        'پرونده جدید بانک',
        `پرونده ${caseRecord.caseNumber} برای بررسی اعتباری آماده است.`,
        id,
      );
    }

    return updated;
  }

  async assignSeller(id: string, userId: string, dto: AssignSellerDto) {
    const caseRecord = await this.findOne(id, userId, UserRole.ADMIN);
    const seller = await this.prisma.user.findFirst({
      where: { id: dto.sellerId, role: UserRole.SELLER },
    });
    if (!seller) throw new NotFoundException('فروشنده یافت نشد');

    const updated = await this.prisma.case.update({
      where: { id },
      data: { sellerId: dto.sellerId },
      include: caseInclude,
    });

    await this.addEvent(id, userId, 'SELLER_ASSIGNED', caseRecord.status, caseRecord.status, `فروشنده ${seller.fullName} به پرونده متصل شد`);

    await this.notifications.notifyUser(
      seller.id,
      'اتصال به پرونده',
      `شما به پرونده ${caseRecord.caseNumber} متصل شدید.`,
      id,
    );

    return updated;
  }

  async requestAppraisal(id: string, userId: string) {
    const caseRecord = await this.findOne(id, userId, UserRole.ADMIN);
    if (caseRecord.status !== CaseStatus.BANK_APPROVED) {
      throw new BadRequestException('ابتدا باید تأیید بانک دریافت شود');
    }

    await this.prisma.appraisalRequest.upsert({
      where: { caseId: id },
      create: { caseId: id },
      update: {},
    });

    const updated = await this.transition(id, userId, CaseStatus.APPRAISAL_REQUESTED, 'درخواست ارزیابی ملک ثبت شد');

    const appraisers = await this.prisma.user.findMany({ where: { role: UserRole.APPRAISER } });
    for (const appraiser of appraisers) {
      await this.notifications.notifyUser(
        appraiser.id,
        'درخواست ارزیابی جدید',
        `پرونده ${caseRecord.caseNumber} برای ارزیابی آماده است.`,
        id,
      );
    }

    return updated;
  }

  async completeDeal(id: string, userId: string) {
    const caseRecord = await this.findOne(id, userId, UserRole.ADMIN);
    if (caseRecord.status !== CaseStatus.READY_FOR_DEAL) {
      throw new BadRequestException('پرونده باید آماده معامله باشد');
    }
    await this.transition(id, userId, CaseStatus.DEAL_IN_PROGRESS, 'فرآیند معامله آغاز شد');
    return this.transition(id, userId, CaseStatus.COMPLETED, 'معامله با موفقیت تکمیل شد');
  }

  async cancel(id: string, userId: string, role: UserRole) {
    const caseRecord = await this.findOne(id, userId, role);
    const terminalStatuses: CaseStatus[] = [CaseStatus.COMPLETED, CaseStatus.CANCELLED];
    if (terminalStatuses.includes(caseRecord.status)) {
      throw new BadRequestException('این پرونده قابل لغو نیست');
    }
    return this.transition(id, userId, CaseStatus.CANCELLED, 'پرونده لغو شد');
  }

  private async transition(caseId: string, userId: string, toStatus: CaseStatus, message: string) {
    const caseRecord = await this.prisma.case.findUnique({ where: { id: caseId } });
    if (!caseRecord) throw new NotFoundException();

    if (!canTransition(caseRecord.status, toStatus)) {
      throw new BadRequestException(`انتقال از ${caseRecord.status} به ${toStatus} مجاز نیست`);
    }

    const updated = await this.prisma.case.update({
      where: { id: caseId },
      data: { status: toStatus },
      include: caseInclude,
    });

    await this.addEvent(caseId, userId, 'STATUS_CHANGE', caseRecord.status, toStatus, message);

    await this.notifications.notifyUser(
      caseRecord.buyerId,
      'تغییر وضعیت پرونده',
      `وضعیت پرونده ${caseRecord.caseNumber}: ${message}`,
      caseId,
    );

    return updated;
  }

  private async addEvent(
    caseId: string,
    userId: string | null,
    eventType: string,
    fromStatus: CaseStatus | null,
    toStatus: CaseStatus | null,
    message: string,
  ) {
    return this.prisma.caseEvent.create({
      data: { caseId, userId, eventType, fromStatus, toStatus, message },
    });
  }

  private buildAccessFilter(userId: string, role: UserRole) {
    switch (role) {
      case UserRole.ADMIN:
        return {};
      case UserRole.BUYER:
        return { buyerId: userId };
      case UserRole.SELLER:
        return { sellerId: userId };
      case UserRole.BANK_OPS:
        return { status: { not: CaseStatus.DRAFT } };
      case UserRole.APPRAISER:
        return {
          appraisalRequest: { isNot: null },
          status: {
            in: [
              CaseStatus.APPRAISAL_REQUESTED,
              CaseStatus.APPRAISAL_IN_PROGRESS,
              CaseStatus.APPRAISAL_COMPLETED,
              CaseStatus.READY_FOR_DEAL,
              CaseStatus.DEAL_IN_PROGRESS,
              CaseStatus.COMPLETED,
            ],
          },
        };
      default:
        return { id: 'none' };
    }
  }

  private assertAccess(
    caseRecord: { buyerId: string; sellerId: string | null; status: CaseStatus },
    userId: string,
    role: UserRole,
  ) {
    if (role === UserRole.ADMIN) return;
    if (role === UserRole.BUYER && caseRecord.buyerId === userId) return;
    if (role === UserRole.SELLER && caseRecord.sellerId === userId) return;
    if (role === UserRole.BANK_OPS && caseRecord.status !== CaseStatus.DRAFT) return;
    const appraiserStatuses: CaseStatus[] = [
        CaseStatus.APPRAISAL_REQUESTED,
        CaseStatus.APPRAISAL_IN_PROGRESS,
        CaseStatus.APPRAISAL_COMPLETED,
        CaseStatus.READY_FOR_DEAL,
        CaseStatus.DEAL_IN_PROGRESS,
        CaseStatus.COMPLETED,
      ];
    if (role === UserRole.APPRAISER && appraiserStatuses.includes(caseRecord.status)) {
      return;
    }
    throw new ForbiddenException('دسترسی به این پرونده مجاز نیست');
  }
}
