const PERSIAN_DIGITS = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];

export function toPersianDigits(n: number | string): string {
  if (n === null || n === undefined) return '';
  return n.toString().replace(/\d/g, (x) => PERSIAN_DIGITS[parseInt(x, 10)]);
}

export function formatPrice(amount: number): string {
  const formatted = new Intl.NumberFormat('en-US').format(amount);
  return `${toPersianDigits(formatted)} تومان`;
}

export function formatNumber(n: number): string {
  const formatted = new Intl.NumberFormat('en-US').format(n);
  return toPersianDigits(formatted);
}

export function maskPhoneNumber(phone: string): string {
  if (!phone || phone.length < 10) return phone;
  // Convert 09121234567 to 0912***4567
  const cleaned = phone.trim();
  if (cleaned.length === 11) {
    return `${cleaned.slice(0, 4)}***${cleaned.slice(7)}`;
  }
  return `${cleaned.slice(0, 3)}***${cleaned.slice(-3)}`;
}

export function formatDate(dateString: string): string {
  if (!dateString) return '-';
  try {
    const date = new Date(dateString);
    // Format using Persian locale and Tehran timezone
    return new Intl.DateTimeFormat('fa-IR', {
      timeZone: 'Asia/Tehran',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  } catch {
    return dateString;
  }
}

export function formatShortDate(dateString: string): string {
  if (!dateString) return '-';
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fa-IR', {
      timeZone: 'Asia/Tehran',
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
    }).format(date);
  } catch {
    return dateString;
  }
}
