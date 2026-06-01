'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth, getDashboardRoute } from '@/lib/auth-context';
import { AuthBackground, MeshBackground } from '@/components/background';
import { Logo } from '@/components/ui';
import { useLocale } from '@/lib/i18n';

const DEMO_ACCOUNTS = [
  { email: 'admin@platform.com', roleKey: 'adminBadge' },
  { email: 'buyer@demo.com', roleKey: 'actorBuyer' },
  { email: 'seller@demo.com', roleKey: 'actorSeller' },
  { email: 'bank@demo.com', roleKey: 'actorBank' },
  { email: 'appraiser@demo.com', roleKey: 'actorAppraiser' },
];

export default function LoginPage() {
  const { t } = useLocale();
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
      setError(err instanceof Error ? err.message : 'Login failed');
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
        <div className="w-full max-w-md relative z-10">
          <div className="mb-8 lg:hidden">
            <Logo size="lg" />
          </div>

          <div className="glass-strong p-8">
            <div className="mb-8 hidden lg:block">
              <h1 className="text-2xl font-bold text-white">{t('welcome')}</h1>
              <p className="text-slate-400 text-sm mt-2">{t('welcomeSubtitle')}</p>
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
                <label className="label">{t('email')}</label>
                <input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required dir="ltr" placeholder="email@example.com" />
              </div>
              <div>
                <label className="label">{t('password')}</label>
                <input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required dir="ltr" placeholder="••••••" />
              </div>
              <button type="submit" className="btn-primary w-full py-3.5" disabled={loading}>
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    {t('signingIn')}
                  </span>
                ) : t('loginCta')}
              </button>
              <p className="text-center text-sm text-slate-500">
                {t('noAccount')}{' '}
                <Link href="/register" className="text-accent-light hover:underline font-medium">{t('register')}</Link>
              </p>
            </form>
          </div>

          <div className="glass p-5 mt-5">
            <p className="text-xs text-slate-500 mb-4 text-center font-medium">{t('quickLogin')}</p>
            <div className="grid grid-cols-2 gap-2">
              {DEMO_ACCOUNTS.map((acc) => (
                <button
                  key={acc.email}
                  onClick={() => doLogin(acc.email, '123456')}
                  disabled={loading}
                  className="text-left p-3 rounded-xl border border-white/10 bg-white/[0.035] transition-all duration-200 hover:bg-white/[0.06] hover:border-white/20 hover:-translate-y-0.5 disabled:opacity-50 disabled:translate-y-0"
                >
                  <span className="font-semibold text-sm text-white">{t(acc.roleKey)}</span>
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
