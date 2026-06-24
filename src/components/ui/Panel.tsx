import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface PanelProps {
  title?: string;
  subtitle?: string;
  actions?: ReactNode;
  className?: string;
  children: ReactNode;
}

export function Panel({ title, subtitle, actions, className, children }: PanelProps) {
  return (
    <section
      className={cn(
        'rounded-3xl border border-white/10 bg-slate-950/70 p-5 shadow-[0_24px_80px_-32px_rgba(45,226,230,0.45)] backdrop-blur-xl',
        className,
      )}
    >
      {(title || actions) && (
        <header className="mb-4 flex items-start justify-between gap-4">
          <div>
            {title && <h2 className="font-display text-lg uppercase tracking-[0.18em] text-white">{title}</h2>}
            {subtitle && <p className="mt-1 text-sm text-slate-400">{subtitle}</p>}
          </div>
          {actions}
        </header>
      )}
      {children}
    </section>
  );
}
