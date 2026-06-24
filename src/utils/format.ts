export function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatDateTime(value: string) {
  return new Intl.DateTimeFormat('en-GB', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}

export function toInputDate(value: string) {
  return new Date(value).toISOString().split('T')[0];
}
