export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('uz-UZ', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount) + ' so\'m';
}

export function formatShortCurrency(amount: number): string {
  if (amount >= 1000000000) {
    return (amount / 1000000000).toFixed(1) + ' mlrd';
  }
  if (amount >= 1000000) {
    return (amount / 1000000).toFixed(1) + ' mln';
  }
  if (amount >= 1000) {
    return (amount / 1000).toFixed(0) + ' ming';
  }
  return amount.toString();
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  const months = [
    'Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'Iyun',
    'Iyul', 'Avgust', 'Sentabr', 'Oktabr', 'Noyabr', 'Dekabr'
  ];
  return `${date.getDate()} ${months[date.getMonth()]}, ${date.getFullYear()}`;
}

export function formatShortDate(dateStr: string): string {
  const date = new Date(dateStr);
  const months = [
    'Yan', 'Fev', 'Mar', 'Apr', 'May', 'Iyn',
    'Iyl', 'Avg', 'Sen', 'Okt', 'Noy', 'Dek'
  ];
  return `${date.getDate()} ${months[date.getMonth()]}`;
}

export function getDaysPassed(startDate: string): number {
  const start = new Date(startDate);
  const now = new Date();
  const diff = now.getTime() - start.getTime();
  return Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
}

export function getDaysRemaining(startDate: string): number {
  const start = new Date(startDate);
  const end = new Date(start.getFullYear() + 1, start.getMonth(), start.getDate());
  const now = new Date();
  const diff = end.getTime() - now.getTime();
  return Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
}

export function getCurrentMonth(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}

export function getMonthName(monthStr: string): string {
  const [year, month] = monthStr.split('-');
  const months = [
    'Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'Iyun',
    'Iyul', 'Avgust', 'Sentabr', 'Oktabr', 'Noyabr', 'Dekabr'
  ];
  return `${months[parseInt(month) - 1]} ${year}`;
}

export function getTodayStr(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}
