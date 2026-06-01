'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { DashboardLayout, RequireAuth } from '@/components/layout';
import { LoadingSpinner } from '@/components/ui';
import { CaseDetailView, WorkflowSteps } from '@/components/case-components';
import { useAuth } from '@/lib/auth-context';
import { api } from '@/lib/api';
import { Case } from '@/lib/types';
import { useLocale } from '@/lib/i18n';

export default function AdminCaseDetailPage() {
  const { t, isRtl } = useLocale();
  const { id } = useParams<{ id: string }>();
  const { token, user } = useAuth();
  const [caseItem, setCaseItem] = useState<Case | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = () => {
    if (!token || !id) return;
    api.getCase(id, token).then(setCaseItem);
  };

  useEffect(() => {
    if (!token || !id) return;
    api.getCase(id, token).then(setCaseItem).finally(() => setLoading(false));
  }, [token, id]);

  return (
    <RequireAuth roles={['ADMIN']}>
      <DashboardLayout>
        <Link href="/admin/cases" className="inline-flex items-center gap-1 text-sm text-accent-light hover:text-accent transition-colors mb-6 group">
          {isRtl ? '→' : '←'} {t('back')}
        </Link>
        {loading ? <LoadingSpinner /> : caseItem && token && (
          <>
            <WorkflowSteps currentStatus={caseItem.status} />
            <div className="mt-6">
              <CaseDetailView caseItem={caseItem} token={token} onRefresh={refresh} role={user?.role} />
            </div>
          </>
        )}
      </DashboardLayout>
    </RequireAuth>
  );
}
