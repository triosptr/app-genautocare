export function normalizeWhatsAppNumber(input: string) {
  const digits = input.replace(/\D/g, '');
  if (digits.startsWith('0')) {
    return `62${digits.slice(1)}`;
  }
  return digits;
}

export function createWhatsAppLink(phone: string, message: string) {
  const target = normalizeWhatsAppNumber(phone);
  const encoded = encodeURIComponent(message);
  if (!target) {
    return `https://wa.me/?text=${encoded}`;
  }
  return `https://wa.me/${target}?text=${encoded}`;
}
