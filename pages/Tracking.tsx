import React, { useState } from 'react';
import { Truck, MapPin, Package, CheckCircle } from 'lucide-react';

export const Tracking: React.FC = () => {
  const [trackingId, setTrackingId] = useState('');
  const [status, setStatus] = useState<any>(null);

  const handleTrack = () => {
    // Mock Tracking Logic
    if (trackingId) {
      setStatus({
        id: trackingId,
        status: 'In Transit',
        location: 'Distribution Center, NY',
        estimatedDelivery: 'Tomorrow, by 8 PM',
        history: [
           { time: '10:00 AM', event: 'Out for Delivery' },
           { time: '06:30 AM', event: 'Arrived at Facility' },
           { time: 'Yesterday', event: 'Shipped from Warehouse' }
        ]
      });
    } else {
      alert('Please enter a valid Tracking ID');
    }
  };

  const sendWhatsAppUpdate = () => {
    alert(`Success: Delivery update for package ${trackingId} has been sent to the customer via WhatsApp.`);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-slate-900">Delivery Tracking</h1>
        <p className="text-slate-500 mt-2">Track client shipments and automate WhatsApp updates.</p>
      </div>

      <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100">
        <div className="flex gap-4 mb-8">
          <input 
            type="text" 
            placeholder="Enter Tracking ID (e.g., TRK-9988)" 
            value={trackingId}
            onChange={(e) => setTrackingId(e.target.value)}
            className="flex-1 p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <button 
            onClick={handleTrack}
            className="px-6 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Truck size={18} /> Track Package
          </button>
        </div>

        {status && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
             <div className="border-l-4 border-blue-500 pl-4 mb-6">
                <h3 className="text-xl font-bold text-slate-900">{status.status}</h3>
                <p className="text-slate-500">Est. Delivery: {status.estimatedDelivery}</p>
             </div>

             <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
                {status.history.map((item: any, idx: number) => (
                  <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-slate-300 group-[.is-active]:bg-blue-500 text-slate-500 group-[.is-active]:text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                       <Package size={16} />
                    </div>
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-4 rounded border border-slate-200 shadow-sm">
                       <div className="flex items-center justify-between space-x-2 mb-1">
                          <div className="font-bold text-slate-900">{item.event}</div>
                          <time className="font-caveat font-medium text-indigo-500 text-xs">{item.time}</time>
                       </div>
                    </div>
                  </div>
                ))}
             </div>

             <div className="mt-8 pt-6 border-t border-slate-100 flex justify-end">
                <button 
                  onClick={sendWhatsAppUpdate}
                  className="text-green-600 text-sm font-medium flex items-center gap-2 hover:bg-green-50 px-3 py-1 rounded-lg transition-colors"
                >
                   <CheckCircle size={16} /> Send Update via WhatsApp
                </button>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};