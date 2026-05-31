'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth, getDashboardRoute } from '@/lib/auth-context';

const DEMO_ACCOUNTS = [
  { email: 'admin@platform.ir', role: 'مدیر' },
  { email: 'buyer@demo.ir', role: 'خریدار' },
  { email: 'seller@demo.ir', role: 'فروشنده' },
  { email: 'bank@demo.ir', role: 'بانک' },
  { email: 'appraiser@demo.ir', role: 'ارزیاب' },
];

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      const token = localStorage.getItem('token');
      if (token) {
        const { api } = await import('@/lib/api');
        const user = await api.me(token);
        router.push(getDashboardRoute(user.role));
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'خطا در ورود');
    } finally {
      setLoading(false);
    }
  };

  const quickLogin = async (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('123456');
    setLoading(true);
    try {
      await login(demoEmail, '123456');
      const token = localStorage.getItem('token');
      if (token) {
        const { api } = await import('@/lib/api');
        const user = await api.me(token);
        router.push(getDashboardRoute(user.role));
      }
    } catch {
      setError('خطا در ورود سریع');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="text-2xl font-bold text-brand-900">پلتفرم ملک</Link>
          <p className="text-slate-500 mt-1">ورود به حساب کاربری</p>
        </div>

        <form onSubmit={handleSubmit} className="card p-6 space-y-4">
          {error && (
            <div className="bg-red-50 text-red-700 text-sm p-3 rounded-lg">{error}</div>
          )}
          <div>
            <label className="label">ایمیل</label>
            <input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required dir="ltr" />
          </div>
          <div>
            <label className="label">رمز عبور</label>
            <input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required dir="ltr" />
          </div>
          <button type="submit" className="btn-primary w-full" disabled={loading}>
            {loading ? 'در حال ورود...' : 'ورود'}
          </button>
          <p className="text-center text-sm text-slate-500">
            حساب ندارید؟{' '}
            <Link href="/register" className="text-brand-600 hover:underline">ثبت‌نام</Link>
          </p>
        </form>

        <div className="card p-4 mt-4">
          <p className="text-xs text-slate-500 mb-3 text-center">ورود سریع — حساب‌های دمو (رمز: 123456)</p>
          <div className="grid grid-cols-2 gap-2">
            {DEMO_ACCOUNTS.map((acc) => (
              <button
                key={acc.email}
                onClick={() => quickLogin(acc.email)}
                disabled={loading}
                className="text-xs p-2 rounded-lg border border-slate-200 hover:bg-brand-50 hover:border-brand-300 transition-colors text-right"
              >
                <span className="font-medium">{acc.role}</span>
                <span className="block text-slate-400 font-mono mt-0.5" dir="ltr">{acc.email}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
