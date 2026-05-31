'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import clsx from 'clsx';
import { useAuth, getDashboardRoute } from '@/lib/auth-context';
import { ROLE_LABELS, UserRole } from '@/lib/types';

const NAV_ITEMS: Record<UserRole, { href: string; label: string }[]> = {
  ADMIN: [
    { href: '/admin', label: 'داشبورد' },
    { href: '/admin/cases', label: 'پرونده‌ها' },
    { href: '/admin/users', label: 'کاربران' },
  ],
  BUYER: [
    { href: '/buyer', label: 'داشبورد' },
    { href: '/buyer/new-case', label: 'درخواست جدید' },
  ],
  SELLER: [{ href: '/seller', label: 'پرونده‌های من' }],
  BANK_OPS: [{ href: '/bank', label: 'بررسی اعتباری' }],
  APPRAISER: [{ href: '/appraiser', label: 'درخواست‌های ارزیابی' }],
};

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, logout, loading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    router.push('/login');
    return null;
  }

  const navItems = NAV_ITEMS[user.role] || [];

  return (
    <div className="min-h-screen flex">
      <aside className="w-64 bg-brand-900 text-white flex flex-col">
        <div className="p-6 border-b border-brand-700">
          <Link href="/" className="text-lg font-bold">پلتفرم ملک</Link>
          <p className="text-xs text-brand-300 mt-1">تأمین مالی یکپارچه</p>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                'block px-3 py-2 rounded-lg text-sm transition-colors',
                pathname === item.href
                  ? 'bg-brand-700 text-white'
                  : 'text-brand-200 hover:bg-brand-800 hover:text-white',
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-brand-700">
          <div className="text-sm">
            <p className="font-medium">{user.fullName}</p>
            <p className="text-brand-300 text-xs mt-0.5">{ROLE_LABELS[user.role]}</p>
          </div>
          <button
            onClick={() => { logout(); router.push('/login'); }}
            className="mt-3 w-full text-xs text-brand-300 hover:text-white transition-colors text-right"
          >
            خروج از حساب
          </button>
        </div>
      </aside>
      <main className="flex-1 p-8 overflow-auto">{children}</main>
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
