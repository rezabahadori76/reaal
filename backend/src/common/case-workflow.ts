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
  DRAFT: 'پیش‌نویس',
  SUBMITTED: 'ثبت شده',
  BANK_REVIEW: 'بررسی بانک',
  BANK_APPROVED: 'تأیید بانک',
  BANK_REJECTED: 'رد بانک',
  APPRAISAL_REQUESTED: 'درخواست ارزیابی',
  APPRAISAL_IN_PROGRESS: 'در حال ارزیابی',
  APPRAISAL_COMPLETED: 'ارزیابی تکمیل',
  READY_FOR_DEAL: 'آماده معامله',
  DEAL_IN_PROGRESS: 'در حال معامله',
  COMPLETED: 'تکمیل شده',
  CANCELLED: 'لغو شده',
};

export function canTransition(from: CaseStatus, to: CaseStatus): boolean {
  return CASE_TRANSITIONS[from]?.includes(to) ?? false;
}

export function generateCaseNumber(): string {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 900000 + 100000);
  return `RE-${year}-${random}`;
}
