import { BarChart3, Clock3, LayoutGrid, LogOut, Menu, ReceiptText, Users, X } from 'lucide-react';
import type { ReactNode } from 'react';
import { useEffect, useMemo, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { BrandLogo } from '@/components/branding/BrandLogo';
import { getRoleLabel, navItems } from '@/lib/access';
import { cn } from '@/lib/utils';
import type { AppMode, AppRole } from '@/types/app';

const iconMap = {
  '/': LayoutGrid,
  '/cashier': ReceiptText,
  '/customers': Users,
  '/reports': BarChart3,
};

interface AppShellProps {
  mode: AppMode;
  role: AppRole;
  onSignOut?: () => void;
  children: ReactNode;
}

export function AppShell({ mode, role, onSignOut, children }: AppShellProps) {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const links = useMemo(() => navItems.filter((item) => item.roles.includes(role)), [role]);
  const pageName = links.find((link) => link.to === location.pathname)?.label ?? 'Ringkasan';
  const nowLabel = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  function NavContent({ variant }: { variant: 'desktop' | 'mobile' }) {
    return (
      <div className={cn('flex h-full flex-col', variant === 'desktop' ? 'p-6' : 'p-5')}>
        <div className={cn(variant === 'desktop' ? '' : 'flex items-center justify-between')}>
          <BrandLogo compact variant="on-dark" />
          {variant === 'mobile' && (
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className="grid h-10 w-10 place-items-center rounded-[14px] bg-white/10 text-white transition hover:bg-white/14"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        <div className="mt-6 rounded-[18px] border border-white/10 bg-white/8 p-4">
          <p className="brand-eyebrow text-[#C8F400]">{mode === 'hybrid' ? 'Hybrid mode' : 'Kasir'}</p>
          <p className="mt-2 text-sm text-white/80">Transaksi cepat, data pelanggan, invoice, dan laporan pendapatan.</p>
        </div>

        <nav className="mt-6 space-y-2">
          {links.map((link) => {
            const Icon = iconMap[link.to as keyof typeof iconMap] ?? LayoutGrid;
            return (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 rounded-[14px] px-4 py-3 text-sm font-medium transition-colors duration-200',
                    isActive ? 'bg-[#1535D4] text-[#C8F400]' : 'text-white/88 hover:bg-white/8',
                  )
                }
              >
                <Icon className="h-4 w-4 opacity-80" />
                <span>{link.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="mt-auto pt-6">
          <div className="flex items-center gap-3 rounded-[16px] border border-white/10 bg-white/8 p-3 text-sm text-white/82">
            <div className="h-10 w-10 rounded-[12px] bg-white/10" />
            <div>
              <p className="font-semibold text-white">{getRoleLabel(role)}</p>
              <p className="text-xs text-white/58">Akun aktif</p>
            </div>
          </div>

          {onSignOut && (
            <button
              type="button"
              onClick={onSignOut}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-[14px] border border-white/10 bg-white/8 px-4 py-3 text-sm font-medium text-white transition hover:bg-white/12"
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#060912] text-white">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#0d1220]/80 backdrop-blur lg:hidden">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="grid h-10 w-10 place-items-center rounded-[14px] border border-white/10 bg-white/5 text-white transition hover:bg-white/10"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/55">GEN Auto Care</p>
            <p className="font-display text-[18px] font-extrabold text-white">{pageName}</p>
          </div>
          <div className="inline-flex items-center gap-2 rounded-[14px] border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/80">
            <Clock3 className="h-4 w-4 text-[#C8F400]" />
            <span className="tabular-nums">{nowLabel}</span>
          </div>
        </div>
      </header>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="absolute inset-0 bg-black/50"
          />
          <div className="absolute left-0 top-0 h-full w-[320px] bg-[#1535D4] text-white shadow-2xl">
            <NavContent variant="mobile" />
          </div>
        </div>
      )}

      <div className="mx-auto min-h-screen max-w-7xl lg:grid lg:grid-cols-[280px_minmax(0,1fr)]">
        <aside className="hidden bg-[#1535D4] text-white lg:block">
          <NavContent variant="desktop" />
        </aside>

        <main className="min-h-screen px-4 py-6 lg:px-8 lg:py-8">
          <div className="mx-auto w-full space-y-6">
            <div className="hidden items-center justify-between gap-4 rounded-[22px] border border-white/10 bg-[#0d1220] p-5 shadow-[0_18px_60px_-36px_rgba(0,0,0,0.85)] lg:flex">
              <div>
                <p className="brand-eyebrow text-white/55">GEN Auto Care</p>
                <h1 className="mt-2 brand-title text-[26px] text-white">{pageName}</h1>
              </div>
              <div className="inline-flex items-center gap-2 rounded-[14px] border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/80">
                <Clock3 className="h-4 w-4 text-[#C8F400]" />
                <span className="tabular-nums">{nowLabel}</span>
              </div>
            </div>

            <div key={location.pathname} className="page-enter">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
