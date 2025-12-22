import React, { useState, useRef } from 'react';
import { MOCK_INVOICES } from '../constants';
import { Status, Invoice } from '../types';
import { FilePlus, Upload, Filter, ExternalLink, Send } from 'lucide-react';

export const Invoices: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'sales' | 'purchase'>('sales');
  const [invoices, setInvoices] = useState<Invoice[]>(MOCK_INVOICES);
  const [form, setForm] = useState({ clientName: '', date: '', amount: '' });
  const purchaseFileRef = useRef<HTMLInputElement>(null);

  const handleCreateInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.clientName || !form.amount) return alert('Please fill in all details');

    const newInv: Invoice = {
      id: `INV-${Date.now()}`,
      number: `INV-${1000 + invoices.length + 1}`,
      clientName: form.clientName,
      amount: parseFloat(form.amount),
      date: form.date || new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
      status: Status.PENDING,
      type: 'Sales'
    };

    setInvoices([newInv, ...invoices]);
    setForm({ clientName: '', date: '', amount: '' });
    alert(`Success: Invoice ${newInv.number} generated and sent to ${newInv.clientName} via WhatsApp.`);
  };

  const handlePurchaseUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      alert(`OCR Processing: ${file.name}\nAI is extracting vendor details and amounts...`);
      setTimeout(() => {
        const extractedInv: Invoice = {
          id: `PUR-${Date.now()}`,
          number: `BILL-${Math.floor(Math.random() * 900) + 100}`,
          clientName: 'Extracted Vendor Name',
          amount: 1250.00,
          date: new Date().toISOString().split('T')[0],
          dueDate: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
          status: Status.APPROVED,
          type: 'Purchase'
        };
        setInvoices([extractedInv, ...invoices]);
        alert('Extraction Complete! New purchase bill added to records.');
      }, 2000);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Invoice Processing</h1>
          <p className="text-slate-500">Manage sales invoices and OCR-processed bills.</p>
        </div>
        <div className="flex gap-2">
           <button 
             onClick={() => setActiveTab('sales')}
             className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'sales' ? 'bg-blue-600 text-white' : 'bg-white text-slate-600 hover:bg-slate-50'}`}
           >
             Sales Invoices
           </button>
           <button 
             onClick={() => setActiveTab('purchase')}
             className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'purchase' ? 'bg-blue-600 text-white' : 'bg-white text-slate-600 hover:bg-slate-50'}`}
           >
             Purchase Bills
           </button>
        </div>
      </div>

      {activeTab === 'sales' ? (
        <div className="space-y-6">
          <form onSubmit={handleCreateInvoice} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <h3 className="font-bold text-slate-900 mb-4">Create New Invoice</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <input 
                type="text" 
                placeholder="Client Name" 
                value={form.clientName}
                onChange={e => setForm({...form, clientName: e.target.value})}
                className="p-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none" 
              />
              <input 
                type="date" 
                value={form.date}
                onChange={e => setForm({...form, date: e.target.value})}
                className="p-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none" 
              />
              <input 
                type="number" 
                placeholder="Total Amount" 
                value={form.amount}
                onChange={e => setForm({...form, amount: e.target.value})}
                className="p-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none" 
              />
              <button type="submit" className="bg-blue-600 text-white rounded-lg font-medium text-sm hover:bg-blue-700 flex items-center justify-center gap-2 transition-all">
                <Send size={16} /> Generate & Send
              </button>
            </div>
          </form>

          <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
             <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                <h3 className="font-bold text-slate-900">Sent Invoices</h3>
                <button className="text-slate-500 hover:text-slate-700" onClick={() => alert('Filter options coming soon!')}>
                  <Filter size={18} />
                </button>
             </div>
             <table className="w-full text-left text-sm">
               <thead className="bg-slate-50 text-slate-600">
                 <tr>
                   <th className="px-6 py-4">Invoice #</th>
                   <th className="px-6 py-4">Client</th>
                   <th className="px-6 py-4">Date</th>
                   <th className="px-6 py-4">Amount</th>
                   <th className="px-6 py-4">Status</th>
                   <th className="px-6 py-4">Action</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-slate-100">
                  {invoices.filter(i => i.type === 'Sales').map(inv => (
                    <tr key={inv.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 font-medium">{inv.number}</td>
                      <td className="px-6 py-4">{inv.clientName}</td>
                      <td className="px-6 py-4 text-slate-500">{inv.date}</td>
                      <td className="px-6 py-4 font-bold text-slate-900">${inv.amount.toLocaleString()}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${inv.status === Status.PAID ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                          {inv.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button 
                          onClick={() => alert(`Opening PDF for ${inv.number}...`)}
                          className="text-blue-600 hover:underline text-xs font-medium flex items-center gap-1"
                        >
                          View PDF <ExternalLink size={12} />
                        </button>
                      </td>
                    </tr>
                  ))}
               </tbody>
             </table>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <input type="file" ref={purchaseFileRef} className="hidden" onChange={handlePurchaseUpload} />
          <div 
            onClick={() => purchaseFileRef.current?.click()}
            className="border-2 border-dashed border-slate-300 rounded-xl p-10 flex flex-col items-center justify-center bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <Upload size={48} className="text-slate-400 mb-4" />
            <h3 className="text-lg font-semibold text-slate-700">Upload Bill PDF or Image</h3>
            <p className="text-sm text-slate-500 mt-2 text-center max-w-md">
              Drag and drop your vendor invoices here. OpenAI Vision will extract the details automatically.
            </p>
            <button className="mt-6 px-6 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50">
              Browse Files
            </button>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
             <div className="p-4 border-b border-slate-100">
                <h3 className="font-bold text-slate-900">Processed Bills</h3>
             </div>
             <table className="w-full text-left text-sm">
               <thead className="bg-slate-50 text-slate-600">
                 <tr>
                   <th className="px-6 py-4">Bill #</th>
                   <th className="px-6 py-4">Vendor</th>
                   <th className="px-6 py-4">Due Date</th>
                   <th className="px-6 py-4">Amount</th>
                   <th className="px-6 py-4">Status</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-slate-100">
                  {invoices.filter(i => i.type === 'Purchase').map(inv => (
                    <tr key={inv.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4 font-medium">{inv.number}</td>
                      <td className="px-6 py-4">{inv.clientName}</td>
                      <td className="px-6 py-4 text-slate-500">{inv.dueDate}</td>
                      <td className="px-6 py-4 font-bold text-slate-900">${inv.amount.toLocaleString()}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${inv.status === Status.APPROVED ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-700'}`}>
                          {inv.status}
                        </span>
                      </td>
                    </tr>
                  ))}
               </tbody>
             </table>
          </div>
        </div>
      )}
    </div>
  );
};