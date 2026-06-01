'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { DashboardLayout, RequireAuth } from '@/components/layout';
import { PageHeader, LoadingSpinner, EmptyState } from '@/components/ui';
import { CaseCard } from '@/components/case-components';
import { useAuth } from '@/lib/auth-context';
import { api } from '@/lib/api';
import { Case } from '@/lib/types';
import { formatMoney, useLocale } from '@/lib/i18n';

export default function SellerDashboard() {
  const { t } = useLocale();
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
        <PageHeader title={t('sellerCases')} subtitle={t('sellerCasesSubtitle')} />

        {loading ? <LoadingSpinner /> : cases.length === 0 ? (
          <EmptyState
            title={t('noSellerCases')}
            description={t('noSellerCasesDesc')}
          />
        ) : (
          <div className="space-y-3">
            {cases.map((c) => (
              <div key={c.id}>
                <CaseCard caseItem={c} href={`/seller/cases/${c.id}`} />
                {c.status === 'COMPLETED' && c.askingPrice && (
                  <p className="text-sm text-emerald-600 mr-4 mt-1">
                    {t('receivedAmount')}: {formatMoney(c.askingPrice)}
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
