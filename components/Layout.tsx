import React from 'react';
import { Sidebar } from './Sidebar';
import { Bell, Search, UserCircle } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Search feature: AI is indexing your financial data...");
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />
      <div className="md:ml-64 transition-all duration-300">
        {/* Top Header */}
        <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-8 sticky top-0 z-10">
          <div className="flex items-center gap-4 w-96">
            <form onSubmit={handleSearch} className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Search invoices, employees..." 
                className="w-full pl-10 pr-4 py-2 text-sm bg-slate-100 border-none rounded-full focus:ring-2 focus:ring-blue-500 focus:outline-none placeholder-slate-500 text-slate-700"
              />
            </form>
          </div>
          <div className="flex items-center gap-6">
            <button 
              onClick={() => alert("You have 3 new automated notifications from n8n workflows.")}
              className="relative text-slate-500 hover:text-slate-700 transition-colors p-2 rounded-full hover:bg-slate-50"
            >
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
            </button>
            <div 
              onClick={() => alert("Opening User Profile & Security Settings...")}
              className="flex items-center gap-2 cursor-pointer p-1 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <UserCircle size={32} className="text-slate-400" />
              <div className="hidden lg:block text-sm">
                <p className="font-semibold text-slate-700 leading-tight">Admin User</p>
                <p className="text-xs text-slate-500">Finance Manager</p>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="p-8">
          {children}
        </main>
      </div>
    </div>
  );
};