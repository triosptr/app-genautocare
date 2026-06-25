import { cn } from '@/lib/utils';
import logoUrl from '@/assets/gen-logo.png';

interface BrandLogoProps {
  variant?: 'on-dark' | 'on-light';
  compact?: boolean;
  className?: string;
}

export function BrandLogo({ variant = 'on-dark', compact = false, className }: BrandLogoProps) {
  void variant;

  return (
    <img
      src={logoUrl}
      alt="GEN AUTO CARE"
      className={cn(
        'block h-auto w-auto max-h-16 select-none object-contain',
        compact && 'max-h-14',
        className,
      )}
      draggable={false}
    />
  );
}
