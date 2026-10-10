import { Transaction, AppSettings, EXPENSE_CATEGORIES } from '../types';
import { formatCurrency, getDaysPassed, getDaysRemaining, formatShortCurrency, getTodayStr } from '../utils/format';
import { TrendingUp, TrendingDown, PiggyBank, Calendar, Target, BarChart3, ArrowUpRight, ArrowDownRight, AlertTriangle, Briefcase, Zap } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import TashkentTime from './TashkentTime';
import WeatherWidget from './WeatherWidget';
import QuickEntry from './QuickEntry';

interface DashboardProps {
  transactions: Transaction[];
  settings: AppSettings;
  onAddTransaction: (t: Transaction) => void;
}

export default function Dashboard({ transactions, settings, onAddTransaction }: DashboardProps) {
  const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  const currentSavings = settings.initialBalance + totalIncome - totalExpense;
  const daysPassed = getDaysPassed(settings.startDate);
  const daysRemaining = getDaysRemaining(settings.startDate);
  const progressPercent = Math.min(100, Math.max(0, (currentSavings / settings.savingsGoal) * 100));
  const dailyAvgExpense = daysPassed > 0 ? totalExpense / daysPassed : 0;
  const isOverBudget = dailyAvgExpense > settings.dailyLimit;

  // 365 kunlik ish statistikasi
  const todayStr = getTodayStr();
  const todayTransactions = transactions.filter(t => t.date === todayStr);
  const todayIncome = todayTransactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const todayExpense = todayTransactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const todayNet = todayIncome - todayExpense;

  // Ish kunlari - qaysi kunlarda daromad bo'lgan
  const workDays = new Set<string>();
  transactions.filter(t => t.type === 'income').forEach(t => workDays.add(t.date));
  
  // Oxirgi 7 kunlik daromad
  const last7DaysIncome = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    const dateStr = date.toISOString().split('T')[0];
    const income = transactions.filter(t => t.date === dateStr && t.type === 'income').reduce((s, t) => s + t.amount, 0);
    return {
      date: `${date.getDate()}/${date.getMonth() + 1}`,
      daromad: income,
    };
  });

  // Last 30 days chart data
  const last30Days = Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (29 - i));
    const dateStr = date.toISOString().split('T')[0];
    const dayTransactions = transactions.filter(t => t.date === dateStr);
    const income = dayTransactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
    const expense = dayTransactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
    return {
      date: `${date.getDate()}/${date.getMonth() + 1}`,
      daromad: income,
      xarajat: expense,
      savings: income - expense,
    };
  });

  // Monthly data
  const now = new Date();
  const currentMonthStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const monthIncome = transactions.filter(t => t.type === 'income' && t.date.startsWith(currentMonthStr)).reduce((s, t) => s + t.amount, 0);
  const monthExpense = transactions.filter(t => t.type === 'expense' && t.date.startsWith(currentMonthStr)).reduce((s, t) => s + t.amount, 0);

  // 7-day, 30-day, 90-day reports
  const getPeriodData = (days: number) => {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    const periodTransactions = transactions.filter(t => new Date(t.date) >= startDate);
    const income = periodTransactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
    const expense = periodTransactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
    return { income, expense, savings: income - expense };
  };

  const weekData = getPeriodData(7);
  const monthData = getPeriodData(30);
  const quarterData = getPeriodData(90);

  // Top expense categories
  const categoryTotals: Record<string, number> = {};
  transactions.filter(t => t.type === 'expense').forEach(t => {
    categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
  });
  const topCategories = Object.entries(categoryTotals)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([key, value]) => {
      const cat = EXPENSE_CATEGORIES.find(c => c.value === key);
      return { name: key, label: cat?.label || key, value, color: cat?.color || '#6b7280' };
    });

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-3 shadow-xl">
          <p className="text-sm font-medium text-gray-300 mb-1">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-xs" style={{ color: entry.color }}>
              {entry.name}: {formatCurrency(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Warning */}
      {isOverBudget && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-center gap-3">
          <AlertTriangle className="text-red-400 flex-shrink-0" size={20} />
          <div>
            <p className="text-red-400 font-medium text-sm">⚠️ Ogohlantirish</p>
            <p className="text-red-300 text-xs mt-0.5">
              Kunlik o'rtacha xarajatingiz ({formatCurrency(Math.round(dailyAvgExpense))}) belgilangan limitdan ({formatCurrency(settings.dailyLimit)}) oshib ketdi!
            </p>
          </div>
        </div>
      )}

      {/* Top row: Time, Weather, Quick Entry */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <TashkentTime />
        <WeatherWidget />
        <QuickEntry onAdd={onAddTransaction} />
      </div>

      {/* 365 kunlik ish statistikasi */}
      <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 rounded-2xl p-5 border border-amber-500/20">
        <div className="flex items-center gap-2 mb-4">
          <Briefcase size={18} className="text-amber-400" />
          <span className="font-medium text-sm">365 kunlik ish statistikasi</span>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-gray-800/50 rounded-xl p-3">
            <p className="text-xs text-gray-400">Bugungi daromad</p>
            <p className="text-lg font-bold text-emerald-400 mt-1">{formatCurrency(todayIncome)}</p>
          </div>
          <div className="bg-gray-800/50 rounded-xl p-3">
            <p className="text-xs text-gray-400">Bugungi xarajat</p>
            <p className="text-lg font-bold text-red-400 mt-1">{formatCurrency(todayExpense)}</p>
          </div>
          <div className="bg-gray-800/50 rounded-xl p-3">
            <p className="text-xs text-gray-400">Bugungi sof foyda</p>
            <p className={`text-lg font-bold mt-1 ${todayNet >= 0 ? 'text-cyan-400' : 'text-red-400'}`}>
              {formatCurrency(todayNet)}
            </p>
          </div>
          <div className="bg-gray-800/50 rounded-xl p-3">
            <p className="text-xs text-gray-400">Ish kunlari</p>
            <p className="text-lg font-bold text-amber-400 mt-1">{workDays.size} kun</p>
          </div>
        </div>

        {/* 7 kunlik daromad grafigi */}
        <div className="mt-4 pt-4 border-t border-amber-500/10">
          <p className="text-xs text-gray-400 mb-2 flex items-center gap-1">
            <Zap size={12} className="text-amber-400" />
            Oxirgi 7 kunlik daromad
          </p>
          <div className="flex items-end gap-1.5 h-16">
            {last7DaysIncome.map((day, i) => {
              const maxIncome = Math.max(...last7DaysIncome.map(d => d.daromad), 1);
              const height = (day.daromad / maxIncome) * 100;
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full flex items-end h-12">
                    <div
                      className="w-full bg-gradient-to-t from-amber-500 to-yellow-400 rounded-t-sm transition-all duration-500 min-h-[2px]"
                      style={{ height: `${Math.max(height, 4)}%` }}
                      title={formatCurrency(day.daromad)}
                    />
                  </div>
                  <span className="text-[10px] text-gray-500">{day.date}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard
          title="Jami daromadim"
          value={formatCurrency(totalIncome)}
          icon={<TrendingUp size={20} />}
          color="emerald"
          subtitle={`Bu oy: ${formatCurrency(monthIncome)}`}
        />
        <StatCard
          title="Jami xarajatlarim"
          value={formatCurrency(totalExpense)}
          icon={<TrendingDown size={20} />}
          color="red"
          subtitle={`Bu oy: ${formatCurrency(monthExpense)}`}
        />
        <StatCard
          title="Hozirgi jamg'armam"
          value={formatCurrency(currentSavings)}
          icon={<PiggyBank size={20} />}
          color="cyan"
          subtitle={`Boshlang'ich: ${formatCurrency(settings.initialBalance)}`}
        />
      </div>

      {/* Progress and days */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Savings Goal Progress */}
        <div className="bg-gray-800 rounded-2xl p-5 border border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Target size={18} className="text-emerald-400" />
              <span className="font-medium text-sm">365 kunlik jamg'arma maqsadim</span>
            </div>
            <span className="text-emerald-400 font-bold text-lg">{progressPercent.toFixed(1)}%</span>
          </div>
          
          <div className="relative h-4 bg-gray-700 rounded-full overflow-hidden mb-3">
            <div 
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-emerald-500 to-cyan-400 rounded-full transition-all duration-1000"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          
          <div className="flex justify-between text-xs text-gray-400">
            <span>{formatCurrency(currentSavings)}</span>
            <span>Maqsad: {formatCurrency(settings.savingsGoal)}</span>
          </div>

          {progressPercent >= 100 && (
            <div className="mt-3 text-center py-2 bg-emerald-500/10 rounded-lg border border-emerald-500/30">
              <p className="text-emerald-400 text-sm font-medium">🎉 Tabriklaymiz! Maqsadga erishdingiz!</p>
            </div>
          )}
        </div>

        {/* Days info */}
        <div className="bg-gray-800 rounded-2xl p-5 border border-gray-700">
          <div className="flex items-center gap-2 mb-4">
            <Calendar size={18} className="text-blue-400" />
            <span className="font-medium text-sm">Yil boshidan beri</span>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-700/50 rounded-xl p-3">
              <p className="text-2xl font-bold text-blue-400">{daysPassed}</p>
              <p className="text-xs text-gray-400 mt-1">O'tgan kunlar</p>
            </div>
            <div className="bg-gray-700/50 rounded-xl p-3">
              <p className="text-2xl font-bold text-purple-400">{daysRemaining}</p>
              <p className="text-xs text-gray-400 mt-1">Qolgan kunlar</p>
            </div>
            <div className="bg-gray-700/50 rounded-xl p-3">
              <p className="text-2xl font-bold text-emerald-400">{daysPassed + daysRemaining}</p>
              <p className="text-xs text-gray-400 mt-1">Jami kunlar (365)</p>
            </div>
            <div className="bg-gray-700/50 rounded-xl p-3">
              <p className="text-2xl font-bold text-amber-400">
                {daysRemaining > 0 ? formatShortCurrency(Math.max(0, settings.savingsGoal - currentSavings) / daysRemaining) : '0'}
              </p>
              <p className="text-xs text-gray-400 mt-1">Kuniga kerak</p>
            </div>
          </div>
        </div>
      </div>

      {/* Period reports */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <PeriodCard title="7 kun" data={weekData} />
        <PeriodCard title="30 kun" data={monthData} />
        <PeriodCard title="90 kun" data={quarterData} />
      </div>

      {/* Top categories + Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Top categories */}
        <div className="bg-gray-800 rounded-2xl p-5 border border-gray-700">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 size={18} className="text-amber-400" />
            <span className="font-medium text-sm">Eng ko'p sarflangan</span>
          </div>
          <div className="space-y-3">
            {topCategories.length === 0 ? (
              <p className="text-center text-gray-500 text-sm py-4">Ma'lumot yo'q</p>
            ) : (
              topCategories.map((cat, i) => {
                const total = topCategories.reduce((s, c) => s + c.value, 0);
                const percent = total > 0 ? (cat.value / total) * 100 : 0;
                return (
                  <div key={i} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-300">{cat.label}</span>
                      <span className="text-xs font-medium text-white">{formatCurrency(cat.value)}</span>
                    </div>
                    <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${percent}%`, backgroundColor: cat.color }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Chart */}
        <div className="lg:col-span-2 bg-gray-800 rounded-2xl p-5 border border-gray-700">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 size={18} className="text-purple-400" />
            <span className="font-medium text-sm">So'nggi 30 kun — Daromad va Xarajat</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={last30Days}>
                <defs>
                  <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" tick={{ fill: '#9ca3af', fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#9ca3af', fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="daromad" name="Daromad" stroke="#22c55e" fillOpacity={1} fill="url(#colorIncome)" strokeWidth={2} />
                <Area type="monotone" dataKey="xarajat" name="Xarajat" stroke="#ef4444" fillOpacity={1} fill="url(#colorExpense)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, color, subtitle }: {
  title: string;
  value: string;
  icon: React.ReactNode;
  color: string;
  subtitle: string;
}) {
  const colorClasses: Record<string, string> = {
    emerald: 'from-emerald-500/20 to-emerald-500/5 border-emerald-500/30 text-emerald-400',
    red: 'from-red-500/20 to-red-500/5 border-red-500/30 text-red-400',
    cyan: 'from-cyan-500/20 to-cyan-500/5 border-cyan-500/30 text-cyan-400',
  };

  const iconColors: Record<string, string> = {
    emerald: 'bg-emerald-500/20 text-emerald-400',
    red: 'bg-red-500/20 text-red-400',
    cyan: 'bg-cyan-500/20 text-cyan-400',
  };

  return (
    <div className={`bg-gradient-to-br ${colorClasses[color]} border rounded-2xl p-5`}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-gray-400">{title}</span>
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${iconColors[color]}`}>
          {icon}
        </div>
      </div>
      <p className="text-xl font-bold text-white">{value}</p>
      <p className="text-xs text-gray-400 mt-1">{subtitle}</p>
    </div>
  );
}

function PeriodCard({ title, data }: {
  title: string;
  data: { income: number; expense: number; savings: number };
}) {
  return (
    <div className="bg-gray-800 rounded-2xl p-4 border border-gray-700">
      <p className="text-sm font-medium text-gray-400 mb-3">{title}lik hisobot</p>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <ArrowUpRight size={14} className="text-emerald-400" />
            <span className="text-xs text-gray-400">Daromad</span>
          </div>
          <span className="text-sm font-medium text-emerald-400">{formatCurrency(data.income)}</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <ArrowDownRight size={14} className="text-red-400" />
            <span className="text-xs text-gray-400">Xarajat</span>
          </div>
          <span className="text-sm font-medium text-red-400">{formatCurrency(data.expense)}</span>
        </div>
        <div className="border-t border-gray-700 pt-2 flex items-center justify-between">
          <span className="text-xs text-gray-400">Jamg'arma</span>
          <span className={`text-sm font-bold ${data.savings >= 0 ? 'text-cyan-400' : 'text-red-400'}`}>
            {formatCurrency(data.savings)}
          </span>
        </div>
      </div>
    </div>
  );
}
