import { cn } from '@/lib/utils';
import logoUrl from '@/assets/gen-logo.svg';

interface BrandLogoProps {
  variant?: 'on-dark' | 'on-light';
  compact?: boolean;
  className?: string;
}

export function BrandLogo({ variant = 'on-dark', compact = false, className }: BrandLogoProps) {
  const isDark = variant === 'on-dark';

  return (
    <img
      src={logoUrl}
      alt="GEN AUTO CARE"
      className={cn('block select-none', compact ? 'h-10 w-auto' : 'h-12 w-auto', className)}
      style={{ color: isDark ? '#C8F400' : '#1535D4' }}
      draggable={false}
    />
  );
}
