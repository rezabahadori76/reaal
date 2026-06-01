'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { DashboardLayout, RequireAuth } from '@/components/layout';
import { PageHeader, StatCard, LoadingSpinner } from '@/components/ui';
import { CaseCard } from '@/components/case-components';
import { useAuth } from '@/lib/auth-context';
import { api } from '@/lib/api';
import { DashboardStats, Case } from '@/lib/types';
import { useLocale } from '@/lib/i18n';

export default function AdminDashboard() {
  const { t, isRtl } = useLocale();
  const { token } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [cases, setCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    Promise.all([api.getDashboardStats(token), api.getCases(token)])
      .then(([s, c]) => { setStats(s); setCases(c); })
      .finally(() => setLoading(false));
  }, [token]);

  if (loading) return <DashboardLayout><LoadingSpinner /></DashboardLayout>;

  return (
    <RequireAuth roles={['ADMIN']}>
      <DashboardLayout>
        <PageHeader
          title={t('adminDashboard')}
          subtitle={t('adminSubtitle')}
          badge={t('adminBadge')}
        />

        {stats && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
            <StatCard label={t('totalCases')} value={stats.totalCases} accent="blue" icon="📁" />
            <StatCard label={t('activeCases')} value={stats.activeCases} accent="gold" trend={t('inProgress')} icon="⚡" />
            <StatCard label={t('completedCases')} value={stats.completedCases} accent="emerald" icon="✅" />
            <StatCard label={t('users')} value={stats.totalUsers} accent="purple" icon="👥" />
          </div>
        )}

        {stats && stats.casesByStatus.length > 0 && (
          <div className="glass p-6 mb-8">
            <h3 className="font-semibold text-white mb-5">{t('casesByStatus')}</h3>
            <div className="flex flex-wrap gap-3">
              {stats.casesByStatus.map((item) => (
                <div key={item.status} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/5">
                  <span className="text-sm text-slate-400">{item.label}</span>
                  <span className="font-bold text-accent-light">{item.count}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between mb-5">
          <h3 className="font-semibold text-white">{t('latestCases')}</h3>
          <Link href="/admin/cases" className="text-sm text-accent-light hover:underline flex items-center gap-1">
            {t('viewAll')}
            <svg className={`w-4 h-4 ${isRtl ? '' : 'rotate-180'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
          </Link>
        </div>
        <div className="space-y-4">
          {cases.slice(0, 5).map((c) => (
            <CaseCard key={c.id} caseItem={c} href={`/admin/cases/${c.id}`} />
          ))}
        </div>
      </DashboardLayout>
    </RequireAuth>
  );
}
