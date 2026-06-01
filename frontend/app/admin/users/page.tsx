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

  const roleColors: Record<string, string> = {
    ADMIN: 'bg-purple-500/15 text-purple-300 border-purple-500/20',
    BUYER: 'bg-blue-500/15 text-blue-300 border-blue-500/20',
    SELLER: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/20',
    BANK_OPS: 'bg-gold/15 text-gold-light border-gold/20',
    APPRAISER: 'bg-violet-500/15 text-violet-300 border-violet-500/20',
  };

  return (
    <RequireAuth roles={['ADMIN']}>
      <DashboardLayout>
        <PageHeader title="مدیریت کاربران" subtitle={`${users.length} کاربر ثبت‌شده`} badge="مدیریت" />
        {loading ? <LoadingSpinner /> : (
          <div className="glass overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-right p-4 font-medium text-slate-400">نام</th>
                  <th className="text-right p-4 font-medium text-slate-400">ایمیل</th>
                  <th className="text-right p-4 font-medium text-slate-400">نقش</th>
                  <th className="text-right p-4 font-medium text-slate-400">تماس</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="border-b border-white/[0.03] last:border-0 hover:bg-white/[0.02] transition-colors">
                    <td className="p-4 font-medium text-white">{u.fullName}</td>
                    <td className="p-4 font-mono text-xs text-slate-400" dir="ltr">{u.email}</td>
                    <td className="p-4">
                      <span className={`badge ${roleColors[u.role]}`}>
                        {ROLE_LABELS[u.role]}
                      </span>
                    </td>
                    <td className="p-4 text-slate-500">{u.phone || '—'}</td>
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
