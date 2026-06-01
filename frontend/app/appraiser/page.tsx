'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { DashboardLayout, RequireAuth } from '@/components/layout';
import { PageHeader, LoadingSpinner, EmptyState } from '@/components/ui';
import { useAuth } from '@/lib/auth-context';
import { api } from '@/lib/api';
import { useLocale } from '@/lib/i18n';

export default function AppraiserDashboard() {
  const { t } = useLocale();
  const { token } = useAuth();
  const [pending, setPending] = useState<Awaited<ReturnType<typeof api.getAppraisalPending>>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    api.getAppraisalPending(token).then(setPending).finally(() => setLoading(false));
  }, [token]);

  return (
    <RequireAuth roles={['APPRAISER', 'ADMIN']}>
      <DashboardLayout>
        <PageHeader title={t('appraisalRequests')} subtitle={t('appraisalSubtitle')} />

        {loading ? <LoadingSpinner /> : pending.length === 0 ? (
          <EmptyState title={t('noAppraisals')} />
        ) : (
          <div className="space-y-3">
            {pending.map((item) => (
              <Link key={item.id} href={`/appraiser/cases/${item.case.id}`} className="card-hover p-6 block group">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-mono text-xs text-accent-light bg-accent/10 px-2 py-0.5 rounded-md border border-accent/20">{item.case.caseNumber}</span>
                    <p className="font-semibold text-white mt-3 group-hover:text-accent-light transition-colors">{item.case.propertyAddress}</p>
                    <p className="text-sm text-slate-500 mt-1">{item.case.propertyType} · {t('buyer')}: {item.case.buyer.fullName}</p>
                  </div>
                  <span className="badge bg-purple-500/15 text-purple-300 border-purple-500/20">
                    {item.status === 'PENDING' ? t('newStatus') : t('ongoingStatus')}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </DashboardLayout>
    </RequireAuth>
  );
}
