'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { DashboardLayout, RequireAuth } from '@/components/layout';
import { PageHeader, LoadingSpinner, EmptyState } from '@/components/ui';
import { useAuth } from '@/lib/auth-context';
import { api } from '@/lib/api';
import { formatDate } from '@/lib/types';

export default function AppraiserDashboard() {
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
        <PageHeader title="درخواست‌های ارزیابی" subtitle="ارزیابی و ارزش‌گذاری ملک" />

        {loading ? <LoadingSpinner /> : pending.length === 0 ? (
          <EmptyState title="درخواست ارزیابی در انتظار نیست" />
        ) : (
          <div className="space-y-3">
            {pending.map((item) => (
              <Link key={item.id} href={`/appraiser/cases/${item.case.id}`} className="card p-5 hover:shadow-md transition-shadow block">
                <div className="flex justify-between">
                  <div>
                    <p className="font-mono text-sm text-brand-600">{item.case.caseNumber}</p>
                    <p className="font-medium mt-1">{item.case.propertyAddress}</p>
                    <p className="text-sm text-slate-500">{item.case.propertyType} · خریدار: {item.case.buyer.fullName}</p>
                  </div>
                  <span className="text-xs px-2 py-1 rounded-full bg-purple-100 text-purple-700 h-fit">
                    {item.status === 'PENDING' ? 'جدید' : 'در حال انجام'}
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
