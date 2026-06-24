import { ArrowRight, ShoppingBag } from 'lucide-react';
import { BrandLogo } from '@/components/branding/BrandLogo';
import { useCashierStore } from '@/store/useCashierStore';

export default function LoginPage() {
  const { setRole } = useCashierStore();

  return (
    <div className="grid min-h-screen place-items-center bg-[linear-gradient(180deg,_#f9fbff_0%,_#f3f6fb_100%)] px-4 py-10 text-slate-900">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-[0_32px_90px_-56px_rgba(21,53,212,0.3)] lg:grid-cols-[1fr_0.95fr]">
        <section className="border-b border-slate-200 bg-[#f8fbff] p-8 lg:border-b-0 lg:border-r lg:p-12">
          <BrandLogo variant="on-light" className="mb-6" />
          <p className="text-[11px] uppercase tracking-[0.22em] text-[#1535D4]">Kasir Only</p>
          <h1 className="mt-4 font-display text-4xl uppercase tracking-[0.08em] text-slate-900">
            Sistem kasir cuci motor yang lebih ringan
          </h1>
          <p className="mt-5 max-w-xl text-[15px] text-slate-600">
            Aplikasi sekarang diringkas untuk kebutuhan kasir: input transaksi, mode POS cepat, antrian, pelanggan,
            dan laporan harian.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <div className="rounded-3xl border border-slate-200 bg-white p-5">
              <p className="text-sm font-semibold text-slate-900">Lebih ringkas</p>
              <p className="mt-2 text-sm text-slate-600">Menu difokuskan ke alur transaksi yang dipakai kasir setiap hari.</p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-white p-5">
              <p className="text-sm font-semibold text-slate-900">Lebih terang</p>
              <p className="mt-2 text-sm text-slate-600">Nuansa visual dibuat light agar lebih nyaman untuk penggunaan lama di meja kasir.</p>
            </div>
          </div>
        </section>

        <section className="p-8 lg:p-12">
          <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500">Masuk aplikasi</p>
          <div className="mt-6">
            <button
              type="button"
              onClick={() => setRole('kasir')}
              className="brand-soft-card flex w-full items-start justify-between gap-4 rounded-[28px] p-5 text-left transition hover:border-[#1535D4]/20 hover:bg-[#f8fbff]"
            >
              <div className="flex gap-4">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#1535D4] text-white">
                  <ShoppingBag className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-display text-2xl uppercase tracking-[0.06em] text-slate-900">Kasir</p>
                  <p className="mt-1 text-sm text-[#1535D4]">Dashboard, transaksi, POS, antrian, pelanggan, laporan</p>
                  <p className="mt-3 text-sm text-slate-600">Masuk langsung ke versi operasional kasir yang sudah disederhanakan.</p>
                </div>
              </div>
              <ArrowRight className="mt-1 h-5 w-5 text-[#1535D4]" />
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
