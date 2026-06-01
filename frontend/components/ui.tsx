import clsx from 'clsx';
import { CaseStatus, STATUS_COLORS, STATUS_LABELS } from '@/lib/types';

export function StatusBadge({ status }: { status: CaseStatus }) {
  return (
    <span className={clsx('badge', STATUS_COLORS[status])}>
      {STATUS_LABELS[status]}
    </span>
  );
}

export function StatCard({
  label,
  value,
  icon,
  trend,
  accent = 'emerald',
}: {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: string;
  accent?: 'emerald' | 'gold' | 'blue' | 'purple';
}) {
  const accents = {
    emerald: 'from-accent/20 to-transparent border-accent/10 group-hover:border-accent/30',
    gold: 'from-gold/20 to-transparent border-gold/10 group-hover:border-gold/30',
    blue: 'from-blue-500/20 to-transparent border-blue-500/10 group-hover:border-blue-500/30',
    purple: 'from-purple-500/20 to-transparent border-purple-500/10 group-hover:border-purple-500/30',
  };

  return (
    <div className={clsx('stat-card group', accents[accent])}>
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-l from-accent/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-400 font-medium">{label}</p>
          <p className="text-3xl font-bold mt-2 text-white">{value}</p>
          {trend && <p className="text-xs text-accent-light mt-2">{trend}</p>}
        </div>
        {icon && (
          <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-2xl border border-white/10">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}

export function EmptyState({
  title,
  description,
  icon,
}: {
  title: string;
  description?: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="glass p-16 text-center">
      {icon && (
        <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-3xl mx-auto mb-6">
          {icon}
        </div>
      )}
      <p className="text-xl font-semibold text-slate-300">{title}</p>
      {description && <p className="text-sm text-slate-500 mt-3 max-w-sm mx-auto leading-relaxed">{description}</p>}
    </div>
  );
}

export function LoadingSpinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizes = { sm: 'w-5 h-5', md: 'w-10 h-10', lg: 'w-14 h-14' };
  return (
    <div className="flex items-center justify-center p-12">
      <div className={clsx(sizes[size], 'border-2 border-white/10 border-t-accent rounded-full animate-spin')} />
    </div>
  );
}

export function PageHeader({
  title,
  subtitle,
  action,
  badge,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  badge?: string;
}) {
  return (
    <div className="flex items-start justify-between mb-8">
      <div>
        {badge && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent-light text-xs font-medium mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-accent" />
            {badge}
          </span>
        )}
        <h1 className="text-2xl md:text-3xl font-bold text-white">{title}</h1>
        {subtitle && <p className="text-sm text-slate-400 mt-2">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function Logo({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizes = { sm: 'text-lg', md: 'text-xl', lg: 'text-2xl' };
  return (
    <div className="flex items-center gap-3">
      <div className={clsx('rounded-xl bg-gradient-to-br from-accent to-accent-dark flex items-center justify-center shadow-glow', size === 'sm' ? 'w-8 h-8' : size === 'md' ? 'w-10 h-10' : 'w-12 h-12')}>
        <svg viewBox="0 0 24 24" fill="none" className={size === 'sm' ? 'w-4 h-4' : 'w-6 h-6'} stroke="white" strokeWidth="2">
          <path d="M3 21h18M5 21V7l7-4 7 4v14M9 21v-6h6v6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <div>
        <span className={clsx('font-bold text-white', sizes[size])}>ملک‌پلاس</span>
        {size !== 'sm' && <p className="text-xs text-slate-500">تأمین مالی هوشمند</p>}
      </div>
    </div>
  );
}
