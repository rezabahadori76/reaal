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

export const STATUS_LABELS_AR: Record<CaseStatus, string> = {
  DRAFT: 'مسودة',
  SUBMITTED: 'تم الإرسال',
  BANK_REVIEW: 'مراجعة البنك',
  BANK_APPROVED: 'اعتماد البنك',
  BANK_REJECTED: 'رفض البنك',
  APPRAISAL_REQUESTED: 'طلب التثمين',
  APPRAISAL_IN_PROGRESS: 'التثمين جارٍ',
  APPRAISAL_COMPLETED: 'اكتمل التثمين',
  READY_FOR_DEAL: 'جاهز للصفقة',
  DEAL_IN_PROGRESS: 'الصفقة جارية',
  COMPLETED: 'مكتمل',
  CANCELLED: 'ملغي',
};

export const STATUS_COLORS: Record<CaseStatus, string> = {
  DRAFT: 'bg-slate-500/15 text-slate-300 border-slate-500/20',
  SUBMITTED: 'bg-blue-500/15 text-blue-300 border-blue-500/20',
  BANK_REVIEW: 'bg-gold/15 text-gold-light border-gold/20',
  BANK_APPROVED: 'bg-accent/15 text-accent-light border-accent/20',
  BANK_REJECTED: 'bg-red-500/15 text-red-300 border-red-500/20',
  APPRAISAL_REQUESTED: 'bg-purple-500/15 text-purple-300 border-purple-500/20',
  APPRAISAL_IN_PROGRESS: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/20',
  APPRAISAL_COMPLETED: 'bg-teal-500/15 text-teal-300 border-teal-500/20',
  READY_FOR_DEAL: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/20',
  DEAL_IN_PROGRESS: 'bg-orange-500/15 text-orange-300 border-orange-500/20',
  COMPLETED: 'bg-accent/20 text-accent-light border-accent/30',
  CANCELLED: 'bg-slate-500/10 text-slate-500 border-slate-500/15',
};

export const ROLE_LABELS: Record<UserRole, string> = {
  BUYER: 'Buyer',
  SELLER: 'Seller',
  BANK_OPS: 'Bank',
  APPRAISER: 'Valuation',
  ADMIN: 'Admin',
};

export const ROLE_LABELS_AR: Record<UserRole, string> = {
  BUYER: 'المشتري',
  SELLER: 'البائع',
  BANK_OPS: 'البنك',
  APPRAISER: 'التثمين',
  ADMIN: 'المدير',
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
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'OMR',
    maximumFractionDigits: 0,
  }).format(amount / 1000);
}

export function formatDate(date: string) {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
}
