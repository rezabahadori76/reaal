'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth, getDashboardRoute } from '@/lib/auth-context';

export default function RegisterPage() {
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
      setError(err instanceof Error ? err.message : 'خطا در ثبت‌نام');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="text-2xl font-bold text-brand-900">پلتفرم ملک</Link>
          <p className="text-slate-500 mt-1">ایجاد حساب کاربری</p>
        </div>

        <form onSubmit={handleSubmit} className="card p-6 space-y-4">
          {error && (
            <div className="bg-red-50 text-red-700 text-sm p-3 rounded-lg">{error}</div>
          )}
          <div>
            <label className="label">نام و نام خانوادگی</label>
            <input className="input" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} required />
          </div>
          <div>
            <label className="label">ایمیل</label>
            <input className="input" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required dir="ltr" />
          </div>
          <div>
            <label className="label">شماره تماس</label>
            <input className="input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="09121234567" />
          </div>
          <div>
            <label className="label">نقش</label>
            <select className="input" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
              <option value="BUYER">خریدار</option>
              <option value="SELLER">فروشنده</option>
            </select>
          </div>
          <div>
            <label className="label">رمز عبور</label>
            <input className="input" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required minLength={6} dir="ltr" />
          </div>
          <button type="submit" className="btn-primary w-full" disabled={loading}>
            {loading ? '...' : 'ثبت‌نام'}
          </button>
          <p className="text-center text-sm text-slate-500">
            حساب دارید؟{' '}
            <Link href="/login" className="text-brand-600 hover:underline">ورود</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
