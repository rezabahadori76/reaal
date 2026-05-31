'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Case, formatDate, formatPrice, STATUS_LABELS } from '@/lib/types';
import { StatusBadge } from './ui';

export function CaseCard({ caseItem, href }: { caseItem: Case; href: string }) {
  return (
    <Link href={href} className="card p-5 hover:shadow-md transition-shadow block">
      <div className="flex items-start justify-between">
        <div>
          <p className="font-mono text-sm text-brand-600">{caseItem.caseNumber}</p>
          <p className="font-medium mt-1">{caseItem.propertyAddress}</p>
          <p className="text-sm text-slate-500 mt-1">
            {caseItem.propertyType}
            {caseItem.propertyArea ? ` · ${caseItem.propertyArea} متر` : ''}
          </p>
        </div>
        <StatusBadge status={caseItem.status} />
      </div>
      <div className="flex items-center gap-4 mt-3 text-xs text-slate-400">
        <span>خریدار: {caseItem.buyer.fullName}</span>
        {caseItem.askingPrice && <span>{formatPrice(caseItem.askingPrice)}</span>}
        <span>{formatDate(caseItem.updatedAt)}</span>
      </div>
    </Link>
  );
}

export function CaseTimeline({ events }: { events: Case['events'] }) {
  if (!events?.length) return <p className="text-sm text-slate-400">رویدادی ثبت نشده</p>;

  return (
    <div className="space-y-4">
      {events.map((event) => (
        <div key={event.id} className="flex gap-3">
          <div className="w-2 h-2 rounded-full bg-brand-500 mt-2 shrink-0" />
          <div>
            <p className="text-sm font-medium">{event.message}</p>
            <p className="text-xs text-slate-400 mt-0.5">
              {event.user?.fullName && `${event.user.fullName} · `}
              {formatDate(event.createdAt)}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

export function CaseDetailView({
  caseItem,
  token,
  onRefresh,
  role,
}: {
  caseItem: Case;
  token: string;
  onRefresh: () => void;
  role?: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState('');
  const [sellers, setSellers] = useState<{ id: string; fullName: string }[]>([]);
  const [selectedSeller, setSelectedSeller] = useState('');
  const [appraisalValue, setAppraisalValue] = useState('');
  const [appraisalNotes, setAppraisalNotes] = useState('');
  const [bankResult, setBankResult] = useState('APPROVED');
  const [rejectReason, setRejectReason] = useState('');

  const act = async (action: string, fn: () => Promise<unknown>) => {
    setLoading(action);
    try {
      await fn();
      onRefresh();
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : 'خطا');
    } finally {
      setLoading('');
    }
  };

  useEffect(() => {
    if (caseItem.status === 'SUBMITTED' || caseItem.status === 'READY_FOR_DEAL') {
      import('@/lib/api').then(({ api }) =>
        api.getSellers(token).then(setSellers).catch(() => {}),
      );
    }
  }, [caseItem.status, token]);

  return (
    <div className="space-y-6">
      <div className="card p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="font-mono text-brand-600">{caseItem.caseNumber}</p>
            <h2 className="text-xl font-bold mt-1">{caseItem.propertyAddress}</h2>
            <p className="text-slate-500 mt-1">
              {caseItem.propertyType}
              {caseItem.propertyArea ? ` · ${caseItem.propertyArea} متر مربع` : ''}
            </p>
          </div>
          <StatusBadge status={caseItem.status} />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <InfoItem label="قیمت درخواستی" value={formatPrice(caseItem.askingPrice)} />
          <InfoItem label="درآمد خریدار" value={formatPrice(caseItem.buyerIncome)} />
          <InfoItem label="خریدار" value={caseItem.buyer.fullName} />
          <InfoItem label="فروشنده" value={caseItem.seller?.fullName || '—'} />
        </div>

        {caseItem.buyerNotes && (
          <p className="text-sm text-slate-600 mt-4 bg-slate-50 p-3 rounded-lg">
            {caseItem.buyerNotes}
          </p>
        )}
      </div>

      {caseItem.bankCreditCheck && caseItem.bankCreditCheck.result !== 'PENDING' && (
        <div className="card p-6">
          <h3 className="font-semibold mb-3">نتیجه اعتبارسنجی بانک</h3>
          <div className="grid grid-cols-3 gap-4">
            <InfoItem label="نتیجه" value={caseItem.bankCreditCheck.result === 'APPROVED' ? 'تأیید' : caseItem.bankCreditCheck.result === 'REJECTED' ? 'رد' : 'مشروط'} />
            <InfoItem label="سقف وام" value={formatPrice(caseItem.bankCreditCheck.maxLoanAmount)} />
            <InfoItem label="نرخ سود" value={caseItem.bankCreditCheck.interestRate ? `${caseItem.bankCreditCheck.interestRate}٪` : '—'} />
          </div>
        </div>
      )}

      {caseItem.appraisalRequest?.appraisedValue && (
        <div className="card p-6">
          <h3 className="font-semibold mb-3">گزارش ارزیابی</h3>
          <div className="grid grid-cols-2 gap-4">
            <InfoItem label="ارزش ارزیابی‌شده" value={formatPrice(caseItem.appraisalRequest.appraisedValue)} />
            <InfoItem label="ارزیاب" value={caseItem.appraisalRequest.appraiser?.fullName || '—'} />
          </div>
          {caseItem.appraisalRequest.reportNotes && (
            <p className="text-sm text-slate-600 mt-3">{caseItem.appraisalRequest.reportNotes}</p>
          )}
        </div>
      )}

      {/* Action panels based on status and role */}
      <ActionPanel title="عملیات">
        {caseItem.status === 'DRAFT' && (role === 'BUYER' || role === 'ADMIN') && (
          <button
            className="btn-primary"
            disabled={!!loading}
            onClick={() => act('submit', () => import('@/lib/api').then(({ api }) => api.submitCase(caseItem.id, token)))}
          >
            {loading === 'submit' ? '...' : 'ارسال درخواست'}
          </button>
        )}

        {caseItem.status === 'SUBMITTED' && role === 'ADMIN' && (
          <div className="space-y-3">
            <button
              className="btn-primary"
              disabled={!!loading}
              onClick={() => act('bank', () => import('@/lib/api').then(({ api }) => api.sendToBank(caseItem.id, token)))}
            >
              {loading === 'bank' ? '...' : 'ارجاع به بانک'}
            </button>
            {!caseItem.seller && sellers.length > 0 && (
              <div className="flex gap-2 items-end">
                <div className="flex-1">
                  <label className="label">اتصال فروشنده</label>
                  <select className="input" value={selectedSeller} onChange={(e) => setSelectedSeller(e.target.value)}>
                    <option value="">انتخاب فروشنده</option>
                    {sellers.map((s) => (
                      <option key={s.id} value={s.id}>{s.fullName}</option>
                    ))}
                  </select>
                </div>
                <button
                  className="btn-secondary"
                  disabled={!selectedSeller || !!loading}
                  onClick={() => act('seller', () => import('@/lib/api').then(({ api }) => api.assignSeller(caseItem.id, selectedSeller, token)))}
                >
                  اتصال
                </button>
              </div>
            )}
          </div>
        )}

        {caseItem.status === 'BANK_REVIEW' && (role === 'BANK_OPS' || role === 'ADMIN') && (
          <div className="space-y-3">
            <select className="input max-w-xs" value={bankResult} onChange={(e) => setBankResult(e.target.value)}>
              <option value="APPROVED">تأیید</option>
              <option value="CONDITIONAL">تأیید مشروط</option>
              <option value="REJECTED">رد</option>
            </select>
            {bankResult === 'REJECTED' && (
              <input className="input max-w-md" placeholder="دلیل رد" value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} />
            )}
            <button
              className="btn-primary"
              disabled={!!loading}
              onClick={() => act('review', () =>
                import('@/lib/api').then(({ api }) =>
                  api.reviewCredit(caseItem.id, {
                    result: bankResult,
                    rejectionReason: rejectReason || undefined,
                  }, token),
                ),
              )}
            >
              {loading === 'review' ? '...' : 'ثبت نتیجه اعتبارسنجی'}
            </button>
          </div>
        )}

        {caseItem.status === 'BANK_APPROVED' && role === 'ADMIN' && (
          <button
            className="btn-primary"
            disabled={!!loading}
            onClick={() => act('appraisal', () => import('@/lib/api').then(({ api }) => api.requestAppraisal(caseItem.id, token)))}
          >
            {loading === 'appraisal' ? '...' : 'درخواست ارزیابی ملک'}
          </button>
        )}

        {caseItem.status === 'APPRAISAL_REQUESTED' && (role === 'APPRAISER' || role === 'ADMIN') && (
          <button
            className="btn-primary"
            disabled={!!loading}
            onClick={() => act('accept', () => import('@/lib/api').then(({ api }) => api.acceptAppraisal(caseItem.id, token)))}
          >
            {loading === 'accept' ? '...' : 'پذیرش و شروع ارزیابی'}
          </button>
        )}

        {caseItem.status === 'APPRAISAL_IN_PROGRESS' && (role === 'APPRAISER' || role === 'ADMIN') && (
          <div className="space-y-3 max-w-md">
            <div>
              <label className="label">ارزش ملک (ریال)</label>
              <input className="input" type="number" value={appraisalValue} onChange={(e) => setAppraisalValue(e.target.value)} placeholder="8000000000" />
            </div>
            <div>
              <label className="label">یادداشت گزارش</label>
              <textarea className="input" rows={3} value={appraisalNotes} onChange={(e) => setAppraisalNotes(e.target.value)} placeholder="گزارش رسمی ارزیابی..." />
            </div>
            <button
              className="btn-success"
              disabled={!appraisalValue || !!loading}
              onClick={() => act('submitAppraisal', () =>
                import('@/lib/api').then(({ api }) =>
                  api.submitAppraisal(caseItem.id, {
                    appraisedValue: Number(appraisalValue),
                    reportNotes: appraisalNotes,
                  }, token),
                ),
              )}
            >
              {loading === 'submitAppraisal' ? '...' : 'ثبت گزارش ارزیابی'}
            </button>
          </div>
        )}

        {caseItem.status === 'READY_FOR_DEAL' && role === 'ADMIN' && (
          <button
            className="btn-success"
            disabled={!!loading}
            onClick={() => act('deal', () => import('@/lib/api').then(({ api }) => api.completeDeal(caseItem.id, token)))}
          >
            {loading === 'deal' ? '...' : 'تکمیل معامله'}
          </button>
        )}

        {!['COMPLETED', 'CANCELLED'].includes(caseItem.status) && (role === 'ADMIN' || role === 'BUYER') && (
          <button
            className="btn-danger mr-2"
            disabled={!!loading}
            onClick={() => {
              if (confirm('آیا از لغو پرونده مطمئن هستید؟')) {
                act('cancel', () => import('@/lib/api').then(({ api }) => api.cancelCase(caseItem.id, token)));
              }
            }}
          >
            لغو پرونده
          </button>
        )}
      </ActionPanel>

      <div className="card p-6">
        <h3 className="font-semibold mb-4">تاریخچه پرونده</h3>
        <CaseTimeline events={caseItem.events} />
      </div>
    </div>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-slate-400">{label}</p>
      <p className="text-sm font-medium mt-0.5">{value}</p>
    </div>
  );
}

function ActionPanel({ title, children }: { title: string; children: React.ReactNode }) {
  if (!children) return null;
  return (
    <div className="card p-6 border-brand-200 bg-brand-50/30">
      <h3 className="font-semibold mb-3">{title}</h3>
      {children}
    </div>
  );
}

export function WorkflowSteps({ currentStatus }: { currentStatus: string }) {
  const steps = [
    'SUBMITTED',
    'BANK_REVIEW',
    'BANK_APPROVED',
    'APPRAISAL_REQUESTED',
    'APPRAISAL_IN_PROGRESS',
    'READY_FOR_DEAL',
    'COMPLETED',
  ];

  const statusOrder = steps.indexOf(currentStatus);
  const isRejected = currentStatus === 'BANK_REJECTED' || currentStatus === 'CANCELLED';

  return (
    <div className="card p-6">
      <h3 className="font-semibold mb-4">مراحل فرآیند</h3>
      <div className="flex flex-wrap gap-2">
        {steps.map((step, i) => {
          const done = statusOrder > i || currentStatus === 'COMPLETED';
          const active = steps[i] === currentStatus || (currentStatus === 'BANK_APPROVED' && step === 'BANK_APPROVED');
          return (
            <div
              key={step}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium ${
                isRejected ? 'bg-red-50 text-red-400' :
                done ? 'bg-emerald-100 text-emerald-700' :
                active ? 'bg-brand-100 text-brand-700 ring-2 ring-brand-300' :
                'bg-slate-100 text-slate-400'
              }`}
            >
              {STATUS_LABELS[step as keyof typeof STATUS_LABELS]}
            </div>
          );
        })}
      </div>
    </div>
  );
}
