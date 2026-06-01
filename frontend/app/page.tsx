'use client';

import Link from 'next/link';
import { MeshBackground } from '@/components/background';
import { LanguageSwitcher, useLocale } from '@/lib/i18n';
import { Logo } from '@/components/ui';

const STEPS = [
  {
    num: '01',
    titleKey: 'stepApply',
    descKey: 'stepApplyDesc',
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
      </svg>
    ),
    color: 'from-blue-500/20 to-blue-600/5 border-blue-500/20',
  },
  {
    num: '02',
    titleKey: 'stepBank',
    descKey: 'stepBankDesc',
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6M4.5 10.5V19.5h15V10.5" />
      </svg>
    ),
    color: 'from-gold/20 to-gold-dark/5 border-gold/20',
  },
  {
    num: '03',
    titleKey: 'stepValuation',
    descKey: 'stepValuationDesc',
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
      </svg>
    ),
    color: 'from-purple-500/20 to-purple-600/5 border-purple-500/20',
  },
  {
    num: '04',
    titleKey: 'stepDeal',
    descKey: 'stepDealDesc',
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
      </svg>
    ),
    color: 'from-accent/20 to-accent-dark/5 border-accent/20',
  },
];

const ACTORS = [
  { roleKey: 'actorBuyer', descKey: 'actorBuyerDesc', gradient: 'from-blue-500 to-cyan-400', icon: '🏠' },
  { roleKey: 'actorSeller', descKey: 'actorSellerDesc', gradient: 'from-emerald-500 to-teal-400', icon: '💰' },
  { roleKey: 'actorBank', descKey: 'actorBankDesc', gradient: 'from-amber-500 to-orange-400', icon: '🏦' },
  { roleKey: 'actorAppraiser', descKey: 'actorAppraiserDesc', gradient: 'from-violet-500 to-purple-400', icon: '📋' },
];

export default function HomePage() {
  const { t, isRtl } = useLocale();

  return (
    <div className="min-h-screen relative">
      <MeshBackground />

      {/* Navbar */}
      <header className="fixed top-0 inset-x-0 z-50 glass border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Logo size="md" />
          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <Link href="/login" className="btn-secondary text-sm hidden sm:inline-flex">{t('login')}</Link>
            <Link href="/login" className="btn-primary text-sm">{t('startDemo')}</Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative pt-32 pb-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="animate-slide-up">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 text-accent-light text-sm font-medium mb-8">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-accent" />
                </span>
                {t('heroBadge')}
              </div>

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black leading-[1.15] tracking-tight">
                <span className="text-white">{t('heroTitleA')}</span>
                <br />
                <span className="gradient-text">{t('heroTitleB')}</span>
              </h1>

              <p className="text-slate-400 text-lg md:text-xl mt-8 leading-relaxed max-w-xl">
                {t('heroDescription')}
              </p>

              <div className="flex flex-wrap gap-4 mt-10">
                <Link href="/login" className="btn-primary px-8 py-3.5 text-base">
                  {t('getStarted')}
                  <svg className={`w-4 h-4 ${isRtl ? '' : 'rotate-180'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
                <Link href="#process" className="btn-secondary px-8 py-3.5 text-base">
                  {t('howItWorks')}
                </Link>
              </div>

              <div className="flex items-center gap-8 mt-12 pt-8 border-t border-white/5">
                {[
                  { n: '4', l: t('actorsCount') },
                  { n: '7', l: t('stepsCount') },
                  { n: '10x', l: t('faster') },
                ].map((s) => (
                  <div key={s.l}>
                    <p className="text-2xl font-bold gradient-text">{s.n}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{s.l}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Hero visual */}
            <div className="relative hidden lg:block animate-fade-in animate-delay-300">
              <div className="relative glass-strong p-8 animate-float">
                <div className="absolute -inset-px rounded-2xl bg-gradient-to-br from-accent/30 via-transparent to-gold/20 -z-10" />
                <div className="space-y-4">
                  {[
                    { label: t('heroCase'), status: t('heroBankReview'), color: 'text-gold' },
                    { label: t('heroLoanLimit'), status: t('heroLoanAmount'), color: 'text-accent-light' },
                    { label: t('heroValuation'), status: t('heroPending'), color: 'text-purple-400' },
                  ].map((row, i) => (
                    <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
                      <span className="text-sm text-slate-400">{row.label}</span>
                      <span className={`text-sm font-semibold ${row.color}`}>{row.status}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-6 h-2 rounded-full bg-white/5 overflow-hidden">
                  <div className="h-full w-3/5 rounded-full bg-gradient-to-l from-accent to-gold animate-shimmer" style={{ backgroundSize: '200% 100%' }} />
                </div>
                <p className="text-xs text-slate-500 mt-2 text-center">{t('heroProgress')}</p>
              </div>

              <div className="absolute -bottom-6 -right-6 glass p-4 animate-float-delayed">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent to-accent-dark flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{t('heroApproved')}</p>
                    <p className="text-xs text-slate-500">{t('heroApprovedBy')}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Actors */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-accent-light text-sm font-semibold tracking-wider uppercase mb-3">{t('ecosystem')}</p>
            <h2 className="section-title text-white">{t('actorsTitle')}</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {ACTORS.map((a, i) => (
              <div
                key={a.roleKey}
                className="card-hover p-6 group opacity-0 animate-slide-up"
                style={{ animationDelay: `${i * 100}ms`, animationFillMode: 'forwards' }}
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${a.gradient} flex items-center justify-center text-2xl shadow-lg mb-5 group-hover:scale-110 transition-transform duration-300`}>
                  {a.icon}
                </div>
                <h3 className="text-lg font-bold text-white">{t(a.roleKey)}</h3>
                <p className="text-sm text-slate-400 mt-2 leading-relaxed">{t(a.descKey)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section id="process" className="py-24 px-6 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-accent/5 to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto relative">
          <div className="text-center mb-16">
            <p className="text-gold text-sm font-semibold tracking-wider uppercase mb-3">{t('process')}</p>
            <h2 className="section-title text-white">{t('processTitle')}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {STEPS.map((step, i) => (
              <div
                key={step.num}
                className={`card-hover p-7 bg-gradient-to-br ${step.color} opacity-0 animate-slide-up`}
                style={{ animationDelay: `${i * 150}ms`, animationFillMode: 'forwards' }}
              >
                <div className="flex items-center justify-between mb-6">
                  <span className="text-accent-light/60 font-mono text-sm font-bold">{step.num}</span>
                  <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-accent-light">
                    {step.icon}
                  </div>
                </div>
                <h3 className="text-lg font-bold text-white">{t(step.titleKey)}</h3>
                <p className="text-sm text-slate-400 mt-3 leading-relaxed">{t(step.descKey)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="relative glass-strong p-12 md:p-16 text-center overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-transparent to-gold/10 pointer-events-none" />
            <div className="relative">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                {t('demoReadyTitle')}
              </h2>
              <p className="text-slate-400 max-w-lg mx-auto leading-relaxed">
                {t('demoReadyDescription')}
              </p>
              <p className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 font-mono text-sm text-slate-400">
                {t('demoPassword')}: <span className="text-accent-light">123456</span>
              </p>
              <div className="mt-8">
                <Link href="/login" className="btn-gold px-10 py-4 text-base">
                  {t('enterDemo')}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/5 py-10 flex flex-col items-center">
        <Logo size="sm" />
        <p className="text-sm text-slate-600 mt-4">{t('footerText')}</p>
      </footer>
    </div>
  );
}
