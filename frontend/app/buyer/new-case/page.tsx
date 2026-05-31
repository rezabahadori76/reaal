'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardLayout, RequireAuth } from '@/components/layout';
import { PageHeader } from '@/components/ui';
import { useAuth } from '@/lib/auth-context';
import { api } from '@/lib/api';

export default function NewCasePage() {
  const { token } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    propertyAddress: '',
    propertyType: 'آپارتمان',
    propertyArea: '',
    askingPrice: '',
    buyerIncome: '',
    buyerNotes: '',
    propertySource: 'EXTERNAL',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setLoading(true);
    try {
      const newCase = await api.createCase({
        propertyAddress: form.propertyAddress,
        propertyType: form.propertyType,
        propertyArea: form.propertyArea ? Number(form.propertyArea) : undefined,
        askingPrice: form.askingPrice ? Number(form.askingPrice) : undefined,
        buyerIncome: form.buyerIncome ? Number(form.buyerIncome) : undefined,
        buyerNotes: form.buyerNotes || undefined,
        propertySource: form.propertySource,
      }, token);
      await api.submitCase(newCase.id, token);
      router.push('/buyer');
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'خطا');
    } finally {
      setLoading(false);
    }
  };

  return (
    <RequireAuth roles={['BUYER']}>
      <DashboardLayout>
        <PageHeader title="ثبت درخواست خرید ملک" subtitle="اطلاعات ملک و شرایط مالی خود را وارد کنید" />

        <form onSubmit={handleSubmit} className="card p-6 max-w-2xl space-y-4">
          <div>
            <label className="label">آدرس ملک</label>
            <input className="input" value={form.propertyAddress} onChange={(e) => setForm({ ...form, propertyAddress: e.target.value })} required placeholder="تهران، سعادت‌آباد، ..." />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">نوع ملک</label>
              <select className="input" value={form.propertyType} onChange={(e) => setForm({ ...form, propertyType: e.target.value })}>
                <option>آپارتمان</option>
                <option>ویلایی</option>
                <option>زمین</option>
                <option>تجاری</option>
              </select>
            </div>
            <div>
              <label className="label">متراژ (متر مربع)</label>
              <input className="input" type="number" value={form.propertyArea} onChange={(e) => setForm({ ...form, propertyArea: e.target.value })} placeholder="120" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">قیمت درخواستی (ریال)</label>
              <input className="input" type="number" value={form.askingPrice} onChange={(e) => setForm({ ...form, askingPrice: e.target.value })} placeholder="8000000000" />
            </div>
            <div>
              <label className="label">درآمد ماهانه (ریال)</label>
              <input className="input" type="number" value={form.buyerIncome} onChange={(e) => setForm({ ...form, buyerIncome: e.target.value })} placeholder="80000000" />
            </div>
          </div>
          <div>
            <label className="label">منبع ملک</label>
            <select className="input" value={form.propertySource} onChange={(e) => setForm({ ...form, propertySource: e.target.value })}>
              <option value="EXTERNAL">انتخاب توسط خریدار</option>
              <option value="PLATFORM">معرفی شده از پلتفرم</option>
            </select>
          </div>
          <div>
            <label className="label">توضیحات</label>
            <textarea className="input" rows={3} value={form.buyerNotes} onChange={(e) => setForm({ ...form, buyerNotes: e.target.value })} placeholder="نیاز به وام ۷۰٪، خرید اول..." />
          </div>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'در حال ثبت...' : 'ثبت و ارسال درخواست'}
          </button>
        </form>
      </DashboardLayout>
    </RequireAuth>
  );
}
