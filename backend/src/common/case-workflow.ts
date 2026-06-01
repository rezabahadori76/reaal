import { CaseStatus } from '@prisma/client';

export const CASE_TRANSITIONS: Record<CaseStatus, CaseStatus[]> = {
  DRAFT: ['SUBMITTED', 'CANCELLED'],
  SUBMITTED: ['BANK_REVIEW', 'CANCELLED'],
  BANK_REVIEW: ['BANK_APPROVED', 'BANK_REJECTED', 'CANCELLED'],
  BANK_APPROVED: ['APPRAISAL_REQUESTED', 'CANCELLED'],
  BANK_REJECTED: ['CANCELLED'],
  APPRAISAL_REQUESTED: ['APPRAISAL_IN_PROGRESS', 'CANCELLED'],
  APPRAISAL_IN_PROGRESS: ['APPRAISAL_COMPLETED', 'CANCELLED'],
  APPRAISAL_COMPLETED: ['READY_FOR_DEAL', 'CANCELLED'],
  READY_FOR_DEAL: ['DEAL_IN_PROGRESS', 'CANCELLED'],
  DEAL_IN_PROGRESS: ['COMPLETED', 'CANCELLED'],
  COMPLETED: [],
  CANCELLED: [],
};

export const CASE_STATUS_LABELS: Record<CaseStatus, string> = {
  DRAFT: 'Draft',
  SUBMITTED: 'Submitted',
  BANK_REVIEW: 'Bank review',
  BANK_APPROVED: 'Bank approved',
  BANK_REJECTED: 'Bank rejected',
  APPRAISAL_REQUESTED: 'Valuation requested',
  APPRAISAL_IN_PROGRESS: 'Valuation in progress',
  APPRAISAL_COMPLETED: 'Valuation completed',
  READY_FOR_DEAL: 'Ready for deal',
  DEAL_IN_PROGRESS: 'Deal in progress',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
};

export function canTransition(from: CaseStatus, to: CaseStatus): boolean {
  return CASE_TRANSITIONS[from]?.includes(to) ?? false;
}

export function generateCaseNumber(): string {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 900000 + 100000);
  return `RE-${year}-${random}`;
}
