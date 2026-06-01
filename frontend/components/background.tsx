import { useLocale } from '@/lib/i18n';

export function MeshBackground({ className = '' }: { className?: string }) {
  return (
    <div className={`fixed inset-0 -z-10 overflow-hidden ${className}`}>
      <div className="absolute inset-0 bg-surface" />
      <div className="absolute inset-0 bg-mesh" />
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
          backgroundSize: '64px 64px',
        }}
      />
      <div className="orb w-[500px] h-[500px] bg-accent/20 -top-32 -right-32 animate-pulse-glow" />
      <div className="orb w-[400px] h-[400px] bg-gold/10 bottom-0 left-0 animate-pulse-glow" style={{ animationDelay: '1.5s' }} />
      <div className="orb w-[300px] h-[300px] bg-blue-500/10 top-1/2 left-1/3 animate-pulse-glow" style={{ animationDelay: '3s' }} />
    </div>
  );
}

export function AuthBackground() {
  const { t } = useLocale();

  return (
    <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-surface-50">
      <div className="absolute inset-0 bg-mesh" />
      <div className="orb w-[600px] h-[600px] bg-accent/25 -top-48 -left-48" />
      <div className="orb w-[400px] h-[400px] bg-gold/15 bottom-20 right-10" />
      <div className="relative z-10 flex flex-col justify-center p-16">
        <div className="animate-slide-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 text-accent-light text-sm font-medium mb-8">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            {t('authBadge')}
          </div>
          <h2 className="text-4xl font-bold leading-tight mb-6">
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
