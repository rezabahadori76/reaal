'use client';

import { useEffect, useState } from 'react';
import { DashboardLayout, RequireAuth } from '@/components/layout';
import { PageHeader, LoadingSpinner, EmptyState } from '@/components/ui';
import { CaseCard } from '@/components/case-components';
import { useAuth } from '@/lib/auth-context';
import { api } from '@/lib/api';
import { Case } from '@/lib/types';
import { useLocale } from '@/lib/i18n';

export default function AdminCasesPage() {
  const { t } = useLocale();
  const { token } = useAuth();
  const [cases, setCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    api.getCases(token).then(setCases).finally(() => setLoading(false));
  }, [token]);

  return (
    <RequireAuth roles={['ADMIN']}>
      <DashboardLayout>
        <PageHeader title={t('casesManagement')} subtitle={`${cases.length} ${t('caseCount')}`} />
        {loading ? <LoadingSpinner /> : cases.length === 0 ? (
          <EmptyState title={t('noCases')} />
        ) : (
          <div className="space-y-3">
            {cases.map((c) => (
              <CaseCard key={c.id} caseItem={c} href={`/admin/cases/${c.id}`} />
            ))}
          </div>
        )}
      </DashboardLayout>
    </RequireAuth>
  );
}
