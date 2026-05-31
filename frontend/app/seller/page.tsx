'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { DashboardLayout, RequireAuth } from '@/components/layout';
import { PageHeader, LoadingSpinner, EmptyState } from '@/components/ui';
import { CaseCard } from '@/components/case-components';
import { useAuth } from '@/lib/auth-context';
import { api } from '@/lib/api';
import { Case, formatPrice } from '@/lib/types';

export default function SellerDashboard() {
  const { token } = useAuth();
  const [cases, setCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    api.getCases(token).then(setCases).finally(() => setLoading(false));
  }, [token]);

  return (
    <RequireAuth roles={['SELLER']}>
      <DashboardLayout>
        <PageHeader title="پرونده‌های فروش" subtitle="ملک‌های متصل‌شده به شما" />

        {loading ? <LoadingSpinner /> : cases.length === 0 ? (
          <EmptyState
            title="پرونده‌ای به شما متصل نشده"
            description="پس از تأیید خریدار توسط مدیر، پرونده فروش اینجا نمایش داده می‌شود."
          />
        ) : (
          <div className="space-y-3">
            {cases.map((c) => (
              <div key={c.id}>
                <CaseCard caseItem={c} href={`/seller/cases/${c.id}`} />
                {c.status === 'COMPLETED' && c.askingPrice && (
                  <p className="text-sm text-emerald-600 mr-4 mt-1">
                    مبلغ دریافتی: {formatPrice(c.askingPrice)}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </DashboardLayout>
    </RequireAuth>
  );
}
