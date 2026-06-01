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

    if (!caseRecord) throw new NotFoundException('Case not found');
    if (caseRecord.status !== CaseStatus.BANK_REVIEW) {
      throw new BadRequestException('Case is not in bank review status');
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
      message = `Credit check approved. Max loan: $${((mockResult.maxLoanAmount ?? 0) / 1000).toLocaleString('en-US')}`;
    } else if (mockResult.result === BankCheckResult.CONDITIONAL) {
      newStatus = CaseStatus.BANK_APPROVED;
      message = 'Conditional approval — additional documents required';
    } else {
      newStatus = CaseStatus.BANK_REJECTED;
      message = mockResult.rejectionReason || 'Loan request rejected';
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
      'Bank credit check result',
      `Case ${caseRecord.caseNumber}: ${message}`,
      caseId,
    );

    const admins = await this.prisma.user.findMany({ where: { role: UserRole.ADMIN } });
    for (const admin of admins) {
      await this.notifications.notifyUser(
        admin.id,
        'Bank review result',
        `Case ${caseRecord.caseNumber}: ${message}`,
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
        rejectionReason: dto.rejectionReason || 'Credit conditions not met',
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
