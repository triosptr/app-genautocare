import {
  Bell,
  LayoutGrid,
  LogOut,
  ReceiptText,
  ShoppingCart,
  Users,
} from 'lucide-react';
import type { ReactNode } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { BrandLogo } from '@/components/branding/BrandLogo';
import { getRoleLabel, navItems } from '@/lib/access';
import { cn } from '@/lib/utils';
import type { AppMode, AppRole } from '@/types/app';

const iconMap = {
  '/': LayoutGrid,
  '/cashier': ReceiptText,
  '/pos': ShoppingCart,
  '/queue': LayoutGrid,
  '/customers': Users,
  '/reports/daily': ReceiptText,
};

interface AppShellProps {
  mode: AppMode;
  role: AppRole;
  onSignOut?: () => void;
  children: ReactNode;
}

export function AppShell({ mode, role, onSignOut, children }: AppShellProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const links = navItems.filter((item) => item.roles.includes(role));
  const pageName = links.find((link) => link.to === location.pathname)?.label ?? 'Dashboard';

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(21,53,212,0.05),_transparent_22%),linear-gradient(180deg,_#f9fbff_0%,_#f3f6fb_100%)] text-slate-900">
      <div className="mx-auto grid min-h-screen max-w-[1480px] gap-5 px-4 py-4 lg:grid-cols-[250px_minmax(0,1fr)] lg:px-6">
        <aside className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_18px_42px_-30px_rgba(21,53,212,0.2)]">
          <div className="flex items-center gap-3 rounded-3xl border border-slate-200 bg-[#f8fbff] px-4 py-4">
            <BrandLogo compact variant="on-light" />
          </div>

          <div className="mt-6 rounded-3xl border border-[#1535D4]/10 bg-[#eef4ff] p-4">
            <p className="text-[11px] uppercase tracking-[0.2em] text-[#1535D4]">{mode === 'hybrid' ? 'Hybrid mode' : 'Demo kasir'}</p>
            <p className="mt-2 text-sm text-slate-600">
              {mode === 'hybrid'
                ? 'Versi ringan untuk operasional kasir tetap aktif di project yang sama.'
                : 'Tampilan difokuskan untuk kasir dengan modul yang lebih ringkas.'}
            </p>
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
                      'flex items-center gap-3 rounded-2xl px-4 py-3 text-sm transition hover:bg-[#f5f8ff]',
                      isActive
                        ? 'border border-[#1535D4]/12 bg-[#1535D4] text-white'
                        : 'border border-transparent text-slate-600',
                    )
                  }
                >
                  <Icon className="h-4 w-4" />
                  <span>{link.label}</span>
                </NavLink>
              );
            })}
          </nav>

          <div className="mt-6 rounded-3xl border border-slate-200 bg-[#f8fafc] p-4 text-sm text-slate-600">
            <p className="font-medium text-slate-900">{getRoleLabel(role)}</p>
            <p className="mt-1 text-slate-500">Modul difokuskan untuk transaksi kasir harian.</p>
          </div>

          {onSignOut && (
            <button
              type="button"
              onClick={onSignOut}
              className="brand-secondary-btn mt-4 flex w-full items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm"
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </button>
          )}
        </aside>

        <div className="space-y-6">
          <header className="brand-panel rounded-[28px] p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-[11px] uppercase tracking-[0.2em] text-slate-500">Kasir App</p>
                <h1 className="mt-2 font-display text-[30px] uppercase tracking-[0.1em] text-slate-900">{pageName}</h1>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => navigate('/pos')}
                  className="brand-primary-btn rounded-2xl px-4 py-3 text-sm font-semibold"
                >
                  Buka POS
                </button>
                <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-[#f8fafc] px-4 py-3 text-sm text-slate-600">
                  <Bell className="h-4 w-4 text-[#1535D4]" />
                  <span>Tampilan ringkas untuk transaksi cepat.</span>
                </div>
              </div>
            </div>
          </header>

          <main>{children}</main>
        </div>
      </div>
    </div>
  );
}
