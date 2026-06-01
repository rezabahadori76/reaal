'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Case, STATUS_LABELS } from '@/lib/types';
import { formatLocalizedDate, formatMoney, useLocale } from '@/lib/i18n';
import { StatusBadge } from './ui';

export function CaseCard({ caseItem, href }: { caseItem: Case; href: string }) {
  const { t } = useLocale();

  return (
    <Link href={href} className="card-hover p-6 block group">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-mono text-xs text-accent-light bg-accent/10 px-2.5 py-1 rounded-full border border-accent/20">
              {caseItem.caseNumber}
            </span>
          </div>
          <p className="font-semibold text-white group-hover:text-accent-light transition-colors truncate">{caseItem.propertyAddress}</p>
          <p className="text-sm text-slate-500 mt-1.5">
            {caseItem.propertyType}
            {caseItem.propertyArea ? ` · ${caseItem.propertyArea} sqm` : ''}
          </p>
        </div>
        <StatusBadge status={caseItem.status} />
      </div>
      <div className="flex flex-wrap items-center gap-x-5 gap-y-1 mt-4 pt-4 border-t border-white/5 text-xs text-slate-500">
        <span className="flex items-center gap-1.5">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0" /></svg>
          {caseItem.buyer.fullName}
        </span>
        {caseItem.askingPrice && (
          <span className="text-gold-light font-medium">{formatMoney(caseItem.askingPrice)}</span>
        )}
        <span>{formatLocalizedDate(caseItem.updatedAt)}</span>
      </div>
    </Link>
  );
}

export function CaseTimeline({ events }: { events: Case['events'] }) {
  const { t } = useLocale();
  if (!events?.length) return <p className="text-sm text-slate-500">{t('noEvents')}</p>;

  return (
    <div className="relative">
      <div className="absolute top-2 bottom-2 left-[5px] w-px bg-gradient-to-b from-accent/50 via-accent/20 to-transparent" />
      <div className="space-y-6">
        {events.map((event, i) => (
          <div key={event.id} className="flex gap-4 relative">
            <div className={`timeline-dot shrink-0 z-10 ${i === 0 ? '' : 'opacity-60'}`} />
            <div className="flex-1 pb-1">
              <p className="text-sm font-medium text-slate-200">{event.message}</p>
              <p className="text-xs text-slate-500 mt-1">
                {event.user?.fullName && <span className="text-slate-400">{event.user.fullName} · </span>}
                {formatLocalizedDate(event.createdAt)}
              </p>
            </div>
          </div>
        ))}
      </div>
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
  const { t } = useLocale();
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
      alert(e instanceof Error ? e.message : 'Error');
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
      <div className="glass-strong p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <span className="font-mono text-xs text-accent-light bg-accent/10 px-2.5 py-1 rounded-full border border-accent/20">{caseItem.caseNumber}</span>
            <h2 className="text-xl font-bold text-white mt-3">{caseItem.propertyAddress}</h2>
            <p className="text-slate-400 mt-1">
              {caseItem.propertyType}
              {caseItem.propertyArea ? ` · ${caseItem.propertyArea} sqm` : ''}
            </p>
          </div>
          <StatusBadge status={caseItem.status} />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
          <InfoItem label={t('price')} value={formatMoney(caseItem.askingPrice)} />
          <InfoItem label={t('income')} value={formatMoney(caseItem.buyerIncome)} />
          <InfoItem label={t('buyer')} value={caseItem.buyer.fullName} />
          <InfoItem label={t('seller')} value={caseItem.seller?.fullName || '—'} />
        </div>

        {caseItem.buyerNotes && (
          <p className="text-sm text-slate-400 mt-4 bg-white/[0.035] border border-white/10 p-4 rounded-xl leading-relaxed">
            {caseItem.buyerNotes}
          </p>
        )}
      </div>

      {caseItem.bankCreditCheck && caseItem.bankCreditCheck.result !== 'PENDING' && (
        <div className="glass p-6">
          <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-gold" /> {t('bankResult')}
          </h3>
          <div className="grid grid-cols-3 gap-4">
            <InfoItem label={t('result')} value={caseItem.bankCreditCheck.result === 'APPROVED' ? t('approved') : caseItem.bankCreditCheck.result === 'REJECTED' ? t('rejected') : t('conditional')} />
            <InfoItem label={t('maxLoan')} value={formatMoney(caseItem.bankCreditCheck.maxLoanAmount)} />
            <InfoItem label={t('interestRate')} value={caseItem.bankCreditCheck.interestRate ? `${caseItem.bankCreditCheck.interestRate}%` : '—'} />
          </div>
        </div>
      )}

      {caseItem.appraisalRequest?.appraisedValue && (
        <div className="glass p-6">
          <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-purple-400" /> {t('valuationReport')}
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <InfoItem label={t('appraisedValue')} value={formatMoney(caseItem.appraisalRequest.appraisedValue)} />
            <InfoItem label={t('appraiser')} value={caseItem.appraisalRequest.appraiser?.fullName || '—'} />
          </div>
          {caseItem.appraisalRequest.reportNotes && (
            <p className="text-sm text-slate-400 mt-3 bg-white/[0.03] p-3 rounded-xl">{caseItem.appraisalRequest.reportNotes}</p>
          )}
        </div>
      )}

      {/* Action panels based on status and role */}
      <ActionPanel title={t('actions')}>
        {caseItem.status === 'DRAFT' && (role === 'BUYER' || role === 'ADMIN') && (
          <button
            className="btn-primary"
            disabled={!!loading}
            onClick={() => act('submit', () => import('@/lib/api').then(({ api }) => api.submitCase(caseItem.id, token)))}
          >
            {loading === 'submit' ? '...' : t('submitRequest')}
          </button>
        )}

        {caseItem.status === 'SUBMITTED' && role === 'ADMIN' && (
          <div className="space-y-3">
            <button
              className="btn-primary"
              disabled={!!loading}
              onClick={() => act('bank', () => import('@/lib/api').then(({ api }) => api.sendToBank(caseItem.id, token)))}
            >
              {loading === 'bank' ? '...' : t('sendToBank')}
            </button>
            {!caseItem.seller && sellers.length > 0 && (
              <div className="flex gap-2 items-end">
                <div className="flex-1">
                  <label className="label">{t('assignSeller')}</label>
                  <select className="input" value={selectedSeller} onChange={(e) => setSelectedSeller(e.target.value)}>
                    <option value="">{t('selectSeller')}</option>
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
                  {t('assignSeller')}
                </button>
              </div>
            )}
          </div>
        )}

        {caseItem.status === 'BANK_REVIEW' && (role === 'BANK_OPS' || role === 'ADMIN') && (
          <div className="space-y-3">
            <select className="input max-w-xs" value={bankResult} onChange={(e) => setBankResult(e.target.value)}>
              <option value="APPROVED">{t('approve')}</option>
              <option value="CONDITIONAL">{t('conditionalApprove')}</option>
              <option value="REJECTED">{t('reject')}</option>
            </select>
            {bankResult === 'REJECTED' && (
              <input className="input max-w-md" placeholder={t('rejectionReason')} value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} />
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
              {loading === 'review' ? '...' : t('submitBankResult')}
            </button>
          </div>
        )}

        {caseItem.status === 'BANK_APPROVED' && role === 'ADMIN' && (
          <button
            className="btn-primary"
            disabled={!!loading}
            onClick={() => act('appraisal', () => import('@/lib/api').then(({ api }) => api.requestAppraisal(caseItem.id, token)))}
          >
            {loading === 'appraisal' ? '...' : t('requestValuation')}
          </button>
        )}

        {caseItem.status === 'APPRAISAL_REQUESTED' && (role === 'APPRAISER' || role === 'ADMIN') && (
          <button
            className="btn-primary"
            disabled={!!loading}
            onClick={() => act('accept', () => import('@/lib/api').then(({ api }) => api.acceptAppraisal(caseItem.id, token)))}
          >
            {loading === 'accept' ? '...' : t('acceptValuation')}
          </button>
        )}

        {caseItem.status === 'APPRAISAL_IN_PROGRESS' && (role === 'APPRAISER' || role === 'ADMIN') && (
          <div className="space-y-3 max-w-md">
            <div>
              <label className="label">{t('propertyValue')}</label>
              <input className="input" type="number" value={appraisalValue} onChange={(e) => setAppraisalValue(e.target.value)} placeholder="8000000000" />
            </div>
            <div>
              <label className="label">{t('reportNotes')}</label>
              <textarea className="input" rows={3} value={appraisalNotes} onChange={(e) => setAppraisalNotes(e.target.value)} placeholder={t('reportNotes')} />
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
              {loading === 'submitAppraisal' ? '...' : t('submitValuation')}
            </button>
          </div>
        )}

        {caseItem.status === 'READY_FOR_DEAL' && role === 'ADMIN' && (
          <button
            className="btn-success"
            disabled={!!loading}
            onClick={() => act('deal', () => import('@/lib/api').then(({ api }) => api.completeDeal(caseItem.id, token)))}
          >
            {loading === 'deal' ? '...' : t('completeDeal')}
          </button>
        )}

        {!['COMPLETED', 'CANCELLED'].includes(caseItem.status) && (role === 'ADMIN' || role === 'BUYER') && (
          <button
            className="btn-danger mr-2"
            disabled={!!loading}
            onClick={() => {
              if (confirm(t('confirmCancel'))) {
                act('cancel', () => import('@/lib/api').then(({ api }) => api.cancelCase(caseItem.id, token)));
              }
            }}
          >
            {t('cancelCase')}
          </button>
        )}
      </ActionPanel>

      <div className="glass p-6">
        <h3 className="font-semibold text-white mb-5">{t('timeline')}</h3>
        <CaseTimeline events={caseItem.events} />
      </div>
    </div>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-4 rounded-xl bg-white/[0.035] border border-white/10">
      <p className="text-xs text-slate-500 font-medium">{label}</p>
      <p className="text-sm font-semibold text-white mt-1">{value}</p>
    </div>
  );
}

function ActionPanel({ title, children }: { title: string; children: React.ReactNode }) {
  if (!children) return null;
  return (
    <div className="glass p-6 border-accent/15 bg-accent/[0.035]">
      <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-accent" />
        {title}
      </h3>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

export function WorkflowSteps({ currentStatus }: { currentStatus: string }) {
  const { t } = useLocale();
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
    <div className="glass p-6 mb-6">
      <h3 className="font-semibold text-white mb-6">{t('workflow')}</h3>
      <div className="relative">
        <div className="absolute top-5 right-0 left-0 h-0.5 bg-white/5 hidden md:block" />
        <div className="grid grid-cols-2 md:grid-cols-7 gap-3">
          {steps.map((step, i) => {
            const done = statusOrder > i || currentStatus === 'COMPLETED';
            const active = steps[i] === currentStatus || (currentStatus === 'BANK_APPROVED' && step === 'BANK_APPROVED');
            return (
              <div key={step} className="flex flex-col items-center text-center relative">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold z-10 transition-all duration-300 ${
                  isRejected ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                  done ? 'bg-accent/15 text-accent-light border border-accent/25' :
                  active ? 'bg-gold/15 text-gold-light border border-gold/30' :
                  'bg-white/5 text-slate-600 border border-white/10'
                }`}>
                  {done ? '✓' : i + 1}
                </div>
                <p className={`text-[10px] md:text-xs mt-2 leading-tight font-medium ${
                  active ? 'text-gold-light' : done ? 'text-accent-light' : 'text-slate-500'
                }`}>
                  {STATUS_LABELS[step as keyof typeof STATUS_LABELS]}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
