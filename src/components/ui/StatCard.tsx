interface StatCardProps {
  label: string;
  value: string;
  hint: string;
  accent?: 'blue' | 'neutral' | 'dark';
}

export function StatCard({ label, value, hint, accent = 'neutral' }: StatCardProps) {
  const cardClass =
    accent === 'blue'
      ? 'border-[#1535D4] bg-[#1535D4] text-white'
      : accent === 'dark'
        ? 'border-white/10 bg-white/6 text-white'
        : 'border-white/10 bg-[#0d1220] text-white';
  const labelClass = accent === 'blue' ? 'text-white/70' : 'text-white/55';
  const valueClass = accent === 'blue' ? 'text-[#C8F400]' : 'text-white';
  const hintClass = 'text-white/60';

  return (
    <article className={`rounded-[16px] border p-5 shadow-[0_18px_60px_-44px_rgba(0,0,0,0.92)] transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_24px_70px_-46px_rgba(0,0,0,0.92)] ${cardClass}`}>
      <p className={`text-[11px] uppercase tracking-[0.18em] ${labelClass}`}>{label}</p>
      <p className={`mt-4 font-display text-[32px] leading-none tabular-nums ${valueClass}`}>{value}</p>
      <p className={`mt-4 text-[13px] ${hintClass}`}>{hint}</p>
    </article>
  );
}
