import { Transaction, AppSettings } from '../types';

const TRANSACTIONS_KEY = 'shaxsiy_moliyam_transactions';
const SETTINGS_KEY = 'shaxsiy_moliyam_settings';

export const defaultSettings: AppSettings = {
  dailyLimit: 200000,
  monthlyLimit: 5000000,
  savingsGoal: 10000000,
  initialBalance: 0,
  darkMode: true,
  startDate: new Date().getFullYear() + '-01-01',
};

export function loadTransactions(): Transaction[] {
  try {
    const data = localStorage.getItem(TRANSACTIONS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveTransactions(transactions: Transaction[]): void {
  localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(transactions));
}

export function loadSettings(): AppSettings {
  try {
    const data = localStorage.getItem(SETTINGS_KEY);
    return data ? { ...defaultSettings, ...JSON.parse(data) } : defaultSettings;
  } catch {
    return defaultSettings;
  }
}

export function saveSettings(settings: AppSettings): void {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

export function exportToJSON(transactions: Transaction[], settings: AppSettings): string {
  return JSON.stringify({ transactions, settings, exportDate: new Date().toISOString() }, null, 2);
}

export function exportToCSV(transactions: Transaction[]): string {
  const headers = ['Sana', 'Turi', 'Summa', 'Kategoriya', 'Tavsif', 'Izoh'];
  const rows = transactions.map(t => [
    t.date,
    t.type === 'income' ? 'Daromad' : 'Xarajat',
    t.amount.toString(),
    t.category,
    t.description,
    t.note,
  ]);
  return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
}

export function downloadFile(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function importFromJSON(jsonString: string): { transactions: Transaction[]; settings: AppSettings } | null {
  try {
    const data = JSON.parse(jsonString);
    if (data.transactions && data.settings) {
      return { transactions: data.transactions, settings: data.settings };
    }
    return null;
  } catch {
    return null;
  }
}
