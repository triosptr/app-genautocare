import { cn } from '@/lib/utils';

interface BrandLogoProps {
  variant?: 'on-dark' | 'on-light';
  compact?: boolean;
  className?: string;
}

export function BrandLogo({ variant = 'on-dark', compact = false, className }: BrandLogoProps) {
  const isDark = variant === 'on-dark';

  return (
    <div className={cn('inline-flex flex-col', className)}>
      <div className="flex items-end gap-2">
        <span
          className={cn(
            'font-display text-5xl font-bold uppercase italic leading-none tracking-[-0.08em]',
            compact && 'text-4xl',
            isDark ? 'text-[#C8F400]' : 'text-[#1535D4]',
          )}
        >
          GEN
        </span>
        <span
          className={cn(
            'pb-1 text-xl font-semibold uppercase tracking-[-0.03em]',
            compact && 'text-base',
            isDark ? 'text-[#C8F400]' : 'text-[#1535D4]',
          )}
        >
          Auto Care
        </span>
      </div>
      <span
        className={cn(
          'pl-1 text-[10px] font-semibold uppercase tracking-[0.18em]',
          compact && 'text-[9px]',
          isDark ? 'text-[#F9F9FF]' : 'text-[#373A4A]',
        )}
      >
        Groom Every Need
      </span>
    </div>
  );
}
