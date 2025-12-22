import React, { useState } from 'react';
import { MOCK_EMPLOYEES } from '../constants';
import { Download, PlayCircle, Clock, CheckCircle, XCircle } from 'lucide-react';

export const Payroll: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'payroll' | 'attendance'>('payroll');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleRunPayroll = () => {
    setIsProcessing(true);
    setTimeout(() => {
      alert("Success: Payroll Batch processed! All employees have been notified via WhatsApp and payslips generated.");
      setIsProcessing(false);
    }, 2000);
  };

  const downloadPayslip = (name: string) => {
    alert(`Downloading PDF Payslip for ${name}...`);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Payroll & Attendance</h1>
          <p className="text-slate-500">Manage employee salaries and track work hours.</p>
        </div>
        <div className="flex gap-2">
           <button 
             onClick={() => setActiveTab('payroll')}
             className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'payroll' ? 'bg-blue-600 text-white' : 'bg-white text-slate-600 hover:bg-slate-50'}`}
           >
             Payroll
           </button>
           <button 
             onClick={() => setActiveTab('attendance')}
             className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'attendance' ? 'bg-blue-600 text-white' : 'bg-white text-slate-600 hover:bg-slate-50'}`}
           >
             Attendance
           </button>
        </div>
      </div>

      {activeTab === 'payroll' ? (
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center">
            <h3 className="font-bold text-slate-900">Employee List - Oct 2023</h3>
            <button 
              onClick={handleRunPayroll}
              disabled={isProcessing}
              className={`flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 shadow-sm transition-all ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <PlayCircle size={16} /> {isProcessing ? 'Processing...' : 'Run Payroll Batch'}
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-slate-900 font-semibold border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4">Employee</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Department</th>
                  <th className="px-6 py-4">Basic Salary</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Last Run</th>
                  <th className="px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {MOCK_EMPLOYEES.map((emp) => (
                  <tr key={emp.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-900">
                      <div>{emp.name}</div>
                      <div className="text-xs text-slate-500">{emp.id}</div>
                    </td>
                    <td className="px-6 py-4">{emp.role}</td>
                    <td className="px-6 py-4">{emp.department}</td>
                    <td className="px-6 py-4">${emp.salary.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${emp.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {emp.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">{emp.lastPayrollRun}</td>
                    <td className="px-6 py-4">
                      <button 
                        onClick={() => downloadPayslip(emp.name)}
                        className="text-blue-600 hover:text-blue-800 flex items-center gap-1 text-xs font-medium"
                      >
                        <Download size={14} /> Payslip
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
             <div className="bg-blue-50 p-4 rounded-lg">
               <div className="text-blue-600 font-semibold mb-1">Present Today</div>
               <div className="text-2xl font-bold text-slate-900">38/42</div>
             </div>
             <div className="bg-yellow-50 p-4 rounded-lg">
               <div className="text-yellow-600 font-semibold mb-1">Late Arrivals</div>
               <div className="text-2xl font-bold text-slate-900">3</div>
             </div>
             <div className="bg-red-50 p-4 rounded-lg">
               <div className="text-red-600 font-semibold mb-1">Absent</div>
               <div className="text-2xl font-bold text-slate-900">1</div>
             </div>
           </div>

           <h3 className="font-bold text-slate-900 mb-4">Daily Attendance Log</h3>
           <div className="space-y-3">
             {MOCK_EMPLOYEES.map((emp) => (
               <div key={emp.id} className="flex items-center justify-between p-4 border border-slate-100 rounded-lg hover:bg-slate-50 transition-colors">
                 <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold">
                     {emp.name.charAt(0)}
                   </div>
                   <div>
                     <div className="font-medium text-slate-900">{emp.name}</div>
                     <div className="text-xs text-slate-500">{emp.department}</div>
                   </div>
                 </div>
                 <div className="flex items-center gap-8 text-sm">
                   <div className="flex flex-col items-center">
                      <span className="text-xs text-slate-400 uppercase">Check In</span>
                      <span className="font-medium text-slate-700">09:02 AM</span>
                   </div>
                   <div className="flex flex-col items-center">
                      <span className="text-xs text-slate-400 uppercase">Check Out</span>
                      <span className="font-medium text-slate-700">--:--</span>
                   </div>
                   <div className="flex items-center gap-1">
                      {emp.status === 'Active' ? <CheckCircle size={16} className="text-green-500" /> : <XCircle size={16} className="text-red-500" />}
                      <span className="font-medium">{emp.status === 'Active' ? 'Present' : 'Absent'}</span>
                   </div>
                 </div>
               </div>
             ))}
           </div>
        </div>
      )}
    </div>
  );
};