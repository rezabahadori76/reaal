'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { DashboardLayout, RequireAuth } from '@/components/layout';
import { PageHeader, LoadingSpinner, EmptyState } from '@/components/ui';
import { CaseCard } from '@/components/case-components';
import { useAuth } from '@/lib/auth-context';
import { api } from '@/lib/api';
import { Case } from '@/lib/types';

export default function BankDashboard() {
  const { token } = useAuth();
  const [pending, setPending] = useState<Case[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    api.getBankPending(token).then(setPending).finally(() => setLoading(false));
  }, [token]);

  return (
    <RequireAuth roles={['BANK_OPS', 'ADMIN']}>
      <DashboardLayout>
        <PageHeader title="بررسی اعتباری" subtitle="پرونده‌های در انتظار بررسی بانک" />

        {loading ? <LoadingSpinner /> : pending.length === 0 ? (
          <EmptyState title="پرونده‌ای در انتظار بررسی نیست" />
        ) : (
          <div className="space-y-3">
            {pending.map((c) => (
              <CaseCard key={c.id} caseItem={c} href={`/bank/cases/${c.id}`} />
            ))}
          </div>
        )}
      </DashboardLayout>
    </RequireAuth>
  );
}
