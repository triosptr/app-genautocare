import { useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { BrandLogo } from '@/components/branding/BrandLogo';
import { AppShell } from '@/components/layout/AppShell';
import { supabase } from '@/lib/supabase';
import CatalogPage from '@/pages/CatalogPage';
import CustomersPage from '@/pages/CustomersPage';
import DashboardPage from '@/pages/DashboardPage';
import LoginPage from '@/pages/LoginPage';
import PosPage from '@/pages/PosPage';
import ReportsPage from '@/pages/ReportsPage';
import SettingsPage from '@/pages/SettingsPage';
import TransactionsPage from '@/pages/TransactionsPage';
import { useCashierStore } from '@/store/useCashierStore';

function LoadingScreen() {
  return (
    <div className="grid min-h-screen place-items-center bg-[linear-gradient(180deg,_#1535D4_0%,_#2035A6_40%,_#373A4A_100%)] text-slate-100">
      <div className="text-center">
        <BrandLogo variant="on-dark" />
        <p className="mt-4 font-display text-4xl uppercase tracking-[0.2em]">Preparing workspace</p>
      </div>
    </div>
  );
}

export default function App() {
  const { initialize, setSession, signOut, mode, session, ready, dataError, loading } = useCashierStore();

  useEffect(() => {
    void initialize();
  }, [initialize]);

  useEffect(() => {
    if (!supabase) {
      return undefined;
    }

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      void setSession(nextSession);
    });

    return () => subscription.unsubscribe();
  }, [setSession]);

  if (!ready) {
    return <LoadingScreen />;
  }

  if (mode === 'live' && !session) {
    return <LoginPage />;
  }

  return (
    <BrowserRouter>
      <AppShell mode={mode} userEmail={session?.user.email} onSignOut={() => void signOut()}>
        <div className="space-y-4">
          {dataError && <div className="rounded-2xl border border-red-400/25 bg-red-500/10 px-4 py-3 text-sm text-red-200">{dataError}</div>}
          {loading && <div className="rounded-2xl border border-[#C8F400]/20 bg-[#C8F400]/10 px-4 py-3 text-sm text-[#F9F9FF]">Syncing the latest Supabase data...</div>}
        </div>
        <div className="mt-6">
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/pos" element={<PosPage />} />
            <Route path="/catalog" element={<CatalogPage />} />
            <Route path="/customers" element={<CustomersPage />} />
            <Route path="/transactions" element={<TransactionsPage />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        </div>
      </AppShell>
    </BrowserRouter>
  );
}
