'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardLayout, RequireAuth } from '@/components/layout';
import { PageHeader } from '@/components/ui';
import { useAuth } from '@/lib/auth-context';
import { api } from '@/lib/api';
import { useLocale } from '@/lib/i18n';

export default function NewCasePage() {
  const { t } = useLocale();
  const { token } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    propertyAddress: '',
    propertyType: 'Apartment',
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
      alert(err instanceof Error ? err.message : 'Error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <RequireAuth roles={['BUYER']}>
      <DashboardLayout>
        <PageHeader title={t('submitPropertyRequest')} subtitle={t('submitPropertySubtitle')} />

        <form onSubmit={handleSubmit} className="card p-6 max-w-2xl space-y-4">
          <div>
            <label className="label">{t('propertyAddress')}</label>
            <input className="input" value={form.propertyAddress} onChange={(e) => setForm({ ...form, propertyAddress: e.target.value })} required placeholder="Muscat, Al Mouj, Building 12" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">{t('propertyType')}</label>
              <select className="input" value={form.propertyType} onChange={(e) => setForm({ ...form, propertyType: e.target.value })}>
                <option>Apartment</option>
                <option>Villa</option>
                <option>Land</option>
                <option>Commercial</option>
              </select>
            </div>
            <div>
              <label className="label">{t('area')}</label>
              <input className="input" type="number" value={form.propertyArea} onChange={(e) => setForm({ ...form, propertyArea: e.target.value })} placeholder="120" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">{t('askingPrice')}</label>
              <input className="input" type="number" value={form.askingPrice} onChange={(e) => setForm({ ...form, askingPrice: e.target.value })} placeholder="80000" />
            </div>
            <div>
              <label className="label">{t('monthlyIncome')}</label>
              <input className="input" type="number" value={form.buyerIncome} onChange={(e) => setForm({ ...form, buyerIncome: e.target.value })} placeholder="1200" />
            </div>
          </div>
          <div>
            <label className="label">{t('propertySource')}</label>
            <select className="input" value={form.propertySource} onChange={(e) => setForm({ ...form, propertySource: e.target.value })}>
              <option value="EXTERNAL">{t('externalProperty')}</option>
              <option value="PLATFORM">{t('platformProperty')}</option>
            </select>
          </div>
          <div>
            <label className="label">{t('notes')}</label>
            <textarea className="input" rows={3} value={form.buyerNotes} onChange={(e) => setForm({ ...form, buyerNotes: e.target.value })} placeholder="First home purchase, looking for 70% financing..." />
          </div>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? t('submitting') : t('submitAndSend')}
          </button>
        </form>
      </DashboardLayout>
    </RequireAuth>
  );
}
