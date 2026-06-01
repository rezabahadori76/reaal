'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getDashboardRoute } from '@/lib/auth-context';
import { AuthBackground, MeshBackground } from '@/components/background';
import { Logo } from '@/components/ui';
import { LanguageSwitcher, useLocale } from '@/lib/i18n';

export default function RegisterPage() {
  const { t } = useLocale();
  const [form, setForm] = useState({
    email: '',
    password: '',
    fullName: '',
    phone: '',
    role: 'BUYER',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { api } = await import('@/lib/api');
      const { user, token } = await api.register(form);
      localStorage.setItem('token', token);
      router.push(getDashboardRoute(user.role));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-surface">
      <AuthBackground />

      <div className="flex-1 flex items-center justify-center p-6 relative">
        <MeshBackground className="lg:hidden" />
        <div className="w-full max-w-md relative z-10 animate-slide-up">
          <div className="mb-8 lg:hidden flex items-center justify-between">
            <Logo size="lg" />
            <LanguageSwitcher />
          </div>

          <div className="glass-strong p-8">
            <div className="mb-8 hidden lg:flex items-start justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-white">{t('createAccount')}</h1>
                <p className="text-slate-400 text-sm mt-2">{t('createAccountSubtitle')}</p>
              </div>
              <LanguageSwitcher />
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-4 rounded-xl">{error}</div>
              )}
              <div>
                <label className="label">{t('fullName')}</label>
                <input className="input" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} required placeholder="Ali Al-Harthy" />
              </div>
              <div>
                <label className="label">{t('email')}</label>
                <input className="input" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required dir="ltr" placeholder="email@example.com" />
              </div>
              <div>
                <label className="label">{t('phone')}</label>
                <input className="input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+968 9123 4567" />
              </div>
              <div>
                <label className="label">{t('role')}</label>
                <select className="input" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
                  <option value="BUYER">{t('actorBuyer')}</option>
                  <option value="SELLER">{t('actorSeller')}</option>
                </select>
              </div>
              <div>
                <label className="label">{t('password')}</label>
                <input className="input" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required minLength={6} dir="ltr" placeholder={t('minPassword')} />
              </div>
              <button type="submit" className="btn-primary w-full py-3.5 mt-2" disabled={loading}>
                {loading ? t('creating') : t('register')}
              </button>
              <p className="text-center text-sm text-slate-500">
                {t('haveAccount')}{' '}
                <Link href="/login" className="text-accent-light hover:underline font-medium">{t('login')}</Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
