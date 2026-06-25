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
    <section className={cn('brand-panel rounded-[18px] p-4 md:p-5', className)}>
      {(title || actions) && (
        <header className="mb-4 flex items-start justify-between gap-4 border-b border-white/10 pb-4">
          <div>
            {title && <h2 className="font-display text-[20px] font-extrabold tracking-[-0.01em] text-white">{title}</h2>}
            {subtitle && <p className="mt-1 text-[13px] text-white/60">{subtitle}</p>}
          </div>
          {actions}
        </header>
      )}
      {children}
    </section>
  );
}
