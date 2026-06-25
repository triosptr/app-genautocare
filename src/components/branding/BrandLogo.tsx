import { cn } from '@/lib/utils';
import logoUrl from '@/assets/gen-logo.png';

interface BrandLogoProps {
  variant?: 'on-dark' | 'on-light';
  compact?: boolean;
  className?: string;
}

export function BrandLogo({ variant = 'on-dark', compact = false, className }: BrandLogoProps) {
  const isDark = variant === 'on-dark';

  return (
    <div
      className={cn(
        'inline-flex items-center justify-center overflow-hidden rounded-[14px] bg-[#111318]',
        compact ? 'p-2' : 'p-2.5',
        !isDark && 'border border-slate-200 shadow-sm',
        className,
      )}
    >
      <img
        src={logoUrl}
        alt="GEN AUTO CARE"
        className={cn('block select-none object-contain', compact ? 'h-9 w-auto' : 'h-10 w-auto')}
        draggable={false}
      />
    </div>
  );
}
