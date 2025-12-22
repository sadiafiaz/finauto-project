import React, { useRef, useState } from 'react';
import { MOCK_EXPENSES } from '../constants';
import { RiskLevel, Status, Expense } from '../types';
import { UploadCloud, AlertOctagon, Check, X, FileText } from 'lucide-react';

export const Expenses: React.FC = () => {
  const [expenses, setExpenses] = useState<Expense[]>(MOCK_EXPENSES);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const newExpense: Expense = {
        id: `EXP-${Date.now()}`,
        vendor: 'New Uploaded Receipt',
        date: new Date().toISOString().split('T')[0],
        amount: Math.floor(Math.random() * 1000) + 50,
        category: 'Uncategorized',
        status: Status.PENDING,
        riskLevel: RiskLevel.LOW,
        description: `Uploaded: ${file.name}`
      };
      setExpenses([newExpense, ...expenses]);
      alert(`AI Analysis Complete: Found new expense from ${file.name}.`);
    }
  };

  const handleUpdateStatus = (id: string, newStatus: Status) => {
    setExpenses(prev => prev.map(exp => 
      exp.id === id ? { ...exp, status: newStatus } : exp
    ));
    const action = newStatus === Status.APPROVED ? 'Approved' : 'Rejected';
    alert(`Expense ${id} has been ${action}.`);
  };

  const getRiskColor = (level: RiskLevel) => {
    switch (level) {
      case RiskLevel.LOW: return 'bg-green-100 text-green-800';
      case RiskLevel.MEDIUM: return 'bg-yellow-100 text-yellow-800';
      case RiskLevel.HIGH: return 'bg-red-100 text-red-800';
    }
  };

  const getStatusColor = (status: Status) => {
    switch (status) {
      case Status.APPROVED: return 'text-green-600 bg-green-50 border-green-100';
      case Status.PENDING: return 'text-yellow-600 bg-yellow-50 border-yellow-100';
      case Status.REJECTED: return 'text-red-600 bg-red-50 border-red-100';
      default: return 'text-slate-600 bg-slate-50';
    }
  };

  return (
    <div className="space-y-6">
       <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Expense Management</h1>
          <p className="text-slate-500">Track company spending and detect anomalies via AI.</p>
        </div>
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          accept="image/*,.pdf" 
          onChange={handleFileChange}
        />
        <button 
          onClick={handleUploadClick}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 shadow-sm transition-all"
        >
          <UploadCloud size={16} /> Upload Receipt
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
           <div className="text-sm text-slate-500 mb-1">Total Spent (Oct)</div>
           <div className="text-3xl font-bold text-slate-900">${expenses.reduce((acc, curr) => acc + curr.amount, 0).toLocaleString()}</div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
           <div className="text-sm text-slate-500 mb-1">Pending Approval</div>
           <div className="text-3xl font-bold text-orange-600">
             {expenses.filter(e => e.status === Status.PENDING).length} Items
           </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 border-l-4 border-l-red-500">
           <div className="flex items-center gap-2 text-sm text-red-600 font-semibold mb-1">
             <AlertOctagon size={16} /> High Risk Detected
           </div>
           <div className="text-3xl font-bold text-slate-900">
             {expenses.filter(e => e.riskLevel === RiskLevel.HIGH).length} Items
           </div>
           <div className="text-xs text-slate-400 mt-1">Requires immediate review</div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-700">
            <tr>
              <th className="px-6 py-4 font-semibold">Vendor</th>
              <th className="px-6 py-4 font-semibold">Date</th>
              <th className="px-6 py-4 font-semibold">Category</th>
              <th className="px-6 py-4 font-semibold">Amount</th>
              <th className="px-6 py-4 font-semibold">AI Risk Score</th>
              <th className="px-6 py-4 font-semibold">Status</th>
              <th className="px-6 py-4 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {expenses.map((exp) => (
              <tr key={exp.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="font-medium text-slate-900">{exp.vendor}</div>
                  {exp.description && <div className="text-xs text-slate-500 truncate max-w-[200px]">{exp.description}</div>}
                </td>
                <td className="px-6 py-4 text-slate-600">{exp.date}</td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center px-2 py-1 rounded-md bg-slate-100 text-slate-600 text-xs font-medium">
                    {exp.category}
                  </span>
                </td>
                <td className="px-6 py-4 font-medium text-slate-900">${exp.amount.toLocaleString()}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRiskColor(exp.riskLevel)}`}>
                    {exp.riskLevel} Risk
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(exp.status)}`}>
                    {exp.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                     <button 
                       onClick={() => alert(`Opening receipt details for ${exp.vendor}...`)}
                       className="p-1 hover:bg-slate-100 rounded text-slate-500" title="View Receipt"
                     >
                       <FileText size={16} />
                     </button>
                     {exp.status === Status.PENDING && (
                       <>
                        <button 
                          onClick={() => handleUpdateStatus(exp.id, Status.APPROVED)}
                          className="p-1 hover:bg-green-100 rounded text-green-600 transition-colors" title="Approve"
                        >
                          <Check size={16} />
                        </button>
                        <button 
                          onClick={() => handleUpdateStatus(exp.id, Status.REJECTED)}
                          className="p-1 hover:bg-red-100 rounded text-red-600 transition-colors" title="Reject"
                        >
                          <X size={16} />
                        </button>
                       </>
                     )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};