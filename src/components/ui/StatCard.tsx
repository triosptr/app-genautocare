import type { DashboardMetric } from '@/types/app';

interface StatCardProps extends DashboardMetric {
  accent?: 'blue' | 'neutral' | 'dark';
}

export function StatCard({ label, value, hint, accent = 'neutral' }: StatCardProps) {
  const cardClass =
    accent === 'blue'
      ? 'border-[#1535D4] bg-[#1535D4] text-white'
      : accent === 'dark'
        ? 'border-[#373A4A] bg-[#373A4A] text-white'
        : 'border-[#d8dce7] bg-[#f7f8fb] text-slate-900';
  const labelClass = accent === 'neutral' ? 'text-[#9aa0b4]' : 'text-white/74';
  const valueClass = accent === 'neutral' ? 'text-[#111318]' : 'text-white';
  const hintClass = accent === 'neutral' ? 'text-slate-500' : 'text-white/72';

  return (
    <article className={`rounded-[16px] border p-5 shadow-[0_12px_30px_rgba(0,0,0,0.04)] ${cardClass}`}>
      <p className={`text-[11px] uppercase tracking-[0.18em] ${labelClass}`}>{label}</p>
      <p className={`mt-4 font-display text-[32px] leading-none ${valueClass}`}>{value}</p>
      <p className={`mt-4 text-[13px] ${hintClass}`}>{hint}</p>
    </article>
  );
}
