import { Transaction } from '../types';
import { formatCurrency } from '../utils/format';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

interface CalendarViewProps {
  transactions: Transaction[];
}

export default function CalendarView({ transactions }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const adjustedFirstDay = firstDay === 0 ? 6 : firstDay - 1; // Monday start

  const monthNames = [
    'Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'Iyun',
    'Iyul', 'Avgust', 'Sentabr', 'Oktabr', 'Noyabr', 'Dekabr'
  ];

  const dayNames = ['Du', 'Se', 'Ch', 'Pa', 'Ju', 'Sh', 'Ya'];

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const getDayData = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const dayTransactions = transactions.filter(t => t.date === dateStr);
    const income = dayTransactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
    const expense = dayTransactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
    return { income, expense, count: dayTransactions.length };
  };

  const today = new Date();
  const isToday = (day: number) =>
    today.getFullYear() === year && today.getMonth() === month && today.getDate() === day;

  return (
    <div className="bg-gray-800 rounded-2xl p-5 border border-gray-700">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={prevMonth}
          className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
        >
          <ChevronLeft size={18} />
        </button>
        <h3 className="font-semibold text-white">
          {monthNames[month]} {year}
        </h3>
        <button
          onClick={nextMonth}
          className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      {/* Day names */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayNames.map((name, i) => (
          <div key={i} className="text-center text-xs text-gray-500 py-1 font-medium">
            {name}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {/* Empty cells for offset */}
        {Array.from({ length: adjustedFirstDay }).map((_, i) => (
          <div key={`empty-${i}`} className="aspect-square" />
        ))}

        {/* Day cells */}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const data = getDayData(day);
          const hasData = data.count > 0;

          return (
            <div
              key={day}
              className={`
                aspect-square rounded-lg p-1 flex flex-col items-center justify-center
                text-xs relative transition-all
                ${isToday(day) ? 'ring-2 ring-emerald-500' : ''}
                ${hasData ? 'bg-gray-700/50' : 'hover:bg-gray-700/30'}
              `}
              title={hasData ? `Daromad: ${formatCurrency(data.income)}, Xarajat: ${formatCurrency(data.expense)}` : ''}
            >
              <span className={`font-medium ${isToday(day) ? 'text-emerald-400' : 'text-gray-300'}`}>
                {day}
              </span>
              {hasData && (
                <div className="flex gap-0.5 mt-0.5">
                  {data.income > 0 && <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />}
                  {data.expense > 0 && <div className="w-1.5 h-1.5 rounded-full bg-red-400" />}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mt-4 pt-3 border-t border-gray-700">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-emerald-400" />
          <span className="text-xs text-gray-400">Daromad</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-red-400" />
          <span className="text-xs text-gray-400">Xarajat</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded ring-2 ring-emerald-500" />
          <span className="text-xs text-gray-400">Bugun</span>
        </div>
      </div>
    </div>
  );
}
