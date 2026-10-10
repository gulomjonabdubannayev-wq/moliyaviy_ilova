import { useState, useRef } from 'react';
import { Transaction, AppSettings } from '../types';
import { formatCurrency } from '../utils/format';
import { exportToJSON, exportToCSV, downloadFile, importFromJSON } from '../utils/storage';
import { Download, Upload, Database, Trash2, AlertTriangle, Settings as SettingsIcon, Wallet, Calendar, DollarSign, Shield } from 'lucide-react';

interface SettingsProps {
  transactions: Transaction[];
  settings: AppSettings;
  onUpdateSettings: (settings: AppSettings) => void;
  onClearAll: () => void;
  onImport: (transactions: Transaction[], settings: AppSettings) => void;
}

export default function Settings({ transactions, settings, onUpdateSettings, onClearAll, onImport }: SettingsProps) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [importMessage, setImportMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExportJSON = () => {
    const json = exportToJSON(transactions, settings);
    downloadFile(json, `shaxsiy-moliyam-${new Date().toISOString().split('T')[0]}.json`, 'application/json');
  };

  const handleExportCSV = () => {
    const csv = exportToCSV(transactions);
    downloadFile(csv, `shaxsiy-moliyam-${new Date().toISOString().split('T')[0]}.csv`, 'text/csv');
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const data = importFromJSON(content);
      if (data) {
        onImport(data.transactions, data.settings);
        setImportMessage(`✅ Muvaffaqiyatli import qilindi! ${data.transactions.length} ta yozuv yuklandi.`);
      } else {
        setImportMessage('❌ Noto\'g\'ri fayl formati. JSON faylni tanlang.');
      }
      setTimeout(() => setImportMessage(''), 5000);
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleClearAll = () => {
    onClearAll();
    setShowConfirm(false);
  };

  const totalIncome = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Import message */}
      {importMessage && (
        <div className={`rounded-xl p-4 text-sm ${importMessage.startsWith('✅') ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400' : 'bg-red-500/10 border border-red-500/30 text-red-400'}`}>
          {importMessage}
        </div>
      )}

      {/* General settings */}
      <div className="bg-gray-800 rounded-2xl p-5 border border-gray-700">
        <div className="flex items-center gap-2 mb-4">
          <SettingsIcon size={18} className="text-blue-400" />
          <span className="font-medium text-sm">Umumiy sozlamalar</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-gray-400 mb-1 block flex items-center gap-1">
              <DollarSign size={12} /> Boshlang'ich pul (so'm)
            </label>
            <input
              type="number"
              value={settings.initialBalance}
              onChange={(e) => onUpdateSettings({ ...settings, initialBalance: parseFloat(e.target.value) || 0 })}
              className="w-full px-3 py-2.5 bg-gray-700 border border-gray-600 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="text-xs text-gray-400 mb-1 block flex items-center gap-1">
              <Calendar size={12} /> Boshlanish sanasi
            </label>
            <input
              type="date"
              value={settings.startDate}
              onChange={(e) => onUpdateSettings({ ...settings, startDate: e.target.value })}
              className="w-full px-3 py-2.5 bg-gray-700 border border-gray-600 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="text-xs text-gray-400 mb-1 block flex items-center gap-1">
              <Shield size={12} /> Kunlik sarflash limiti (so'm)
            </label>
            <input
              type="number"
              value={settings.dailyLimit}
              onChange={(e) => onUpdateSettings({ ...settings, dailyLimit: parseFloat(e.target.value) || 0 })}
              className="w-full px-3 py-2.5 bg-gray-700 border border-gray-600 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="text-xs text-gray-400 mb-1 block flex items-center gap-1">
              <Shield size={12} /> Oylik sarflash limiti (so'm)
            </label>
            <input
              type="number"
              value={settings.monthlyLimit}
              onChange={(e) => onUpdateSettings({ ...settings, monthlyLimit: parseFloat(e.target.value) || 0 })}
              className="w-full px-3 py-2.5 bg-gray-700 border border-gray-600 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>
      </div>

      {/* Data info */}
      <div className="bg-gray-800 rounded-2xl p-5 border border-gray-700">
        <div className="flex items-center gap-2 mb-4">
          <Database size={18} className="text-emerald-400" />
          <span className="font-medium text-sm">Ma'lumotlar statistikasi</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-gray-700/50 rounded-xl p-3">
            <p className="text-xs text-gray-400">Jami yozuvlar</p>
            <p className="text-lg font-bold text-white">{transactions.length}</p>
          </div>
          <div className="bg-gray-700/50 rounded-xl p-3">
            <p className="text-xs text-gray-400">Daromad yozuvlari</p>
            <p className="text-lg font-bold text-emerald-400">{transactions.filter(t => t.type === 'income').length}</p>
          </div>
          <div className="bg-gray-700/50 rounded-xl p-3">
            <p className="text-xs text-gray-400">Xarajat yozuvlari</p>
            <p className="text-lg font-bold text-red-400">{transactions.filter(t => t.type === 'expense').length}</p>
          </div>
          <div className="bg-gray-700/50 rounded-xl p-3">
            <p className="text-xs text-gray-400">Jami daromad</p>
            <p className="text-lg font-bold text-cyan-400">{formatCurrency(totalIncome)}</p>
          </div>
        </div>
      </div>

      {/* Export/Import */}
      <div className="bg-gray-800 rounded-2xl p-5 border border-gray-700">
        <div className="flex items-center gap-2 mb-4">
          <Wallet size={18} className="text-purple-400" />
          <span className="font-medium text-sm">Eksport / Import / Zaxira</span>
        </div>

        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleExportJSON}
              className="flex-1 px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-sm font-medium text-white hover:bg-gray-600 transition-colors flex items-center justify-center gap-2"
            >
              <Download size={16} />
              JSON eksport
            </button>
            <button
              onClick={handleExportCSV}
              className="flex-1 px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-sm font-medium text-white hover:bg-gray-600 transition-colors flex items-center justify-center gap-2"
            >
              <Download size={16} />
              CSV eksport
            </button>
          </div>

          <div className="relative">
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleImport}
              className="hidden"
              id="import-file"
            />
            <label
              htmlFor="import-file"
              className="w-full px-4 py-3 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-xl text-sm font-medium text-blue-400 hover:from-blue-500/30 hover:to-purple-500/30 transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Upload size={16} />
              JSON import (zaxira nusxasini tiklash)
            </label>
          </div>
        </div>
      </div>

      {/* Danger zone */}
      <div className="bg-gray-800 rounded-2xl p-5 border border-red-500/30">
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle size={18} className="text-red-400" />
          <span className="font-medium text-sm text-red-400">Xavfli zona</span>
        </div>

        {!showConfirm ? (
          <button
            onClick={() => setShowConfirm(true)}
            className="px-4 py-2.5 bg-red-500/10 border border-red-500/30 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/20 transition-colors flex items-center gap-2"
          >
            <Trash2 size={16} />
            Barcha ma'lumotlarni o'chirish
          </button>
        ) : (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
            <p className="text-sm text-red-400 mb-3">⚠️ Haqiqatan ham barcha ma'lumotlarni o'chirmoqchimisiz? Bu amalni qaytarib bo'lmaydi!</p>
            <div className="flex gap-2">
              <button
                onClick={handleClearAll}
                className="px-4 py-2 bg-red-500 rounded-xl text-sm font-medium text-white hover:bg-red-600 transition-colors"
              >
                Ha, o'chirish
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 bg-gray-700 rounded-xl text-sm font-medium text-white hover:bg-gray-600 transition-colors"
              >
                Yo'q, bekor qilish
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
