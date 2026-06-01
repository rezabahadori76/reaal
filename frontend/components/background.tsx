import { useLocale } from '@/lib/i18n';

export function MeshBackground({ className = '' }: { className?: string }) {
  return (
    <div className={`fixed inset-0 -z-10 overflow-hidden ${className}`}>
      <div className="absolute inset-0 bg-surface" />
      <div className="absolute inset-0 bg-mesh" />
      <div
        className="absolute inset-0 opacity-25"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)',
          backgroundSize: '72px 72px',
        }}
      />
    </div>
  );
}

export function AuthBackground() {
  const { t } = useLocale();

  return (
    <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-surface-50">
      <div className="absolute inset-0 bg-mesh" />
      <div className="relative z-10 flex flex-col justify-center p-16">
        <div>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.05] border border-white/10 text-slate-300 text-sm font-medium mb-8">
            <span className="w-2 h-2 rounded-full bg-accent" />
            {t('authBadge')}
          </div>
          <h2 className="text-4xl font-black leading-tight mb-6 tracking-tight">
            {t('authTitle')}
            <br />
            <span className="gradient-text">{t('authTitleHighlight')}</span>
          </h2>
          <p className="text-slate-400 text-lg leading-relaxed max-w-md">
            {t('authDescription')}
          </p>
          <div className="mt-12 grid grid-cols-3 gap-6">
            {[
              { val: '4', label: t('mainParties') },
              { val: '10x', label: t('speed') },
              { val: '100%', label: t('transparency') },
            ].map((s) => (
              <div key={s.label} className="glass p-4 text-center">
                <p className="text-2xl font-bold gradient-text">{s.val}</p>
                <p className="text-xs text-slate-500 mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
