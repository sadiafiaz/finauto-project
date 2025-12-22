import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { LayoutDashboard, Users, CreditCard, FileText, MessageSquare, BarChart3, Settings, Truck } from 'lucide-react';

export const Sidebar: React.FC = () => {
  const location = useLocation();

  const menuItems = [
    { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/payroll', icon: Users, label: 'Payroll & Attendance' },
    { path: '/expenses', icon: CreditCard, label: 'Expenses' },
    { path: '/invoices', icon: FileText, label: 'Invoices' },
    { path: '/reports', icon: BarChart3, label: 'Reports' },
    { path: '/tracking', icon: Truck, label: 'Tracking' },
    { path: '/chat', icon: MessageSquare, label: 'AI Assistant' },
  ];

  return (
    <div className="hidden md:flex flex-col w-64 bg-slate-900 h-screen fixed left-0 top-0 border-r border-slate-800">
      <div className="p-6 flex items-center gap-3">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white">F</div>
        <span className="text-xl font-bold text-white tracking-tight">FinAuto</span>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-1">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <item.icon size={20} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <Link 
          to="/settings"
          className={`flex items-center gap-3 px-4 py-3 text-sm font-medium w-full rounded-lg transition-colors ${
            location.pathname === '/settings' 
            ? 'bg-blue-600 text-white' 
            : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Settings size={20} />
          Settings
        </Link>
      </div>
    </div>
  );
};