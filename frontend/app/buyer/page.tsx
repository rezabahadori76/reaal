'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { DashboardLayout, RequireAuth } from '@/components/layout';
import { PageHeader, LoadingSpinner, EmptyState } from '@/components/ui';
import { CaseCard, WorkflowSteps } from '@/components/case-components';
import { useAuth } from '@/lib/auth-context';
import { api } from '@/lib/api';
import { Case, Notification } from '@/lib/types';
import { useLocale } from '@/lib/i18n';

export default function BuyerDashboard() {
  const { t } = useLocale();
  const { token } = useAuth();
  const [cases, setCases] = useState<Case[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    Promise.all([api.getCases(token), api.getNotifications(token)])
      .then(([c, n]) => { setCases(c); setNotifications(n); })
      .finally(() => setLoading(false));
  }, [token]);

  return (
    <RequireAuth roles={['BUYER']}>
      <DashboardLayout>
        <PageHeader
          title={t('buyerDashboard')}
          subtitle={t('buyerDashboardSubtitle')}
          action={<Link href="/buyer/new-case" className="btn-primary">{t('newRequest')}</Link>}
        />

        {cases.length > 0 && <WorkflowSteps currentStatus={cases[0].status} />}

        {notifications.filter((n) => !n.isRead).length > 0 && (
          <div className="glass p-5 mt-6 border-gold/20 bg-gold/[0.03]">
            <h3 className="font-semibold text-sm text-gold-light mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-gold animate-pulse" />
              {t('newNotifications')}
            </h3>
            {notifications.filter((n) => !n.isRead).slice(0, 3).map((n) => (
              <p key={n.id} className="text-sm text-slate-400">{n.title}: {n.message}</p>
            ))}
          </div>
        )}

        <div className="mt-6">
          {loading ? <LoadingSpinner /> : cases.length === 0 ? (
            <EmptyState
              title={t('noBuyerCases')}
              description={t('noBuyerCasesDesc')}
            />
          ) : (
            <div className="space-y-3">
              {cases.map((c) => (
                <CaseCard key={c.id} caseItem={c} href={`/buyer/cases/${c.id}`} />
              ))}
            </div>
          )}
        </div>
      </DashboardLayout>
    </RequireAuth>
  );
}
