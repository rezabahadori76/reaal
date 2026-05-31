'use client';

import { useEffect, useState } from 'react';
import { DashboardLayout, RequireAuth } from '@/components/layout';
import { PageHeader, LoadingSpinner } from '@/components/ui';
import { useAuth } from '@/lib/auth-context';
import { api } from '@/lib/api';
import { User, ROLE_LABELS } from '@/lib/types';

export default function AdminUsersPage() {
  const { token } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    api.getUsers(token).then(setUsers).finally(() => setLoading(false));
  }, [token]);

  return (
    <RequireAuth roles={['ADMIN']}>
      <DashboardLayout>
        <PageHeader title="مدیریت کاربران" subtitle={`${users.length} کاربر`} />
        {loading ? <LoadingSpinner /> : (
          <div className="card overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b">
                <tr>
                  <th className="text-right p-3 font-medium">نام</th>
                  <th className="text-right p-3 font-medium">ایمیل</th>
                  <th className="text-right p-3 font-medium">نقش</th>
                  <th className="text-right p-3 font-medium">تماس</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="border-b last:border-0 hover:bg-slate-50">
                    <td className="p-3">{u.fullName}</td>
                    <td className="p-3 font-mono text-xs" dir="ltr">{u.email}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded-full bg-brand-50 text-brand-700 text-xs">
                        {ROLE_LABELS[u.role]}
                      </span>
                    </td>
                    <td className="p-3 text-slate-500">{u.phone || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </DashboardLayout>
    </RequireAuth>
  );
}
