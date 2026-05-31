import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { BankCheckResult, CaseStatus, UserRole } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { ReviewCreditCheckDto } from './dto/bank.dto';

@Injectable()
export class BankService {
  constructor(
    private prisma: PrismaService,
    private notifications: NotificationsService,
  ) {}

  async getPendingReviews() {
    return this.prisma.case.findMany({
      where: { status: CaseStatus.BANK_REVIEW },
      include: {
        buyer: { select: { id: true, fullName: true, email: true, phone: true } },
        bankCreditCheck: true,
      },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async reviewCreditCheck(caseId: string, reviewerId: string, dto: ReviewCreditCheckDto) {
    const caseRecord = await this.prisma.case.findUnique({
      where: { id: caseId },
      include: { bankCreditCheck: true, buyer: true },
    });

    if (!caseRecord) throw new NotFoundException('پرونده یافت نشد');
    if (caseRecord.status !== CaseStatus.BANK_REVIEW) {
      throw new BadRequestException('پرونده در وضعیت بررسی بانک نیست');
    }

    const mockResult = this.applyMockLogic(caseRecord, dto);

    await this.prisma.bankCreditCheck.update({
      where: { caseId },
      data: {
        result: mockResult.result,
        maxLoanAmount: mockResult.maxLoanAmount,
        interestRate: mockResult.interestRate,
        rejectionReason: mockResult.rejectionReason,
        reviewedAt: new Date(),
      },
    });

    let newStatus: CaseStatus;
    let message: string;

    if (mockResult.result === BankCheckResult.APPROVED) {
      newStatus = CaseStatus.BANK_APPROVED;
      message = `اعتبارسنجی تأیید شد. سقف وام: ${mockResult.maxLoanAmount?.toLocaleString('fa-IR')} ریال`;
    } else if (mockResult.result === BankCheckResult.CONDITIONAL) {
      newStatus = CaseStatus.BANK_APPROVED;
      message = 'اعتبارسنجی مشروط تأیید شد — ارائه مدارک تکمیلی لازم است';
    } else {
      newStatus = CaseStatus.BANK_REJECTED;
      message = mockResult.rejectionReason || 'درخواست وام رد شد';
    }

    const updated = await this.prisma.case.update({
      where: { id: caseId },
      data: { status: newStatus },
      include: {
        buyer: { select: { id: true, fullName: true, email: true, phone: true } },
        bankCreditCheck: true,
      },
    });

    await this.prisma.caseEvent.create({
      data: {
        caseId,
        userId: reviewerId,
        eventType: 'BANK_REVIEW',
        fromStatus: CaseStatus.BANK_REVIEW,
        toStatus: newStatus,
        message,
      },
    });

    await this.notifications.notifyUser(
      caseRecord.buyerId,
      'نتیجه اعتبارسنجی بانک',
      `پرونده ${caseRecord.caseNumber}: ${message}`,
      caseId,
    );

    const admins = await this.prisma.user.findMany({ where: { role: UserRole.ADMIN } });
    for (const admin of admins) {
      await this.notifications.notifyUser(
        admin.id,
        'نتیجه بررسی بانک',
        `پرونده ${caseRecord.caseNumber}: ${message}`,
        caseId,
      );
    }

    return updated;
  }

  /** Mock logic: auto-calculate loan if approved based on income & price */
  private applyMockLogic(
    caseRecord: {
      askingPrice: number | null;
      buyerIncome: number | null;
    },
    dto: ReviewCreditCheckDto,
  ) {
    if (dto.result === BankCheckResult.REJECTED) {
      return {
        result: BankCheckResult.REJECTED,
        maxLoanAmount: null,
        interestRate: null,
        rejectionReason: dto.rejectionReason || 'عدم تأیید شرایط اعتباری',
      };
    }

    const price = caseRecord.askingPrice ?? 5_000_000_000;
    const income = caseRecord.buyerIncome ?? 50_000_000;
    const autoMaxLoan = Math.min(price * 0.8, income * 120);

    return {
      result: dto.result,
      maxLoanAmount: dto.maxLoanAmount ?? Math.round(autoMaxLoan),
      interestRate: dto.interestRate ?? 23,
      rejectionReason: null,
    };
  }
}
