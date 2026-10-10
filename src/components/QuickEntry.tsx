import { useState } from 'react';
import { Transaction, EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '../types';
import { getTodayStr } from '../utils/format';
import { Plus, DollarSign, TrendingUp, TrendingDown } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

interface QuickEntryProps {
  onAdd: (t: Transaction) => void;
}

export default function QuickEntry({ onAdd }: QuickEntryProps) {
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [category, setCategory] = useState('ovqat');
  const [description, setDescription] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = () => {
    if (!amount || parseFloat(amount) <= 0) return;

    const transaction: Transaction = {
      id: uuidv4(),
      date: getTodayStr(),
      type,
      amount: parseFloat(amount),
      category,
      description: description || (type === 'income' ? 'Daromad' : 'Xarajat'),
      note: '',
      createdAt: new Date().toISOString(),
    };

    onAdd(transaction);
    
    // Reset form
    setAmount('');
    setDescription('');
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2000);
  };

  const categories = type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  return (
    <div className="bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 rounded-2xl p-5 border border-emerald-500/20">
      <div className="flex items-center gap-2 mb-4">
        <Plus size={18} className="text-emerald-400" />
        <span className="font-medium text-sm">Tez qo'shish</span>
      </div>

      {/* Type toggle */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => { setType('expense'); setCategory('ovqat'); }}
          className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2 ${
            type === 'expense'
              ? 'bg-red-500/20 border border-red-500/50 text-red-400'
              : 'bg-gray-700/50 border border-gray-600 text-gray-400 hover:border-gray-500'
          }`}
        >
          <TrendingDown size={16} />
          Xarajat
        </button>
        <button
          onClick={() => { setType('income'); setCategory('maosh'); }}
          className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2 ${
            type === 'income'
              ? 'bg-emerald-500/20 border border-emerald-500/50 text-emerald-400'
              : 'bg-gray-700/50 border border-gray-600 text-gray-400 hover:border-gray-500'
          }`}
        >
          <TrendingUp size={16} />
          Daromad
        </button>
      </div>

      {/* Amount input */}
      <div className="relative mb-4">
        <DollarSign size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="number"
          placeholder="Summani kiriting..."
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-600 rounded-xl text-lg font-bold text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition-colors"
          autoFocus
        />
      </div>

      {/* Category selector */}
      <div className="mb-4">
        <p className="text-xs text-gray-400 mb-2">Kategoriya:</p>
        <div className="flex flex-wrap gap-2">
          {categories.slice(0, 4).map((cat) => (
            <button
              key={cat.value}
              onClick={() => setCategory(cat.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                category === cat.value
                  ? 'bg-emerald-500/20 border border-emerald-500/50 text-emerald-400'
                  : 'bg-gray-700/50 border border-gray-600 text-gray-400 hover:border-gray-500'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Description */}
      <input
        type="text"
        placeholder="Nima uchun? (ixtiyoriy)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition-colors mb-4"
      />

      {/* Submit button */}
      <button
        onClick={handleSubmit}
        disabled={!amount || parseFloat(amount) <= 0}
        className="w-full py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-xl text-sm font-bold text-white hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        <Plus size={16} />
        Qo'shish
      </button>

      {/* Success message */}
      {showSuccess && (
        <div className="mt-3 text-center py-2 bg-emerald-500/20 rounded-lg border border-emerald-500/30 animate-fade-in">
          <p className="text-emerald-400 text-sm font-medium">✅ Muvaffaqiyatli qo'shildi!</p>
        </div>
      )}
    </div>
  );
}
