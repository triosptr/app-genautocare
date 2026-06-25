import { cn } from '@/lib/utils';
import logoUrl from '@/assets/gen-logo.png';

interface BrandLogoProps {
  variant?: 'on-dark' | 'on-light';
  compact?: boolean;
  className?: string;
}

export function BrandLogo({ variant = 'on-dark', compact = false, className }: BrandLogoProps) {
  void variant;
  void compact;

  return (
    <img
      src={logoUrl}
      alt="GEN AUTO CARE"
      className={cn('block h-[18px] w-[14px] select-none object-contain', className)}
      draggable={false}
    />
  );
}
