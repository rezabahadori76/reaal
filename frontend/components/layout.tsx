'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import clsx from 'clsx';
import { useAuth, getDashboardRoute } from '@/lib/auth-context';
import { ROLE_LABELS, UserRole } from '@/lib/types';
import { useLocale } from '@/lib/i18n';
import { Logo, LoadingSpinner } from './ui';

const NAV_ICONS: Record<string, React.ReactNode> = {
  '/admin': (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
    </svg>
  ),
  '/admin/cases': (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
    </svg>
  ),
  '/admin/users': (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
    </svg>
  ),
  '/buyer': (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
    </svg>
  ),
  '/buyer/new-case': (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
  ),
  '/seller': (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
    </svg>
  ),
  '/bank': (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6M4.5 10.5V19.5h15V10.5" />
    </svg>
  ),
  '/appraiser': (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
    </svg>
  ),
};

const navItems = (t: (key: string) => string): Record<UserRole, { href: string; label: string }[]> => ({
  ADMIN: [
    { href: '/admin', label: t('adminDashboard') },
    { href: '/admin/cases', label: t('casesManagement') },
    { href: '/admin/users', label: t('users') },
  ],
  BUYER: [
    { href: '/buyer', label: t('buyerDashboard') },
    { href: '/buyer/new-case', label: t('newRequest') },
  ],
  SELLER: [{ href: '/seller', label: t('sellerCases') }],
  BANK_OPS: [{ href: '/bank', label: t('creditReview') }],
  APPRAISER: [{ href: '/appraiser', label: t('appraisalRequests') }],
});

const ROLE_COLORS: Record<UserRole, string> = {
  ADMIN: 'bg-purple-500/15 text-purple-200 border-purple-500/20',
  BUYER: 'bg-blue-500/15 text-blue-200 border-blue-500/20',
  SELLER: 'bg-emerald-500/15 text-emerald-200 border-emerald-500/20',
  BANK_OPS: 'bg-amber-500/15 text-amber-200 border-amber-500/20',
  APPRAISER: 'bg-violet-500/15 text-violet-200 border-violet-500/20',
};

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, logout, loading } = useAuth();
  const { t } = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!user) {
    router.push('/login');
    return null;
  }

  const items = navItems(t)[user.role] || [];
  const roleLabel = ROLE_LABELS[user.role];

  return (
    <div className="min-h-screen flex bg-surface">
      <aside className="w-72 glass-strong m-4 flex flex-col shrink-0 mr-0 rounded-r-none">
        <div className="p-6 border-b border-white/10">
          <Link href="/"><Logo size="md" /></Link>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                pathname === item.href ? 'nav-link-active' : 'nav-link-inactive',
              )}
            >
              {NAV_ICONS[item.href]}
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="p-4 m-4 mt-0 glass rounded-2xl">
          <div className="flex items-center gap-3">
            <div className={clsx('w-10 h-10 rounded-xl border flex items-center justify-center font-bold text-sm', ROLE_COLORS[user.role])}>
              {user.fullName.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm text-white truncate">{user.fullName}</p>
              <p className="text-xs text-slate-500">{roleLabel}</p>
            </div>
          </div>
          <button
            onClick={() => { logout(); router.push('/login'); }}
            className="mt-4 w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
            </svg>
            {t('logout')}
          </button>
        </div>
      </aside>

      <main className="flex-1 p-6 md:p-8 overflow-auto relative">
        <div className="absolute inset-0 bg-mesh pointer-events-none opacity-30" />
        <div className="relative z-10 max-w-6xl">{children}</div>
      </main>
    </div>
  );
}

export function RequireAuth({ children, roles }: { children: React.ReactNode; roles?: UserRole[] }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  if (loading) return null;

  if (!user) {
    router.push('/login');
    return null;
  }

  if (roles && !roles.includes(user.role)) {
    router.push(getDashboardRoute(user.role));
    return null;
  }

  return <>{children}</>;
}
