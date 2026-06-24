import { useEffect } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { BrandLogo } from '@/components/branding/BrandLogo';
import { AppShell } from '@/components/layout/AppShell';
import { canAccess } from '@/lib/access';
import AttendancePage from '@/pages/AttendancePage';
import CashierDetailPage from '@/pages/CashierDetailPage';
import CustomersPage from '@/pages/CustomersPage';
import DashboardPage from '@/pages/DashboardPage';
import DailyReportPage from '@/pages/DailyReportPage';
import InventoryPage from '@/pages/InventoryPage';
import LoginPage from '@/pages/LoginPage';
import OpsCostsPage from '@/pages/OpsCostsPage';
import PosPage from '@/pages/PosPage';
import QualityPage from '@/pages/QualityPage';
import QueuePage from '@/pages/QueuePage';
import RecapPage from '@/pages/RecapPage';
import SettingsPage from '@/pages/SettingsPage';
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
  const { initialize, clearRole, mode, currentRole, ready } = useCashierStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  if (!ready) {
    return <LoadingScreen />;
  }

  if (!currentRole) {
    return <LoginPage />;
  }

  return (
    <BrowserRouter>
      <AppShell mode={mode} role={currentRole} onSignOut={clearRole}>
        <div className="mt-6">
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/cashier" element={<CashierDetailPage />} />
            <Route path="/pos" element={canAccess(currentRole, '/pos') || currentRole === 'owner' || currentRole === 'manager_ops' ? <PosPage /> : <Navigate to="/" replace />} />
            <Route path="/queue" element={<QueuePage />} />
            <Route path="/inventory" element={<InventoryPage />} />
            <Route path="/quality" element={canAccess(currentRole, '/quality') ? <QualityPage /> : <Navigate to="/" replace />} />
            <Route path="/attendance" element={<AttendancePage />} />
            <Route path="/customers" element={<CustomersPage />} />
            <Route path="/reports/daily" element={<DailyReportPage />} />
            <Route path="/costs" element={canAccess(currentRole, '/costs') ? <OpsCostsPage /> : <Navigate to="/" replace />} />
            <Route path="/recap" element={canAccess(currentRole, '/recap') ? <RecapPage /> : <Navigate to="/" replace />} />
            <Route path="/settings" element={canAccess(currentRole, '/settings') ? <SettingsPage /> : <Navigate to="/" replace />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </AppShell>
    </BrowserRouter>
  );
}
