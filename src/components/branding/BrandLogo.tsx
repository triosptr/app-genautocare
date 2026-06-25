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
      className={cn('block select-none object-contain', compact ? 'h-14 w-auto' : 'h-16 w-auto', className)}
      draggable={false}
    />
  );
}
