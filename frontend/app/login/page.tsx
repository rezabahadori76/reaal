'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth, getDashboardRoute } from '@/lib/auth-context';
import { AuthBackground, MeshBackground } from '@/components/background';
import { Logo } from '@/components/ui';

const DEMO_ACCOUNTS = [
  { email: 'admin@platform.ir', role: 'مدیر', color: 'from-purple-500/20 to-pink-500/10 border-purple-500/20 hover:border-purple-500/40' },
  { email: 'buyer@demo.ir', role: 'خریدار', color: 'from-blue-500/20 to-cyan-500/10 border-blue-500/20 hover:border-blue-500/40' },
  { email: 'seller@demo.ir', role: 'فروشنده', color: 'from-emerald-500/20 to-teal-500/10 border-emerald-500/20 hover:border-emerald-500/40' },
  { email: 'bank@demo.ir', role: 'بانک', color: 'from-gold/20 to-orange-500/10 border-gold/20 hover:border-gold/40' },
  { email: 'appraiser@demo.ir', role: 'ارزیاب', color: 'from-violet-500/20 to-purple-500/10 border-violet-500/20 hover:border-violet-500/40' },
];

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const doLogin = async (loginEmail: string, loginPassword: string) => {
    setError('');
    setLoading(true);
    try {
      await login(loginEmail, loginPassword);
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    doLogin(email, password);
  };

  return (
    <div className="min-h-screen flex bg-surface">
      <AuthBackground />

      <div className="flex-1 flex items-center justify-center p-6 relative">
        <MeshBackground className="lg:hidden" />
        <div className="w-full max-w-md relative z-10 animate-slide-up">
          <div className="mb-8 lg:hidden">
            <Logo size="lg" />
          </div>

          <div className="glass-strong p-8">
            <div className="mb-8 hidden lg:block">
              <h1 className="text-2xl font-bold text-white">خوش آمدید</h1>
              <p className="text-slate-400 text-sm mt-2">برای ادامه وارد حساب خود شوید</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-4 rounded-xl">
                  <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                  </svg>
                  {error}
                </div>
              )}
              <div>
                <label className="label">ایمیل</label>
                <input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required dir="ltr" placeholder="email@example.com" />
              </div>
              <div>
                <label className="label">رمز عبور</label>
                <input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required dir="ltr" placeholder="••••••" />
              </div>
              <button type="submit" className="btn-primary w-full py-3.5" disabled={loading}>
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    در حال ورود...
                  </span>
                ) : 'ورود به پلتفرم'}
              </button>
              <p className="text-center text-sm text-slate-500">
                حساب ندارید؟{' '}
                <Link href="/register" className="text-accent-light hover:underline font-medium">ثبت‌نام</Link>
              </p>
            </form>
          </div>

          <div className="glass p-5 mt-5">
            <p className="text-xs text-slate-500 mb-4 text-center font-medium">ورود سریع — حساب‌های دمو</p>
            <div className="grid grid-cols-2 gap-2">
              {DEMO_ACCOUNTS.map((acc) => (
                <button
                  key={acc.email}
                  onClick={() => doLogin(acc.email, '123456')}
                  disabled={loading}
                  className={`text-right p-3 rounded-xl border bg-gradient-to-br transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-50 ${acc.color}`}
                >
                  <span className="font-semibold text-sm text-white">{acc.role}</span>
                  <span className="block text-slate-500 font-mono text-[10px] mt-1 truncate" dir="ltr">{acc.email}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
