import React, { useState } from 'react';
import { Truck, MapPin, Package, CheckCircle, Loader2 } from 'lucide-react';
import { n8nService } from '../services/n8nService';

export const Tracking: React.FC = () => {
  const [orderId, setOrderId] = useState('');
  const [status, setStatus] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleTrack = async () => {
    if (!orderId.trim()) {
      setError('Please enter a valid Order ID');
      return;
    }

    setIsLoading(true);
    setError(null);
    setStatus(null);

    try {
      // Send request to n8n tracking endpoint
      const result = await n8nService.trackOrder(orderId);

      if (result.success && result.data?.reply) {
        // Parse the reply to extract information
        const reply = result.data.reply;

        // Extract key information from the reply text
        const orderIdMatch = reply.match(/Order ID: ([^\n]+)/);
        const amountMatch = reply.match(/Amount PKR: ([^\n]+)/);
        const trackingMatch = reply.match(/Tracking Number: ([^\n]+)/);
        const courierMatch = reply.match(/Courier: ([^\n]+)/);
        const linkMatch = reply.match(/(https:\/\/[^\s]+)/);
        const nameMatch = reply.match(/Dear ([^,]+),/);

        setStatus({
          orderId: orderIdMatch?.[1] || orderId,
          customerName: nameMatch?.[1] || 'Customer',
          amount: amountMatch?.[1] || 'N/A',
          trackingNumber: trackingMatch?.[1] || 'N/A',
          courier: courierMatch?.[1] || 'N/A',
          trackingLink: linkMatch?.[1] || '',
          fullReply: reply,
          status: reply.toLowerCase().includes('shipped') ? 'Shipped' :
            reply.toLowerCase().includes('in_transit') ? 'In Transit' :
              reply.toLowerCase().includes('delivered') ? 'Delivered' : 'Processing'
        });
      } else {
        setError('Order not found or invalid Order ID');
      }
    } catch (error) {
      setError('Failed to track order. Please try again.');
      console.error('Tracking error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const sendWhatsAppUpdate = async () => {
    if (!status) return;

    try {
      // Send WhatsApp notification using existing n8n service
      await n8nService.sendWhatsAppNotification(
        status.fullReply,
        '+923001234567' // Replace with actual customer phone
      );
      alert(`Success: Delivery update for order ${status.orderId} has been sent to ${status.customerName} via WhatsApp.`);
    } catch (error) {
      alert('Failed to send WhatsApp update. Please try again.');
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-slate-900">Order Tracking</h1>
        <p className="text-slate-500 mt-2">Track customer orders and automate delivery updates via WhatsApp.</p>
      </div>

      <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100">
        <div className="flex gap-4 mb-8">
          <input
            type="text"
            placeholder="Enter Order ID (e.g., OR1006)"
            value={orderId}
            onChange={(e) => {
              setOrderId(e.target.value);
              setError(null);
            }}
            className="flex-1 p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <button
            onClick={handleTrack}
            disabled={isLoading}
            className="px-6 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Truck size={18} />}
            {isLoading ? 'Tracking...' : 'Track Order'}
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {status && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="border-l-4 border-blue-500 pl-4 mb-6">
              <h3 className="text-xl font-bold text-slate-900">{status.status}</h3>
              <p className="text-slate-500">Customer: {status.customerName}</p>
              <p className="text-slate-600">Order ID: {status.orderId}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-slate-50 p-4 rounded-lg">
                <h4 className="font-semibold text-slate-900 mb-2">Order Details</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Amount:</span>
                    <span className="font-medium">PKR {status.amount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Tracking Number:</span>
                    <span className="font-medium">{status.trackingNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Courier:</span>
                    <span className="font-medium">{status.courier}</span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-lg">
                <h4 className="font-semibold text-slate-900 mb-2">Tracking Information</h4>
                <div className="space-y-2 text-sm">
                  <p className="text-slate-700">{status.fullReply.split('\n\n')[1] || 'Your order has been processed.'}</p>
                  {status.trackingLink && (
                    <a
                      href={status.trackingLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline block"
                    >
                      Track on Courier Website →
                    </a>
                  )}
                </div>
              </div>
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