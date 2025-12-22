import React, { useState } from 'react';
import { CreditCard, Plus, Check, Shield, Zap, Trash2, Calendar, Building, Mic, PieChart, Users, Receipt } from 'lucide-react';

export const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('billing');
  const [showAddCard, setShowAddCard] = useState(false);
  const [cards, setCards] = useState([
    { id: 1, last4: '4242', brand: 'Visa', expiry: '12/24', isDefault: true },
  ]);

  const [newCard, setNewCard] = useState({ number: '', expiry: '', cvc: '', name: '' });

  const handleAddCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCard.number.length > 4) {
      setCards([...cards, { 
        id: Date.now(), 
        last4: newCard.number.slice(-4), 
        brand: 'Mastercard', 
        expiry: newCard.expiry, 
        isDefault: false 
      }]);
      setShowAddCard(false);
      setNewCard({ number: '', expiry: '', cvc: '', name: '' });
    }
  };

  const premiumFeatures = [
    { name: 'Multi-company support', icon: Building },
    { name: 'Tax/GST automation', icon: Receipt },
    { name: 'AI budgeting advice', icon: PieChart },
    { name: 'AI voice-based WhatsApp queries', icon: Mic },
    { name: 'Payment reminder automation', icon: Calendar },
    { name: 'Advanced analytics dashboard', icon: Users },
  ];

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Settings & Billing</h1>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 mb-8">
        <button 
          onClick={() => setActiveTab('profile')}
          className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'profile' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
        >
          Company Profile
        </button>
        <button 
          onClick={() => setActiveTab('billing')}
          className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'billing' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
        >
          Billing & Plans
        </button>
        <button 
          onClick={() => setActiveTab('notifications')}
          className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'notifications' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
        >
          Notifications
        </button>
      </div>

      {activeTab === 'billing' ? (
        <div className="space-y-8">
          {/* Current Plan Section */}
          <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-xl p-8 text-white shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                 <span className="bg-blue-500/20 text-blue-200 text-xs font-semibold px-2 py-1 rounded border border-blue-500/30">CURRENT PLAN</span>
              </div>
              <h2 className="text-2xl font-bold mb-2">Basic Starter (Trial)</h2>
              <p className="text-slate-400 text-sm">Your free trial expires in <span className="text-white font-semibold">12 days</span>.</p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <span className="text-3xl font-bold">$0<span className="text-lg font-medium text-slate-400">/mo</span></span>
              <button className="bg-white text-slate-900 px-6 py-2 rounded-lg font-semibold hover:bg-slate-100 transition-colors flex items-center gap-2">
                <Zap size={16} className="text-yellow-500" /> Upgrade to Premium
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Payment Methods */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-900">Payment Methods</h3>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Shield size={14} className="text-green-600" /> Secured by Stripe
                </div>
              </div>
              
              <div className="space-y-4">
                {cards.map((card) => (
                  <div key={card.id} className="group border border-slate-200 rounded-xl p-4 flex items-center justify-between hover:border-blue-300 transition-colors bg-white">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-8 bg-slate-100 rounded border border-slate-200 flex items-center justify-center">
                        <CreditCard size={18} className="text-slate-600" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{card.brand} ending in {card.last4}</p>
                        <p className="text-xs text-slate-500">Expires {card.expiry}</p>
                      </div>
                    </div>
                    {card.isDefault ? (
                      <span className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded font-medium">Default</span>
                    ) : (
                      <button 
                        onClick={() => setCards(cards.filter(c => c.id !== card.id))}
                        className="text-slate-400 hover:text-red-500 p-2"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                ))}

                {!showAddCard ? (
                  <button 
                    onClick={() => setShowAddCard(true)}
                    className="w-full py-4 border-2 border-dashed border-slate-300 rounded-xl text-slate-500 hover:border-blue-400 hover:text-blue-600 hover:bg-slate-50 transition-all flex items-center justify-center gap-2 text-sm font-medium"
                  >
                    <Plus size={18} /> Add Payment Method
                  </button>
                ) : (
                  <form onSubmit={handleAddCard} className="bg-slate-50 p-6 rounded-xl border border-slate-200 animate-in fade-in slide-in-from-top-2">
                    <div className="grid grid-cols-1 gap-4 mb-4">
                      <div>
                         <label className="block text-xs font-semibold text-slate-500 mb-1">Cardholder Name</label>
                         <input 
                           required
                           value={newCard.name}
                           onChange={e => setNewCard({...newCard, name: e.target.value})}
                           type="text" 
                           placeholder="John Doe" 
                           className="w-full p-2 border border-slate-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none" 
                        />
                      </div>
                      <div>
                         <label className="block text-xs font-semibold text-slate-500 mb-1">Card Number</label>
                         <input 
                           required
                           value={newCard.number}
                           onChange={e => setNewCard({...newCard, number: e.target.value})}
                           type="text" 
                           placeholder="0000 0000 0000 0000" 
                           className="w-full p-2 border border-slate-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none" 
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                           <label className="block text-xs font-semibold text-slate-500 mb-1">Expiry Date</label>
                           <input 
                             required
                             value={newCard.expiry}
                             onChange={e => setNewCard({...newCard, expiry: e.target.value})}
                             type="text" 
                             placeholder="MM/YY" 
                             className="w-full p-2 border border-slate-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none" 
                          />
                        </div>
                        <div>
                           <label className="block text-xs font-semibold text-slate-500 mb-1">CVC</label>
                           <input 
                             required
                             value={newCard.cvc}
                             onChange={e => setNewCard({...newCard, cvc: e.target.value})}
                             type="text" 
                             placeholder="123" 
                             className="w-full p-2 border border-slate-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none" 
                          />
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <button type="submit" className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700">Save Card</button>
                      <button type="button" onClick={() => setShowAddCard(false)} className="px-4 py-2 text-slate-600 text-sm hover:bg-slate-200 rounded">Cancel</button>
                    </div>
                  </form>
                )}
              </div>
            </div>

            {/* Premium Features Promo */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
               <h3 className="text-lg font-bold text-slate-900 mb-4">Premium Features</h3>
               <p className="text-sm text-slate-500 mb-6">Upgrade to our Enterprise plan to unlock advanced automation for your finance.</p>
               
               <div className="space-y-4">
                 {premiumFeatures.map((feature, idx) => (
                   <div key={idx} className="flex items-center gap-3">
                     <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                       <feature.icon size={14} />
                     </div>
                     <span className="text-sm text-slate-700 font-medium">{feature.name}</span>
                   </div>
                 ))}
               </div>
               
               <button className="w-full mt-8 py-3 border border-blue-600 text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors">
                 View Full Feature Comparison
               </button>
            </div>
          </div>

          {/* Billing History */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
             <div className="p-6 border-b border-slate-200">
               <h3 className="font-bold text-slate-900">Billing History</h3>
             </div>
             <table className="w-full text-left text-sm">
               <thead className="bg-slate-50 text-slate-600">
                 <tr>
                   <th className="px-6 py-4">Invoice ID</th>
                   <th className="px-6 py-4">Date</th>
                   <th className="px-6 py-4">Amount</th>
                   <th className="px-6 py-4">Status</th>
                   <th className="px-6 py-4">Action</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-slate-100">
                 <tr className="hover:bg-slate-50">
                   <td className="px-6 py-4 font-medium">INV-BILL-001</td>
                   <td className="px-6 py-4 text-slate-500">Oct 01, 2023</td>
                   <td className="px-6 py-4 font-bold text-slate-900">$0.00</td>
                   <td className="px-6 py-4"><span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-medium">Paid</span></td>
                   <td className="px-6 py-4"><button className="text-blue-600 hover:underline">Download</button></td>
                 </tr>
               </tbody>
             </table>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-64 bg-slate-50 rounded-xl border border-dashed border-slate-300">
          <p className="text-slate-500">Profile and Notification settings are under development.</p>
        </div>
      )}
    </div>
  );
};