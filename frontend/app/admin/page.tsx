'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { DashboardLayout, RequireAuth } from '@/components/layout';
import { PageHeader, StatCard, LoadingSpinner } from '@/components/ui';
import { CaseCard } from '@/components/case-components';
import { useAuth } from '@/lib/auth-context';
import { api } from '@/lib/api';
import { DashboardStats, Case } from '@/lib/types';

export default function AdminDashboard() {
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
        <PageHeader title="داشبورد مدیریت" subtitle="نمای کلی پلتفرم" />

        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <StatCard label="کل پرونده‌ها" value={stats.totalCases} icon="📁" />
            <StatCard label="پرونده‌های فعال" value={stats.activeCases} icon="🔄" />
            <StatCard label="تکمیل شده" value={stats.completedCases} icon="✅" />
            <StatCard label="کاربران" value={stats.totalUsers} icon="👥" />
          </div>
        )}

        {stats && stats.casesByStatus.length > 0 && (
          <div className="card p-6 mb-8">
            <h3 className="font-semibold mb-4">توزیع وضعیت پرونده‌ها</h3>
            <div className="flex flex-wrap gap-3">
              {stats.casesByStatus.map((item) => (
                <div key={item.status} className="bg-slate-50 px-4 py-2 rounded-lg">
                  <span className="text-sm">{item.label}</span>
                  <span className="font-bold mr-2">{item.count}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">آخرین پرونده‌ها</h3>
          <Link href="/admin/cases" className="text-sm text-brand-600 hover:underline">مشاهده همه</Link>
        </div>
        <div className="space-y-3">
          {cases.slice(0, 5).map((c) => (
            <CaseCard key={c.id} caseItem={c} href={`/admin/cases/${c.id}`} />
          ))}
        </div>
      </DashboardLayout>
    </RequireAuth>
  );
}
