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

    await this.addEvent(newCase.id, buyerId, 'CASE_CREATED', null, CaseStatus.DRAFT, 'Case created');
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
    if (!caseRecord) throw new NotFoundException('Case not found');
    this.assertAccess(caseRecord, userId, role);
    return caseRecord;
  }

  async submit(id: string, userId: string, role: UserRole) {
    const caseRecord = await this.findOne(id, userId, role);
    if (caseRecord.status !== CaseStatus.DRAFT) {
      throw new BadRequestException('Only draft cases can be submitted');
    }
    if (role === UserRole.BUYER && caseRecord.buyerId !== userId) {
      throw new ForbiddenException();
    }

    return this.transition(id, userId, CaseStatus.SUBMITTED, 'Request submitted by buyer');
  }

  async sendToBank(id: string, userId: string) {
    const caseRecord = await this.findOne(id, userId, UserRole.ADMIN);
    if (caseRecord.status !== CaseStatus.SUBMITTED) {
      throw new BadRequestException('Case must be in submitted status');
    }

    await this.prisma.bankCreditCheck.upsert({
      where: { caseId: id },
      create: { caseId: id },
      update: {},
    });

    const updated = await this.transition(id, userId, CaseStatus.BANK_REVIEW, 'Case sent to bank');

    await this.notifications.notifyUser(
      caseRecord.buyerId,
      'Sent to bank',
      `Case ${caseRecord.caseNumber} has been sent to the bank for credit review.`,
      id,
    );

    const bankUsers = await this.prisma.user.findMany({ where: { role: UserRole.BANK_OPS } });
    for (const bankUser of bankUsers) {
      await this.notifications.notifyUser(
        bankUser.id,
        'New bank case',
        `Case ${caseRecord.caseNumber} is ready for credit review.`,
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
    if (!seller) throw new NotFoundException('Seller not found');

    const updated = await this.prisma.case.update({
      where: { id },
      data: { sellerId: dto.sellerId },
      include: caseInclude,
    });

    await this.addEvent(id, userId, 'SELLER_ASSIGNED', caseRecord.status, caseRecord.status, `Seller ${seller.fullName} assigned to case`);

    await this.notifications.notifyUser(
      seller.id,
      'Linked to case',
      `You have been linked to case ${caseRecord.caseNumber}.`,
      id,
    );

    return updated;
  }

  async requestAppraisal(id: string, userId: string) {
    const caseRecord = await this.findOne(id, userId, UserRole.ADMIN);
    if (caseRecord.status !== CaseStatus.BANK_APPROVED) {
      throw new BadRequestException('Bank approval is required first');
    }

    await this.prisma.appraisalRequest.upsert({
      where: { caseId: id },
      create: { caseId: id },
      update: {},
    });

    const updated = await this.transition(id, userId, CaseStatus.APPRAISAL_REQUESTED, 'Property valuation requested');

    const appraisers = await this.prisma.user.findMany({ where: { role: UserRole.APPRAISER } });
    for (const appraiser of appraisers) {
      await this.notifications.notifyUser(
        appraiser.id,
        'New valuation request',
        `Case ${caseRecord.caseNumber} is ready for valuation.`,
        id,
      );
    }

    return updated;
  }

  async completeDeal(id: string, userId: string) {
    const caseRecord = await this.findOne(id, userId, UserRole.ADMIN);
    if (caseRecord.status !== CaseStatus.READY_FOR_DEAL) {
      throw new BadRequestException('Case must be ready for deal');
    }
    await this.transition(id, userId, CaseStatus.DEAL_IN_PROGRESS, 'Deal process started');
    return this.transition(id, userId, CaseStatus.COMPLETED, 'Deal completed successfully');
  }

  async cancel(id: string, userId: string, role: UserRole) {
    const caseRecord = await this.findOne(id, userId, role);
    const terminalStatuses: CaseStatus[] = [CaseStatus.COMPLETED, CaseStatus.CANCELLED];
    if (terminalStatuses.includes(caseRecord.status)) {
      throw new BadRequestException('This case cannot be cancelled');
    }
    return this.transition(id, userId, CaseStatus.CANCELLED, 'Case cancelled');
  }

  private async transition(caseId: string, userId: string, toStatus: CaseStatus, message: string) {
    const caseRecord = await this.prisma.case.findUnique({ where: { id: caseId } });
    if (!caseRecord) throw new NotFoundException();

    if (!canTransition(caseRecord.status, toStatus)) {
      throw new BadRequestException(`Transition from ${caseRecord.status} to ${toStatus} is not allowed`);
    }

    const updated = await this.prisma.case.update({
      where: { id: caseId },
      data: { status: toStatus },
      include: caseInclude,
    });

    await this.addEvent(caseId, userId, 'STATUS_CHANGE', caseRecord.status, toStatus, message);

    await this.notifications.notifyUser(
      caseRecord.buyerId,
      'Case status updated',
      `Case ${caseRecord.caseNumber}: ${message}`,
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
    throw new ForbiddenException('Access to this case is not allowed');
  }
}
