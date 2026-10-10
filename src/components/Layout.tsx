import { useState } from 'react';
import { PageType } from '../types';
import { LayoutDashboard, Receipt, BarChart3, Target, Settings, Menu, X, Wallet } from 'lucide-react';

interface LayoutProps {
  currentPage: PageType;
  onPageChange: (page: PageType) => void;
  children: React.ReactNode;
}

const menuItems: { id: PageType; label: string; icon: React.ReactNode }[] = [
  { id: 'dashboard', label: 'Bosh sahifa', icon: <LayoutDashboard size={20} /> },
  { id: 'expenses', label: 'Kunlik xarajatlar', icon: <Receipt size={20} /> },
  { id: 'reports', label: 'Hisobotlar', icon: <BarChart3 size={20} /> },
  { id: 'goals', label: 'Maqsadlar', icon: <Target size={20} /> },
  { id: 'settings', label: 'Sozlamalar', icon: <Settings size={20} /> },
];

export default function Layout({ currentPage, onPageChange, children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-900 text-white flex">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50
        w-64 bg-gray-800 border-r border-gray-700
        transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        flex flex-col
      `}>
        {/* Logo */}
        <div className="p-5 border-b border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-cyan-500 rounded-xl flex items-center justify-center">
              <Wallet size={22} className="text-white" />
            </div>
            <div>
              <h1 className="font-bold text-lg leading-tight">Shaxsiy Moliyam</h1>
              <p className="text-xs text-gray-400">Moliyaviy boshqaruv</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                onPageChange(item.id);
                setSidebarOpen(false);
              }}
              className={`
                w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium
                transition-all duration-200
                ${currentPage === item.id
                  ? 'bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                }
              `}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-700">
          <div className="bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 rounded-xl p-3 border border-emerald-500/20">
            <p className="text-xs text-gray-400">💡 Maslahat</p>
            <p className="text-xs text-gray-300 mt-1">Har kuni kamida 10% daromadingizni jamg'aring</p>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-gray-900/80 backdrop-blur-xl border-b border-gray-700/50 px-4 lg:px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <h2 className="text-lg font-semibold">
              {menuItems.find(i => i.id === currentPage)?.label}
            </h2>
            <div className="text-sm text-gray-400">
              {new Date().toLocaleDateString('uz-UZ', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
