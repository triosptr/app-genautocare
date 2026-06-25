interface StatCardProps {
  label: string;
  value: string;
  hint: string;
  accent?: 'blue' | 'neutral' | 'dark';
}

export function StatCard({ label, value, hint, accent = 'neutral' }: StatCardProps) {
  const cardClass =
    accent === 'blue'
      ? 'border-[#1535D4]/18 bg-white text-slate-900'
      : accent === 'dark'
        ? 'border-[#d8dce7] bg-[#f7f8fb] text-slate-900'
        : 'border-[#d8dce7] bg-white text-slate-900';
  const labelClass = 'text-[#79809a]';
  const valueClass = accent === 'blue' ? 'text-[#1535D4]' : 'text-[#111318]';
  const hintClass = 'text-slate-500';

  return (
    <article className={`rounded-[16px] border p-5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.04),_0_1px_3px_rgba(0,0,0,0.02)] transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_8px_24px_-4px_rgba(0,0,0,0.06)] ${cardClass}`}>
      <p className={`text-[11px] uppercase tracking-[0.18em] ${labelClass}`}>{label}</p>
      <p className={`mt-4 font-display text-[32px] leading-none tabular-nums ${valueClass}`}>{value}</p>
      <p className={`mt-4 text-[13px] ${hintClass}`}>{hint}</p>
    </article>
  );
}
