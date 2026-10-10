import { Transaction, EXPENSE_CATEGORIES } from '../types';
import { formatCurrency, getMonthName } from '../utils/format';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend } from 'recharts';
import { PieChart as PieIcon, BarChart3, TrendingUp, Calendar } from 'lucide-react';
import { useState } from 'react';

interface ReportsProps {
  transactions: Transaction[];
}

export default function Reports({ transactions }: ReportsProps) {
  const [activeTab, setActiveTab] = useState<'monthly' | 'category' | 'trend'>('monthly');

  // Monthly data
  const monthlyData = getMonthlyData(transactions);

  // Category data
  const categoryData = getCategoryData(transactions);

  // Savings trend
  const savingsTrend = getSavingsTrend(transactions);

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
      {/* Tabs */}
      <div className="flex gap-2 bg-gray-800 p-1 rounded-xl border border-gray-700 w-fit">
        <button
          onClick={() => setActiveTab('monthly')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'monthly' ? 'bg-emerald-500/20 text-emerald-400' : 'text-gray-400 hover:text-white'
          }`}
        >
          <span className="flex items-center gap-2"><BarChart3 size={14} /> Oylik</span>
        </button>
        <button
          onClick={() => setActiveTab('category')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'category' ? 'bg-emerald-500/20 text-emerald-400' : 'text-gray-400 hover:text-white'
          }`}
        >
          <span className="flex items-center gap-2"><PieIcon size={14} /> Kategoriyalar</span>
        </button>
        <button
          onClick={() => setActiveTab('trend')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'trend' ? 'bg-emerald-500/20 text-emerald-400' : 'text-gray-400 hover:text-white'
          }`}
        >
          <span className="flex items-center gap-2"><TrendingUp size={14} /> Trend</span>
        </button>
      </div>

      {/* Monthly Report */}
      {activeTab === 'monthly' && (
        <div className="space-y-4">
          <div className="bg-gray-800 rounded-2xl p-5 border border-gray-700">
            <div className="flex items-center gap-2 mb-4">
              <Calendar size={18} className="text-blue-400" />
              <span className="font-medium text-sm">Oylik daromad va xarajatlar</span>
            </div>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData}>
                  <XAxis dataKey="month" tick={{ fill: '#9ca3af', fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#9ca3af', fontSize: 10 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ fontSize: '12px' }} />
                  <Bar dataKey="income" name="Daromad" fill="#22c55e" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="expense" name="Xarajat" fill="#ef4444" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Monthly table */}
          <div className="bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden">
            <div className="px-5 py-3 border-b border-gray-700">
              <span className="font-medium text-sm">Oylik hisobot jadvali</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-700 text-gray-400">
                    <th className="text-left px-4 py-3 font-medium">Oy</th>
                    <th className="text-right px-4 py-3 font-medium">Daromad</th>
                    <th className="text-right px-4 py-3 font-medium">Xarajat</th>
                    <th className="text-right px-4 py-3 font-medium">Jamg'arma</th>
                  </tr>
                </thead>
                <tbody>
                  {monthlyData.map((row, i) => (
                    <tr key={i} className="border-b border-gray-700/50 hover:bg-gray-700/30">
                      <td className="px-4 py-3 text-white">{row.month}</td>
                      <td className="px-4 py-3 text-right text-emerald-400">{formatCurrency(row.income)}</td>
                      <td className="px-4 py-3 text-right text-red-400">{formatCurrency(row.expense)}</td>
                      <td className={`px-4 py-3 text-right font-medium ${row.savings >= 0 ? 'text-cyan-400' : 'text-red-400'}`}>
                        {formatCurrency(row.savings)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Category Report */}
      {activeTab === 'category' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Pie chart */}
            <div className="bg-gray-800 rounded-2xl p-5 border border-gray-700">
              <div className="flex items-center gap-2 mb-4">
                <PieIcon size={18} className="text-purple-400" />
                <span className="font-medium text-sm">Xarajatlar taqsimoti</span>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value: number) => formatCurrency(value)}
                      contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
                      itemStyle={{ color: '#fff', fontSize: '12px' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Category ranking */}
            <div className="bg-gray-800 rounded-2xl p-5 border border-gray-700">
              <div className="flex items-center gap-2 mb-4">
                <BarChart3 size={18} className="text-amber-400" />
                <span className="font-medium text-sm">Eng ko'p sarflangan kategoriyalar</span>
              </div>
              <div className="space-y-3">
                {categoryData
                  .sort((a, b) => b.value - a.value)
                  .map((cat, i) => {
                    const total = categoryData.reduce((s, c) => s + c.value, 0);
                    const percent = total > 0 ? (cat.value / total) * 100 : 0;
                    return (
                      <div key={cat.name} className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-300">{cat.label}</span>
                          <span className="text-sm font-medium text-white">{formatCurrency(cat.value)}</span>
                        </div>
                        <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{ width: `${percent}%`, backgroundColor: cat.color }}
                          />
                        </div>
                        <p className="text-xs text-gray-500">{percent.toFixed(1)}%</p>
                      </div>
                    );
                  })}
                {categoryData.length === 0 && (
                  <p className="text-center text-gray-500 text-sm py-8">Ma'lumot yo'q</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Savings Trend */}
      {activeTab === 'trend' && (
        <div className="space-y-4">
          <div className="bg-gray-800 rounded-2xl p-5 border border-gray-700">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp size={18} className="text-emerald-400" />
              <span className="font-medium text-sm">Jamg'arma trendi (oylik)</span>
            </div>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyData}>
                  <XAxis dataKey="month" tick={{ fill: '#9ca3af', fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#9ca3af', fontSize: 10 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="savings"
                    name="Jamg'arma"
                    stroke="#06b6d4"
                    strokeWidth={3}
                    dot={{ fill: '#06b6d4', r: 5 }}
                    activeDot={{ r: 7 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Savings trend cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {savingsTrend.slice(-3).map((item, i) => (
              <div key={i} className="bg-gray-800 rounded-2xl p-4 border border-gray-700">
                <p className="text-xs text-gray-400">{item.month}</p>
                <p className={`text-lg font-bold mt-1 ${item.savings >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {formatCurrency(item.savings)}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Daromad: {formatCurrency(item.income)}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function getMonthlyData(transactions: Transaction[]) {
  const months: Record<string, { income: number; expense: number }> = {};

  transactions.forEach(t => {
    const monthKey = t.date.substring(0, 7);
    if (!months[monthKey]) months[monthKey] = { income: 0, expense: 0 };
    if (t.type === 'income') months[monthKey].income += t.amount;
    else months[monthKey].expense += t.amount;
  });

  return Object.entries(months)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, data]) => ({
      month: getMonthName(key),
      income: data.income,
      expense: data.expense,
      savings: data.income - data.expense,
    }));
}

function getCategoryData(transactions: Transaction[]) {
  const categories: Record<string, number> = {};

  transactions
    .filter(t => t.type === 'expense')
    .forEach(t => {
      categories[t.category] = (categories[t.category] || 0) + t.amount;
    });

  return Object.entries(categories).map(([key, value]) => {
    const cat = EXPENSE_CATEGORIES.find(c => c.value === key);
    return {
      name: key,
      label: cat?.label || key,
      value,
      color: cat?.color || '#6b7280',
    };
  });
}

function getSavingsTrend(transactions: Transaction[]) {
  const monthlyData = getMonthlyData(transactions);
  let cumulative = 0;
  return monthlyData.map(item => {
    cumulative += item.savings;
    return { ...item, cumulative };
  });
}
