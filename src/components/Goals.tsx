import { Transaction, AppSettings } from '../types';
import { formatCurrency, getDaysPassed, getDaysRemaining } from '../utils/format';
import { Target, Trophy, Calendar, TrendingUp, AlertCircle, CheckCircle2, Sparkles } from 'lucide-react';
import { useState } from 'react';

interface GoalsProps {
  transactions: Transaction[];
  settings: AppSettings;
  onUpdateSettings: (settings: AppSettings) => void;
}

export default function Goals({ transactions, settings, onUpdateSettings }: GoalsProps) {
  const [newGoal, setNewGoal] = useState(settings.savingsGoal.toString());

  const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  const currentSavings = settings.initialBalance + totalIncome - totalExpense;
  const daysPassed = getDaysPassed(settings.startDate);
  const daysRemaining = getDaysRemaining(settings.startDate);
  const totalDays = daysPassed + daysRemaining;

  const progressPercent = Math.min(100, Math.max(0, (currentSavings / settings.savingsGoal) * 100));
  const remaining = Math.max(0, settings.savingsGoal - currentSavings);
  const dailyNeeded = daysRemaining > 0 ? remaining / daysRemaining : 0;
  const avgDailySaving = daysPassed > 0 ? currentSavings / daysPassed : 0;

  // Milestones
  const milestones = [
    { percent: 10, label: '10%', achieved: progressPercent >= 10 },
    { percent: 25, label: '25%', achieved: progressPercent >= 25 },
    { percent: 50, label: '50%', achieved: progressPercent >= 50 },
    { percent: 75, label: '75%', achieved: progressPercent >= 75 },
    { percent: 100, label: '100%', achieved: progressPercent >= 100 },
  ];

  // Custom goals
  const customGoals = [
    { label: '1 000 000 so\'m', value: 1000000 },
    { label: '5 000 000 so\'m', value: 5000000 },
    { label: '10 000 000 so\'m', value: 10000000 },
    { label: '25 000 000 so\'m', value: 25000000 },
    { label: '50 000 000 so\'m', value: 50000000 },
  ];

  const handleSetGoal = () => {
    const val = parseFloat(newGoal);
    if (val > 0) {
      onUpdateSettings({ ...settings, savingsGoal: val });
    }
  };

  return (
    <div className="space-y-6">
      {/* Main goal card */}
      <div className="bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 rounded-2xl p-6 border border-emerald-500/20">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-cyan-500 rounded-xl flex items-center justify-center">
            <Trophy size={24} className="text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">365 kunlik jamg'arma maqsadi</h3>
            <p className="text-sm text-gray-400">Moliyaviy erishish yo'lingiz</p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">Joriy holat</span>
            <span className="text-2xl font-bold text-emerald-400">{progressPercent.toFixed(1)}%</span>
          </div>
          <div className="relative h-5 bg-gray-700 rounded-full overflow-hidden">
            <div
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-emerald-500 to-cyan-400 rounded-full transition-all duration-1000"
              style={{ width: `${progressPercent}%` }}
            />
            {/* Milestone markers */}
            {milestones.map((m, i) => (
              <div
                key={i}
                className={`absolute top-0 bottom-0 w-0.5 ${m.achieved ? 'bg-white/50' : 'bg-white/20'}`}
                style={{ left: `${m.percent}%` }}
              />
            ))}
          </div>
          <div className="flex justify-between mt-2">
            {milestones.map((m, i) => (
              <span key={i} className={`text-xs ${m.achieved ? 'text-emerald-400' : 'text-gray-500'}`}>
                {m.achieved ? '✓' : ''} {m.label}
              </span>
            ))}
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
          <div className="bg-gray-800/50 rounded-xl p-3">
            <p className="text-xs text-gray-400">Joriy jamg'arma</p>
            <p className="text-lg font-bold text-white mt-1">{formatCurrency(currentSavings)}</p>
          </div>
          <div className="bg-gray-800/50 rounded-xl p-3">
            <p className="text-xs text-gray-400">Maqsad</p>
            <p className="text-lg font-bold text-emerald-400 mt-1">{formatCurrency(settings.savingsGoal)}</p>
          </div>
          <div className="bg-gray-800/50 rounded-xl p-3">
            <p className="text-xs text-gray-400">Qolgan summa</p>
            <p className="text-lg font-bold text-amber-400 mt-1">{formatCurrency(remaining)}</p>
          </div>
          <div className="bg-gray-800/50 rounded-xl p-3">
            <p className="text-xs text-gray-400">Kuniga kerak</p>
            <p className="text-lg font-bold text-cyan-400 mt-1">{formatCurrency(Math.round(dailyNeeded))}</p>
          </div>
        </div>
      </div>

      {/* Analysis cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-gray-800 rounded-2xl p-5 border border-gray-700">
          <div className="flex items-center gap-2 mb-3">
            <Calendar size={16} className="text-blue-400" />
            <span className="text-sm font-medium">Vaqt taqsimoti</span>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-xs text-gray-400">O'tgan kunlar</span>
              <span className="text-sm font-medium text-white">{daysPassed} / {totalDays}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-xs text-gray-400">Qolgan kunlar</span>
              <span className="text-sm font-medium text-white">{daysRemaining}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-xs text-gray-400">Vaqt foizi</span>
              <span className="text-sm font-medium text-blue-400">{totalDays > 0 ? ((daysPassed / totalDays) * 100).toFixed(1) : 0}%</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-2xl p-5 border border-gray-700">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp size={16} className="text-emerald-400" />
            <span className="text-sm font-medium">O'rtacha ko'rsatkichlar</span>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-xs text-gray-400">Kuniga o'rtacha jamg'arma</span>
              <span className="text-sm font-medium text-emerald-400">{formatCurrency(Math.round(avgDailySaving))}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-xs text-gray-400">Kuniga kerak</span>
              <span className="text-sm font-medium text-amber-400">{formatCurrency(Math.round(dailyNeeded))}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-xs text-gray-400">Farq</span>
              <span className={`text-sm font-medium ${avgDailySaving >= dailyNeeded ? 'text-emerald-400' : 'text-red-400'}`}>
                {avgDailySaving >= dailyNeeded ? '+' : ''}{formatCurrency(Math.round(avgDailySaving - dailyNeeded))}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-2xl p-5 border border-gray-700">
          <div className="flex items-center gap-2 mb-3">
            {progressPercent >= 100 ? <CheckCircle2 size={16} className="text-emerald-400" /> : <AlertCircle size={16} className="text-amber-400" />}
            <span className="text-sm font-medium">Holat</span>
          </div>
          {progressPercent >= 100 ? (
            <div className="text-center py-2">
              <Sparkles className="mx-auto text-emerald-400 mb-2" size={24} />
              <p className="text-emerald-400 font-medium text-sm">Maqsadga erishdingiz!</p>
              <p className="text-xs text-gray-400 mt-1">🎉 Tabriklaymiz!</p>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-xs text-gray-400">Joriy tezlikda</span>
                <span className="text-sm font-medium text-white">
                  {avgDailySaving > 0 && daysRemaining > 0
                    ? `${Math.round(currentSavings + avgDailySaving * daysRemaining).toLocaleString()} so'm`
                    : '—'}
                </span>
              </div>
              <p className="text-xs text-gray-500">
                {avgDailySaving >= dailyNeeded
                  ? '✅ Siz yaxshi tempda ketyapsiz!'
                  : '⚠️ Tezlikni oshiring yoki xarajatlarni kamaytiring'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Set custom goal */}
      <div className="bg-gray-800 rounded-2xl p-5 border border-gray-700">
        <div className="flex items-center gap-2 mb-4">
          <Target size={18} className="text-purple-400" />
          <span className="font-medium text-sm">Maqsadni o'zgartirish</span>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <input
              type="number"
              value={newGoal}
              onChange={(e) => setNewGoal(e.target.value)}
              placeholder="Yangi maqsad summasi"
              className="w-full px-4 py-2.5 bg-gray-700 border border-gray-600 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
            />
          </div>
          <button
            onClick={handleSetGoal}
            className="px-6 py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl text-sm font-medium text-white hover:opacity-90 transition-opacity whitespace-nowrap"
          >
            Saqlash
          </button>
        </div>

        {/* Quick goals */}
        <div className="flex flex-wrap gap-2 mt-4">
          <span className="text-xs text-gray-400 self-center">Tez tanlash:</span>
          {customGoals.map((g, i) => (
            <button
              key={i}
              onClick={() => { setNewGoal(g.value.toString()); onUpdateSettings({ ...settings, savingsGoal: g.value }); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                settings.savingsGoal === g.value
                  ? 'bg-purple-500/20 border border-purple-500/50 text-purple-400'
                  : 'bg-gray-700 border border-gray-600 text-gray-400 hover:border-gray-500'
              }`}
            >
              {g.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
