import { Injectable } from '@nestjs/common';
import { CaseStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CASE_STATUS_LABELS } from '../common/case-workflow';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getStats() {
    const [
      totalCases,
      activeCases,
      completedCases,
      totalUsers,
      casesByStatus,
      recentCases,
    ] = await Promise.all([
      this.prisma.case.count(),
      this.prisma.case.count({
        where: {
          status: {
            notIn: [CaseStatus.COMPLETED, CaseStatus.CANCELLED, CaseStatus.DRAFT],
          },
        },
      }),
      this.prisma.case.count({ where: { status: CaseStatus.COMPLETED } }),
      this.prisma.user.count({ where: { isActive: true } }),
      this.prisma.case.groupBy({
        by: ['status'],
        _count: { status: true },
      }),
      this.prisma.case.findMany({
        take: 10,
        orderBy: { updatedAt: 'desc' },
        include: {
          buyer: { select: { fullName: true } },
          seller: { select: { fullName: true } },
        },
      }),
    ]);

    return {
      totalCases,
      activeCases,
      completedCases,
      totalUsers,
      casesByStatus: casesByStatus.map((item) => ({
        status: item.status,
        label: CASE_STATUS_LABELS[item.status],
        count: item._count.status,
      })),
      recentCases,
    };
  }
}
