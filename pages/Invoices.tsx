import React, { useState, useRef } from 'react';
import { MOCK_INVOICES } from '../constants';
import { Status, Invoice } from '../types';
import { FilePlus, Upload, Filter, ExternalLink, Send } from 'lucide-react';
import { n8nService } from '../services/n8nService';

export const Invoices: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'sales' | 'purchase'>('sales');
  const [invoices, setInvoices] = useState<Invoice[]>(MOCK_INVOICES);
  const [form, setForm] = useState({
    clientName: '',
    customerEmail: '',
    customerPhone: '',
    tax: 5,
    paymentTerms: 'Net 15'
  });
  const [items, setItems] = useState([{ name: '', quantity: 1, price: 0 }]);
  const [isLoading, setIsLoading] = useState(false);
  const purchaseFileRef = useRef<HTMLInputElement>(null);

  const handleCreateInvoice = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!form.clientName || !form.customerEmail || !form.customerPhone) {
      return alert('Please fill in client name, email, and phone number');
    }

    const validItems = items.filter(item => item.name && item.quantity > 0 && item.price > 0);
    if (validItems.length === 0) {
      return alert('Please add at least one valid item');
    }

    setIsLoading(true);
    try {
      // Calculate total amount
      const subtotal = validItems.reduce((sum, item) => sum + (item.quantity * item.price), 0);
      const taxAmount = subtotal * (form.tax / 100);
      const totalAmount = subtotal + taxAmount;

      // Trigger n8n workflow for sales order
      const result = await n8nService.createSalesOrder({
        customerName: form.clientName,
        customerEmail: form.customerEmail,
        customerPhone: form.customerPhone,
        items: validItems,
        tax: form.tax,
        paymentTerms: form.paymentTerms
      });

      if (result.success) {
        console.log('N8n Sales Order Result:', result.data);
        const newInv: Invoice = {
          id: `INV-${Date.now()}`,
          number: `INV-${1000 + invoices.length + 1}`,
          clientName: form.clientName,
          amount: totalAmount,
          date: new Date().toISOString().split('T')[0],
          dueDate: new Date(Date.now() + parseInt(form.paymentTerms.replace('Net ', '')) * 86400000).toISOString().split('T')[0],
          status: Status.PENDING,
          type: 'Sales'
        };

        setInvoices([newInv, ...invoices]);
        setForm({
          clientName: '',
          customerEmail: '',
          customerPhone: '',
          tax: 5,
          paymentTerms: 'Net 15'
        });
        setItems([{ name: '', quantity: 1, price: 0 }]);

        // Send WhatsApp notification via n8n
       

        //alert(`Success: Sales order ${newInv.number} created and sent to ${form.clientName} via WhatsApp.`);
      } else {
        alert(`Error: ${result.error}`);
      }
    } catch (error) {
      alert('Failed to create sales order. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const addItem = () => {
    setItems([...items, { name: '', quantity: 1, price: 0 }]);
  };

  const removeItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const updateItem = (index: number, field: string, value: any) => {
    const updatedItems = [...items];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    setItems(updatedItems);
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
            <h3 className="font-bold text-slate-900 mb-4">Create New Sales Order</h3>

            {/* Customer Information */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Client Name</label>
                <input
                  type="text"
                  value={form.clientName}
                  onChange={e => setForm({ ...form, clientName: e.target.value })}
                  className="p-3 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none w-full"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Customer Email</label>
                <input
                  type="email"
                  value={form.customerEmail}
                  onChange={e => setForm({ ...form, customerEmail: e.target.value })}
                  className="p-3 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none w-full"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Customer Phone</label>
                <input
                  type="tel"
                  value={form.customerPhone}
                  onChange={e => setForm({ ...form, customerPhone: e.target.value })}
                  className="p-3 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none w-full"
                  required
                />
              </div>
            </div>

            {/* Items Section */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold text-slate-900">Items</h4>
                <button
                  type="button"
                  onClick={addItem}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
                >
                  <FilePlus size={16} /> Add Item
                </button>
              </div>

              {/* Item Headers */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-3 px-3">
                <label className="text-sm font-medium text-slate-700">Item Name</label>
                <label className="text-sm font-medium text-slate-700">Quantity</label>
                <label className="text-sm font-medium text-slate-700">Price</label>
                <label className="text-sm font-medium text-slate-700">Total</label>
              </div>

              {items.map((item, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-3 p-3 bg-slate-50 rounded-lg">
                  <input
                    type="text"
                    value={item.name}
                    onChange={e => updateItem(index, 'name', e.target.value)}
                    className="p-2 border border-slate-200 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={e => updateItem(index, 'quantity', parseInt(e.target.value) || 0)}
                    min="1"
                    className="p-2 border border-slate-200 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                  <input
                    type="number"
                    value={item.price}
                    onChange={e => updateItem(index, 'price', parseFloat(e.target.value) || 0)}
                    min="0"
                    step="0.01"
                    className="p-2 border border-slate-200 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-700">
                      ${(item.quantity * item.price).toFixed(2)}
                    </span>
                    {items.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeItem(index)}
                        className="text-red-500 hover:text-red-700 text-sm"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Order Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Tax Percentage</label>
                <div className="relative">
                  <input
                    type="number"
                    value={form.tax}
                    onChange={e => setForm({ ...form, tax: parseFloat(e.target.value) || 0 })}
                    min="0"
                    max="100"
                    step="0.1"
                    className="p-3 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none w-full"
                  />
                  <span className="absolute right-3 top-3 text-slate-500 text-sm">%</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Payment Terms</label>
                <select
                  value={form.paymentTerms}
                  onChange={e => setForm({ ...form, paymentTerms: e.target.value })}
                  className="p-3 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none w-full"
                >
                  <option value="Net 15">Net 15 Days</option>
                  <option value="Net 30">Net 30 Days</option>
                  <option value="Net 45">Net 45 Days</option>
                  <option value="Net 60">Net 60 Days</option>
                  <option value="COD">Cash on Delivery</option>
                </select>
              </div>
            </div>

            {/* Total and Submit */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-200">
              <div className="text-right">
                <div className="text-sm text-slate-600">
                  Subtotal: ${items.reduce((sum, item) => sum + (item.quantity * item.price), 0).toFixed(2)}
                </div>
                <div className="text-sm text-slate-600">
                  Tax ({form.tax}%): ${(items.reduce((sum, item) => sum + (item.quantity * item.price), 0) * form.tax / 100).toFixed(2)}
                </div>
                <div className="text-lg font-bold text-slate-900">
                  Total: ${(items.reduce((sum, item) => sum + (item.quantity * item.price), 0) * (1 + form.tax / 100)).toFixed(2)}
                </div>
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className={`bg-blue-600 text-white rounded-lg font-medium text-sm px-6 py-3 hover:bg-blue-700 flex items-center gap-2 transition-all ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <Send size={16} /> {isLoading ? 'Processing...' : 'Create Sales Order'}
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
  onClick={() => {
    if (inv.pdf_url) {
      window.open(inv.pdf_url, '_blank');
    } else {
      alert('PDF not available yet. Please wait for payroll processing.');
    }
  }}
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
