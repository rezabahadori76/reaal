import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { AppraisalStatus, CaseStatus, UserRole } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { SubmitAppraisalDto } from './dto/appraisal.dto';

@Injectable()
export class AppraisalService {
  constructor(
    private prisma: PrismaService,
    private notifications: NotificationsService,
  ) {}

  async getPendingRequests() {
    return this.prisma.appraisalRequest.findMany({
      where: {
        status: { in: [AppraisalStatus.PENDING, AppraisalStatus.IN_PROGRESS] },
      },
      include: {
        case: {
          include: {
            buyer: { select: { id: true, fullName: true, email: true } },
          },
        },
        appraiser: { select: { id: true, fullName: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async acceptRequest(caseId: string, appraiserId: string) {
    const caseRecord = await this.prisma.case.findUnique({
      where: { id: caseId },
      include: { appraisalRequest: true },
    });

    if (!caseRecord?.appraisalRequest) throw new NotFoundException('Valuation request not found');
    if (caseRecord.status !== CaseStatus.APPRAISAL_REQUESTED) {
      throw new BadRequestException('Case is not in valuation requested status');
    }

    await this.prisma.appraisalRequest.update({
      where: { caseId },
      data: {
        appraiserId,
        status: AppraisalStatus.IN_PROGRESS,
      },
    });

    const updated = await this.prisma.case.update({
      where: { id: caseId },
      data: { status: CaseStatus.APPRAISAL_IN_PROGRESS },
      include: {
        appraisalRequest: { include: { appraiser: { select: { id: true, fullName: true } } } },
        buyer: { select: { id: true, fullName: true } },
      },
    });

    await this.prisma.caseEvent.create({
      data: {
        caseId,
        userId: appraiserId,
        eventType: 'APPRAISAL_ACCEPTED',
        fromStatus: CaseStatus.APPRAISAL_REQUESTED,
        toStatus: CaseStatus.APPRAISAL_IN_PROGRESS,
        message: 'Appraiser accepted the case',
      },
    });

    return updated;
  }

  async submitReport(caseId: string, appraiserId: string, dto: SubmitAppraisalDto) {
    const caseRecord = await this.prisma.case.findUnique({
      where: { id: caseId },
      include: { appraisalRequest: true, buyer: true },
    });

    if (!caseRecord?.appraisalRequest) throw new NotFoundException();
    if (caseRecord.status !== CaseStatus.APPRAISAL_IN_PROGRESS) {
      throw new BadRequestException('Case is not in valuation in progress status');
    }

    await this.prisma.appraisalRequest.update({
      where: { caseId },
      data: {
        appraisedValue: dto.appraisedValue,
        reportNotes: dto.reportNotes,
        reportFileName: dto.reportFileName ?? 'appraisal-report.pdf',
        status: AppraisalStatus.COMPLETED,
        completedAt: new Date(),
        appraiserId,
      },
    });

    await this.prisma.case.update({
      where: { id: caseId },
      data: { status: CaseStatus.APPRAISAL_COMPLETED },
    });

    await this.prisma.caseEvent.create({
      data: {
        caseId,
        userId: appraiserId,
        eventType: 'APPRAISAL_COMPLETED',
        fromStatus: CaseStatus.APPRAISAL_IN_PROGRESS,
        toStatus: CaseStatus.APPRAISAL_COMPLETED,
        message: `Valuation report: $${(dto.appraisedValue / 1000).toLocaleString('en-US')}`,
      },
    });

    const readyCase = await this.prisma.case.update({
      where: { id: caseId },
      data: { status: CaseStatus.READY_FOR_DEAL },
      include: {
        appraisalRequest: { include: { appraiser: { select: { id: true, fullName: true } } } },
        buyer: { select: { id: true, fullName: true } },
        bankCreditCheck: true,
      },
    });

    await this.prisma.caseEvent.create({
      data: {
        caseId,
        userId: appraiserId,
        eventType: 'STATUS_CHANGE',
        fromStatus: CaseStatus.APPRAISAL_COMPLETED,
        toStatus: CaseStatus.READY_FOR_DEAL,
        message: 'Case is ready for deal finalization',
      },
    });

    await this.notifications.notifyUser(
      caseRecord.buyerId,
      'Valuation completed',
      `Property value: $${(dto.appraisedValue / 1000).toLocaleString('en-US')} — case is ready for deal.`,
      caseId,
    );

    const admins = await this.prisma.user.findMany({ where: { role: UserRole.ADMIN } });
    for (const admin of admins) {
      await this.notifications.notifyUser(
        admin.id,
        'Valuation completed',
        `Case ${caseRecord.caseNumber} is ready for deal.`,
        caseId,
      );
    }

    return readyCase;
  }
}
