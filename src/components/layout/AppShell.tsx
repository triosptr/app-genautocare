import { BarChart3, LayoutGrid, LogOut, ReceiptText, Search, Users } from 'lucide-react';
import type { ReactNode } from 'react';
import { useMemo, useState } from 'react';
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
  const [query, setQuery] = useState('');
  const links = useMemo(() => navItems.filter((item) => item.roles.includes(role)), [role]);
  const pageName = links.find((link) => link.to === location.pathname)?.label ?? 'Ringkasan';

  function NavContent() {
    return (
      <div className="flex h-full flex-col p-6">
        <div>
          <BrandLogo compact variant="on-dark" />
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
                    'flex items-center gap-3 rounded-[14px] px-4 py-3 text-sm font-semibold transition-colors duration-200',
                    isActive ? 'bg-[#0c2aa6] text-white' : 'text-white/90 hover:bg-white/10',
                  )
                }
              >
                <Icon className="h-4 w-4 opacity-90" />
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
    <div className="min-h-screen bg-[#eef0f5] text-slate-900">
      <div className="min-h-screen lg:grid lg:grid-cols-[260px_minmax(0,1fr)]">
        <aside className="bg-[#1535D4] text-white">
          <NavContent />
        </aside>

        <div className="min-h-screen">
          <header className="sticky top-0 z-40 border-b border-slate-200 bg-[#eef0f5]/80 backdrop-blur">
            <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 lg:px-8">
              <div>
                <p className="text-sm font-semibold text-slate-900">{pageName}</p>
                <p className="mt-1 text-xs text-slate-500">Ringkasan operasional</p>
              </div>

              <div className="flex items-center gap-3">
                <div className="hidden items-center gap-2 rounded-[14px] border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 sm:flex">
                  <Search className="h-4 w-4 text-slate-400" />
                  <input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Cari transaksi..."
                    className="w-48 bg-transparent outline-none placeholder:text-slate-400"
                  />
                </div>
                <NavLink to="/cashier" className="brand-primary-btn rounded-[14px] px-4 py-3 text-sm font-semibold">
                  + Transaksi Baru
                </NavLink>
              </div>
            </div>
          </header>

          <main className="mx-auto max-w-7xl px-4 py-6 lg:px-8 lg:py-8">
            <div key={location.pathname} className="page-enter">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
