export interface Transaction {
  id: string;
  date: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  description: string;
  note: string;
  createdAt: string;
}

export interface AppSettings {
  dailyLimit: number;
  monthlyLimit: number;
  savingsGoal: number;
  initialBalance: number;
  darkMode: boolean;
  startDate: string;
}

export interface MonthlyReport {
  month: string;
  income: number;
  expense: number;
  savings: number;
}

export type PageType = 'dashboard' | 'expenses' | 'reports' | 'goals' | 'settings';

export const EXPENSE_CATEGORIES = [
  { value: 'ovqat', label: '🍽️ Ovqat', color: '#ef4444' },
  { value: 'transport', label: '🚌 Transport', color: '#f97316' },
  { value: 'kiyim', label: '👕 Kiyim', color: '#eab308' },
  { value: 'talim', label: '📚 Ta\'lim', color: '#22c55e' },
  { value: 'internet', label: '📱 Internet/aloqa', color: '#3b82f6' },
  { value: 'oyin-kulgi', label: '🎮 O\'yin-kulgi', color: '#8b5cf6' },
  { value: 'sogliq', label: '🏥 Sog\'liq', color: '#ec4899' },
  { value: 'boshqa', label: '📦 Boshqa', color: '#6b7280' },
];

export const INCOME_CATEGORIES = [
  { value: 'maosh', label: '💰 Maosh', color: '#22c55e' },
  { value: 'frilans', label: '💻 Frilans', color: '#3b82f6' },
  { value: 'biznes', label: '🏢 Biznes', color: '#8b5cf6' },
  { value: 'sovg\'a', label: '🎁 Sovg\'a', color: '#ec4899' },
  { value: 'boshqa-daromad', label: '📦 Boshqa', color: '#6b7280' },
];
