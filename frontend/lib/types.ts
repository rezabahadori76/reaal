export type UserRole = 'BUYER' | 'SELLER' | 'BANK_OPS' | 'APPRAISER' | 'ADMIN';

export type CaseStatus =
  | 'DRAFT'
  | 'SUBMITTED'
  | 'BANK_REVIEW'
  | 'BANK_APPROVED'
  | 'BANK_REJECTED'
  | 'APPRAISAL_REQUESTED'
  | 'APPRAISAL_IN_PROGRESS'
  | 'APPRAISAL_COMPLETED'
  | 'READY_FOR_DEAL'
  | 'DEAL_IN_PROGRESS'
  | 'COMPLETED'
  | 'CANCELLED';

export interface User {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
  role: UserRole;
  createdAt: string;
}

export interface Case {
  id: string;
  caseNumber: string;
  status: CaseStatus;
  propertyAddress: string;
  propertyType: string;
  propertyArea?: number;
  propertySource: string;
  askingPrice?: number;
  buyerIncome?: number;
  buyerNotes?: string;
  createdAt: string;
  updatedAt: string;
  buyer: { id: string; fullName: string; email: string; phone?: string };
  seller?: { id: string; fullName: string; email: string; phone?: string };
  bankCreditCheck?: {
    result: string;
    maxLoanAmount?: number;
    interestRate?: number;
    rejectionReason?: string;
    reviewedAt?: string;
  };
  appraisalRequest?: {
    status: string;
    appraisedValue?: number;
    reportNotes?: string;
    reportFileName?: string;
    appraiser?: { id: string; fullName: string };
  };
  events?: CaseEvent[];
}

export interface CaseEvent {
  id: string;
  eventType: string;
  fromStatus?: CaseStatus;
  toStatus?: CaseStatus;
  message: string;
  createdAt: string;
  user?: { id: string; fullName: string; role: string };
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  isRead: boolean;
  caseId?: string;
  createdAt: string;
}

export interface DashboardStats {
  totalCases: number;
  activeCases: number;
  completedCases: number;
  totalUsers: number;
  casesByStatus: { status: string; label: string; count: number }[];
  recentCases: Case[];
}

export const STATUS_LABELS: Record<CaseStatus, string> = {
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

export const STATUS_COLORS: Record<CaseStatus, string> = {
  DRAFT: 'bg-slate-100 text-slate-700',
  SUBMITTED: 'bg-blue-100 text-blue-700',
  BANK_REVIEW: 'bg-amber-100 text-amber-700',
  BANK_APPROVED: 'bg-emerald-100 text-emerald-700',
  BANK_REJECTED: 'bg-red-100 text-red-700',
  APPRAISAL_REQUESTED: 'bg-purple-100 text-purple-700',
  APPRAISAL_IN_PROGRESS: 'bg-indigo-100 text-indigo-700',
  APPRAISAL_COMPLETED: 'bg-teal-100 text-teal-700',
  READY_FOR_DEAL: 'bg-green-100 text-green-700',
  DEAL_IN_PROGRESS: 'bg-orange-100 text-orange-700',
  COMPLETED: 'bg-emerald-100 text-emerald-800',
  CANCELLED: 'bg-gray-100 text-gray-600',
};

export const ROLE_LABELS: Record<UserRole, string> = {
  BUYER: 'خریدار',
  SELLER: 'فروشنده',
  BANK_OPS: 'بانک',
  APPRAISER: 'ارزیاب',
  ADMIN: 'مدیر',
};

export const ROLE_ROUTES: Record<UserRole, string> = {
  BUYER: '/buyer',
  SELLER: '/seller',
  BANK_OPS: '/bank',
  APPRAISER: '/appraiser',
  ADMIN: '/admin',
};

export function formatPrice(amount?: number) {
  if (!amount) return '—';
  return new Intl.NumberFormat('fa-IR').format(amount) + ' ریال';
}

export function formatDate(date: string) {
  return new Intl.DateTimeFormat('fa-IR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
}
