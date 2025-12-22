import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowUpRight, ArrowDownRight, Users, Wallet, AlertTriangle, FileText } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

const data = [
  { name: 'Jan', revenue: 4000, expenses: 2400 },
  { name: 'Feb', revenue: 3000, expenses: 1398 },
  { name: 'Mar', revenue: 2000, expenses: 9800 },
  { name: 'Apr', revenue: 2780, expenses: 3908 },
  { name: 'May', revenue: 1890, expenses: 4800 },
  { name: 'Jun', revenue: 2390, expenses: 3800 },
  { name: 'Jul', revenue: 3490, expenses: 4300 },
];

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  const handleExport = () => {
    alert("Preparing financial report... Downloading PDF/Excel file.");
  };

  const viewAllActivity = () => {
    alert("Redirecting to full audit logs...");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Financial Overview</h1>
          <p className="text-slate-500">Welcome back! Here's what's happening today.</p>
        </div>
        <div className="flex gap-3">
           <button 
            onClick={handleExport}
            className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-all"
           >
            Export Report
           </button>
           <button 
            onClick={() => navigate('/invoices')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 shadow-sm transition-all"
           >
            + New Invoice
           </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-green-50 rounded-lg text-green-600">
              <Wallet size={24} />
            </div>
            <span className="flex items-center text-green-600 text-xs font-semibold bg-green-50 px-2 py-1 rounded-full">
              <ArrowUpRight size={14} className="mr-1" /> +12%
            </span>
          </div>
          <h3 className="text-slate-500 text-sm font-medium">Total Revenue</h3>
          <p className="text-2xl font-bold text-slate-900 mt-1">$128,430</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-red-50 rounded-lg text-red-600">
              <ArrowDownRight size={24} />
            </div>
            <span className="flex items-center text-red-600 text-xs font-semibold bg-red-50 px-2 py-1 rounded-full">
              <ArrowUpRight size={14} className="mr-1" /> +4%
            </span>
          </div>
          <h3 className="text-slate-500 text-sm font-medium">Total Expenses</h3>
          <p className="text-2xl font-bold text-slate-900 mt-1">$45,200</p>
        </div>

         <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
              <Users size={24} />
            </div>
            <span className="flex items-center text-slate-600 text-xs font-semibold bg-slate-50 px-2 py-1 rounded-full">
               Active
            </span>
          </div>
          <h3 className="text-slate-500 text-sm font-medium">Total Employees</h3>
          <p className="text-2xl font-bold text-slate-900 mt-1">42</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-orange-50 rounded-lg text-orange-600">
              <AlertTriangle size={24} />
            </div>
            <span className="flex items-center text-orange-600 text-xs font-semibold bg-orange-50 px-2 py-1 rounded-full">
              Action Req
            </span>
          </div>
          <h3 className="text-slate-500 text-sm font-medium">Pending Approvals</h3>
          <p className="text-2xl font-bold text-slate-900 mt-1">5</p>
        </div>
      </div>

      {/* Main Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Revenue vs Expenses</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                <Tooltip 
                  contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} 
                />
                <Area type="monotone" dataKey="revenue" stroke="#3b82f6" fillOpacity={1} fill="url(#colorRevenue)" strokeWidth={2} />
                <Area type="monotone" dataKey="expenses" stroke="#ef4444" fillOpacity={1} fill="url(#colorExpenses)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
           <h3 className="text-lg font-bold text-slate-900 mb-6">Recent Activity</h3>
           <div className="space-y-6">
              {[
                { title: 'Payroll Run Completed', desc: 'October 2023 Payroll', time: '2 hours ago', icon: Users, color: 'bg-green-100 text-green-600' },
                { title: 'New Expense Flagged', desc: 'High risk detected by AI', time: '5 hours ago', icon: AlertTriangle, color: 'bg-red-100 text-red-600' },
                { title: 'Invoice Paid', desc: 'INV-1001 from TechCorp', time: '1 day ago', icon: FileText, color: 'bg-blue-100 text-blue-600' },
              ].map((item, idx) => (
                <div key={idx} className="flex gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${item.color}`}>
                    <item.icon size={18} />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900">{item.title}</h4>
                    <p className="text-xs text-slate-500">{item.desc}</p>
                    <span className="text-xs text-slate-400 mt-1 block">{item.time}</span>
                  </div>
                </div>
              ))}
           </div>
           <button 
            onClick={viewAllActivity}
            className="w-full mt-6 py-2 text-sm text-blue-600 font-medium hover:bg-blue-50 rounded-lg transition-colors"
           >
            View All Activity
           </button>
        </div>
      </div>
    </div>
  );
};