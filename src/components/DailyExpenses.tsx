import { useState } from 'react';
import { Transaction, EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '../types';
import { formatCurrency, formatDate, getTodayStr } from '../utils/format';
import { Plus, Edit3, Trash2, Search, X, Check, Filter } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

interface DailyExpensesProps {
  transactions: Transaction[];
  onAdd: (t: Transaction) => void;
  onUpdate: (t: Transaction) => void;
  onDelete: (id: string) => void;
}

export default function DailyExpenses({ transactions, onAdd, onUpdate, onDelete }: DailyExpensesProps) {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');

  const [formData, setFormData] = useState({
    date: getTodayStr(),
    type: 'expense' as 'income' | 'expense',
    amount: '',
    category: 'ovqat',
    description: '',
    note: '',
  });

  const resetForm = () => {
    setFormData({
      date: getTodayStr(),
      type: 'expense',
      amount: '',
      category: 'ovqat',
      description: '',
      note: '',
    });
    setEditingId(null);
    setShowForm(false);
  };

  const handleSubmit = () => {
    if (!formData.amount || parseFloat(formData.amount) <= 0) return;

    const transaction: Transaction = {
      id: editingId || uuidv4(),
      date: formData.date,
      type: formData.type,
      amount: parseFloat(formData.amount),
      category: formData.category,
      description: formData.description,
      note: formData.note,
      createdAt: editingId 
        ? transactions.find(t => t.id === editingId)?.createdAt || new Date().toISOString()
        : new Date().toISOString(),
    };

    if (editingId) {
      onUpdate(transaction);
    } else {
      onAdd(transaction);
    }
    resetForm();
  };

  const handleEdit = (t: Transaction) => {
    setFormData({
      date: t.date,
      type: t.type,
      amount: t.amount.toString(),
      category: t.category,
      description: t.description,
      note: t.note,
    });
    setEditingId(t.id);
    setShowForm(true);
  };

  const getCategoryLabel = (category: string, type: string) => {
    const cats = type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
    return cats.find(c => c.value === category)?.label || category;
  };

  const getCategoryColor = (category: string, type: string) => {
    const cats = type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
    return cats.find(c => c.value === category)?.color || '#6b7280';
  };

  // Filter and sort transactions
  const filteredTransactions = transactions
    .filter(t => {
      if (filterType !== 'all' && t.type !== filterType) return false;
      if (filterCategory !== 'all' && t.category !== filterCategory) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return (
          t.description.toLowerCase().includes(q) ||
          t.note.toLowerCase().includes(q) ||
          t.category.toLowerCase().includes(q) ||
          t.date.includes(q)
        );
      }
      return true;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Group by date
  const groupedByDate = filteredTransactions.reduce((acc, t) => {
    if (!acc[t.date]) acc[t.date] = [];
    acc[t.date].push(t);
    return acc;
  }, {} as Record<string, Transaction[]>);

  const allCategories = [...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES];

  return (
    <div className="space-y-4">
      {/* Top actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Qidirish..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition-colors"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as any)}
            className="px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500"
          >
            <option value="all">Hammasi</option>
            <option value="income">Daromad</option>
            <option value="expense">Xarajat</option>
          </select>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500"
          >
            <option value="all">Barcha kategoriyalar</option>
            {allCategories.map(c => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
        </div>
        <button
          onClick={() => { setShowForm(true); setEditingId(null); }}
          className="px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-xl text-sm font-medium text-white hover:opacity-90 transition-opacity flex items-center gap-2 whitespace-nowrap"
        >
          <Plus size={16} />
          Qo'shish
        </button>
      </div>

      {/* Form modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-gray-800 rounded-2xl border border-gray-700 w-full max-w-md p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">{editingId ? 'Tahrirlash' : 'Yangi qo\'shish'}</h3>
              <button onClick={resetForm} className="p-1 hover:bg-gray-700 rounded-lg">
                <X size={20} />
              </button>
            </div>

            {/* Type toggle */}
            <div className="flex gap-2">
              <button
                onClick={() => setFormData({ ...formData, type: 'expense', category: 'ovqat' })}
                className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  formData.type === 'expense'
                    ? 'bg-red-500/20 border border-red-500/50 text-red-400'
                    : 'bg-gray-700 text-gray-400 border border-gray-600'
                }`}
              >
                🛒 Xarajat
              </button>
              <button
                onClick={() => setFormData({ ...formData, type: 'income', category: 'maosh' })}
                className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  formData.type === 'income'
                    ? 'bg-emerald-500/20 border border-emerald-500/50 text-emerald-400'
                    : 'bg-gray-700 text-gray-400 border border-gray-600'
                }`}
              >
                💵 Daromad
              </button>
            </div>

            {/* Date */}
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Sana</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-3 py-2.5 bg-gray-700 border border-gray-600 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Amount */}
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Summa (so'm)</label>
              <input
                type="number"
                placeholder="0"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                className="w-full px-3 py-2.5 bg-gray-700 border border-gray-600 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Category */}
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Kategoriya</label>
              <div className="grid grid-cols-2 gap-2">
                {(formData.type === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES).map((cat) => (
                  <button
                    key={cat.value}
                    onClick={() => setFormData({ ...formData, category: cat.value })}
                    className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                      formData.category === cat.value
                        ? 'bg-emerald-500/20 border border-emerald-500/50 text-emerald-400'
                        : 'bg-gray-700 border border-gray-600 text-gray-400 hover:border-gray-500'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Nima uchun sarfladingiz / Tavsif</label>
              <input
                type="text"
                placeholder="Masalan: Non, go'sht..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2.5 bg-gray-700 border border-gray-600 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Note */}
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Qo'shimcha izoh</label>
              <textarea
                placeholder="Ixtiyoriy..."
                value={formData.note}
                onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                rows={2}
                className="w-full px-3 py-2.5 bg-gray-700 border border-gray-600 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 resize-none"
              />
            </div>

            {/* Submit */}
            <button
              onClick={handleSubmit}
              disabled={!formData.amount || parseFloat(formData.amount) <= 0}
              className="w-full py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-xl text-sm font-medium text-white hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Check size={16} />
              {editingId ? 'Saqlash' : 'Qo\'shish'}
            </button>
          </div>
        </div>
      )}

      {/* Transactions list */}
      <div className="space-y-4">
        {Object.keys(groupedByDate).length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Filter size={40} className="mx-auto mb-3 opacity-50" />
            <p className="text-sm">Hech qanday yozuv topilmadi</p>
            <p className="text-xs mt-1">Yangi daromad yoki xarajat qo'shing</p>
          </div>
        ) : (
          Object.entries(groupedByDate).map(([date, items]) => {
            const dayIncome = items.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
            const dayExpense = items.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
            return (
              <div key={date} className="bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden">
                <div className="px-4 py-3 bg-gray-750 border-b border-gray-700 flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-300">{formatDate(date)}</span>
                  <div className="flex gap-3 text-xs">
                    {dayIncome > 0 && <span className="text-emerald-400">+{formatCurrency(dayIncome)}</span>}
                    {dayExpense > 0 && <span className="text-red-400">-{formatCurrency(dayExpense)}</span>}
                  </div>
                </div>
                <div className="divide-y divide-gray-700/50">
                  {items.map((t) => (
                    <div key={t.id} className="px-4 py-3 flex items-center gap-3 hover:bg-gray-700/30 transition-colors">
                      <div
                        className="w-2 h-2 rounded-full flex-shrink-0"
                        style={{ backgroundColor: getCategoryColor(t.category, t.type) }}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-white truncate">
                            {t.description || getCategoryLabel(t.category, t.type)}
                          </span>
                          <span className="text-xs text-gray-500 flex-shrink-0">
                            {getCategoryLabel(t.category, t.type)}
                          </span>
                        </div>
                        {t.note && <p className="text-xs text-gray-500 truncate mt-0.5">{t.note}</p>}
                      </div>
                      <span className={`text-sm font-semibold flex-shrink-0 ${t.type === 'income' ? 'text-emerald-400' : 'text-red-400'}`}>
                        {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                      </span>
                      <div className="flex gap-1 flex-shrink-0">
                        <button
                          onClick={() => handleEdit(t)}
                          className="p-1.5 hover:bg-gray-600 rounded-lg transition-colors text-gray-400 hover:text-white"
                        >
                          <Edit3 size={14} />
                        </button>
                        <button
                          onClick={() => onDelete(t.id)}
                          className="p-1.5 hover:bg-red-500/20 rounded-lg transition-colors text-gray-400 hover:text-red-400"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
