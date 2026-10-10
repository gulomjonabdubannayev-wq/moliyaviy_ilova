import { useState, useEffect } from 'react';
import { Transaction, AppSettings, PageType } from './types';
import { loadTransactions, saveTransactions, loadSettings, saveSettings, defaultSettings } from './utils/storage';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import DailyExpenses from './components/DailyExpenses';
import Reports from './components/Reports';
import Goals from './components/Goals';
import SettingsPage from './components/Settings';
import CalendarView from './components/CalendarView';

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageType>('dashboard');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);
  const [showCalendar, setShowCalendar] = useState(false);

  // Load data from localStorage on mount
  useEffect(() => {
    setTransactions(loadTransactions());
    setSettings(loadSettings());
  }, []);

  // Save transactions whenever they change
  useEffect(() => {
    saveTransactions(transactions);
  }, [transactions]);

  // Save settings whenever they change
  useEffect(() => {
    saveSettings(settings);
  }, [settings]);

  const handleAddTransaction = (t: Transaction) => {
    setTransactions(prev => [...prev, t]);
  };

  const handleUpdateTransaction = (t: Transaction) => {
    setTransactions(prev => prev.map(item => item.id === t.id ? t : item));
  };

  const handleDeleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(item => item.id !== id));
  };

  const handleUpdateSettings = (newSettings: AppSettings) => {
    setSettings(newSettings);
  };

  const handleClearAll = () => {
    setTransactions([]);
  };

  const handleImport = (importedTransactions: Transaction[], importedSettings: AppSettings) => {
    setTransactions(importedTransactions);
    setSettings(importedSettings);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            <Dashboard transactions={transactions} settings={settings} />
            {showCalendar && <CalendarView transactions={transactions} />}
            <div className="text-center">
              <button
                onClick={() => setShowCalendar(!showCalendar)}
                className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-xl text-sm text-gray-400 hover:text-white hover:border-gray-600 transition-all"
              >
                {showCalendar ? '📅 Kalendarni yashirish' : '📅 Kalendarni ko\'rsatish'}
              </button>
            </div>
          </div>
        );
      case 'expenses':
        return (
          <div className="space-y-6">
            <DailyExpenses
              transactions={transactions}
              onAdd={handleAddTransaction}
              onUpdate={handleUpdateTransaction}
              onDelete={handleDeleteTransaction}
            />
            <CalendarView transactions={transactions} />
          </div>
        );
      case 'reports':
        return <Reports transactions={transactions} />;
      case 'goals':
        return (
          <Goals
            transactions={transactions}
            settings={settings}
            onUpdateSettings={handleUpdateSettings}
          />
        );
      case 'settings':
        return (
          <SettingsPage
            transactions={transactions}
            settings={settings}
            onUpdateSettings={handleUpdateSettings}
            onClearAll={handleClearAll}
            onImport={handleImport}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Layout currentPage={currentPage} onPageChange={setCurrentPage}>
      {renderPage()}
    </Layout>
  );
}
