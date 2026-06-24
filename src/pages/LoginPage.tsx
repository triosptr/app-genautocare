import { ArrowRight, ShoppingBag } from 'lucide-react';
import { BrandLogo } from '@/components/branding/BrandLogo';
import { useCashierStore } from '@/store/useCashierStore';

export default function LoginPage() {
  const { setRole } = useCashierStore();

  return (
    <div className="grid min-h-screen place-items-center bg-[linear-gradient(180deg,_#05070d_0%,_#0b1020_100%)] px-4 py-10 text-slate-900">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-[32px] border border-white/8 bg-[linear-gradient(135deg,_rgba(12,16,28,0.96)_0%,_rgba(15,20,34,0.98)_100%)] p-3 shadow-[0_32px_90px_-56px_rgba(0,0,0,0.7)] lg:grid-cols-[1fr_0.95fr]">
        <section className="rounded-[24px] border-b border-white/8 bg-[#1535D4] p-8 text-white lg:border-b-0 lg:border-r-0 lg:p-12">
          <BrandLogo variant="on-dark" className="mb-6" />
          <p className="text-[11px] uppercase tracking-[0.22em] text-[#C8F400]">Kasir Only</p>
          <h1 className="mt-4 font-display text-4xl uppercase tracking-[0.04em] text-white">
            Sistem kasir cuci motor yang lebih ringan
          </h1>
          <p className="mt-5 max-w-xl text-[15px] text-white/80">
            Aplikasi sekarang diringkas untuk kebutuhan kasir: input transaksi, mode POS cepat, antrian, pelanggan,
            dan laporan harian.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <div className="rounded-[18px] border border-white/10 bg-white/10 p-5">
              <p className="text-sm font-semibold text-white">Lebih ringkas</p>
              <p className="mt-2 text-sm text-white/74">Menu difokuskan ke alur transaksi yang dipakai kasir setiap hari.</p>
            </div>
            <div className="rounded-[18px] border border-white/10 bg-white/10 p-5">
              <p className="text-sm font-semibold text-white">Blueprint baru</p>
              <p className="mt-2 text-sm text-white/74">Shell gelap, aksen lime, dan canvas kerja terang mengikuti arah desain terbaru.</p>
            </div>
          </div>
        </section>

        <section className="brand-canvas rounded-[24px] p-8 lg:p-12">
          <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500">Masuk aplikasi</p>
          <div className="mt-6">
            <button
              type="button"
              onClick={() => setRole('kasir')}
              className="brand-soft-card flex w-full items-start justify-between gap-4 rounded-[20px] border border-slate-300 p-5 text-left transition hover:border-[#1535D4]/28 hover:bg-white"
            >
              <div className="flex gap-4">
                <div className="grid h-12 w-12 place-items-center rounded-[14px] bg-[#1535D4] text-white">
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
