import React, { useState } from 'react';
import { Search, CheckCircle2, AlertCircle, Loader2, Database } from 'lucide-react';
import { API_BASE_URL } from '../config';

const WinningNumber: React.FC = () => {
  const [ticketId, setTicketId] = useState('');
  const [status, setStatus] = useState<'idle' | 'won' | 'lost' | 'not_found' | 'searching' | 'pending'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const verifyWithBackend = async (ref: string) => {
    setStatus('searching');
    setErrorMessage('');
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/payments/verify/${ref}`);
      const data = await response.json();

      if (!response.ok || !data.success) {
        setStatus('not_found');
        setErrorMessage(data.message || "Record not found");
        return;
      }
      const isPaid = data.paymentStatus === 'PAID' || data.paymentStatus === 'SUCCESSFUL';

      if (isPaid) {
        if (data.metaData?.winner === true || data.metaData?.winner === "true") {
          setStatus('won');
        } else {
          setStatus('lost');
        }
      } 
      else if (data.paymentStatus === 'PENDING') {
        setStatus('pending');
      } 
      else {
        setStatus('not_found');
        setErrorMessage("Payment failed or invalid.");
      }

    } catch (error) {
      console.error("Verification error:", error);
      setStatus('not_found');
      setErrorMessage("Connection error. Please try again.");
    }
  };

  const handleCheck = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketId) return;
    verifyWithBackend(ticketId.trim());
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-32 min-h-[80vh] flex flex-col items-center">
      <div className="text-center mb-16">
        <h1 className="text-5xl md:text-7xl font-albert font-black mb-8">
          CHECK YOUR <span className="text-brand-light dark:text-brand-dark italic">TICKET HERE</span>
        </h1>
        <p className="text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
          Enter your Ticket ID (e.g. NICKET-123...) to check if your ticket is valid and if you've won.
        </p>
      </div>

      <div className="w-full max-w-2xl bg-custom-card p-8 md:p-12 rounded-[40px] border border-custom shadow-2xl mb-20 relative overflow-hidden">
        <div className="absolute -top-24 -left-24 w-64 h-64 bg-brand-light/10 dark:bg-brand-dark/10 blur-[100px] rounded-full"></div>
        
        <form onSubmit={handleCheck} className="space-y-8 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Database size={14} className="text-gray-400" />
              <label className="block text-xs font-black uppercase tracking-[0.2em] text-gray-400">
                Ticket ID
              </label>
            </div>
            <div className="relative group">
              <input 
                type="text" 
                placeholder="e.g. NICKET-1704..."
                value={ticketId}
                onChange={(e) => setTicketId(e.target.value)}
                className="w-full bg-gray-50 dark:bg-black/40 border-2 border-custom rounded-2xl px-6 py-5 text-xl font-bold focus:border-brand-light dark:focus:border-brand-dark outline-none transition-all placeholder:text-gray-400"
                required
              />
              <div className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-brand-light dark:group-focus-within:text-brand-dark transition-colors">
                {status === 'searching' ? <Loader2 size={24} className="animate-spin" /> : <Search size={24} />}
              </div>
            </div>
          </div>

          <button 
            type="submit"
            disabled={status === 'searching'}
            className="w-full bg-custom-btn py-5 rounded-2xl text-xl font-bold hover:scale-[1.01] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-brand-light/20 dark:shadow-brand-dark/10 flex items-center justify-center gap-3"
          >
            {status === 'searching' ? 'Checking Database...' : 'Verify Ticket'}
          </button>
        </form>

        {/* Results Display */}
        <div className="mt-12 overflow-hidden transition-all duration-500 min-h-[160px] flex items-center justify-center">
          
          {/* WINNER STATE */}
          {status === 'won' && (
            <div className="w-full relative p-8 rounded-[32px] text-center animate-in zoom-in slide-in-from-bottom-4 duration-500 border border-white/20 dark:border-white/10 shadow-2xl backdrop-blur-2xl bg-green-500/20 dark:bg-green-500/10">
              <div className="relative z-10">
                <div className="flex justify-center mb-6">
                  <div className="p-4 bg-green-500 rounded-full shadow-lg shadow-green-500/50 scale-110">
                    <CheckCircle2 size={40} className="text-white" />
                  </div>
                </div>
                <h3 className="text-3xl font-black text-green-600 dark:text-green-400 mb-2">YOU ARE A WINNER!</h3>
                <p className="text-gray-600 dark:text-gray-300 font-medium mb-6">Congratulations! This ticket matched a winning number.</p>
                <div className="p-4 bg-white/30 dark:bg-black/30 rounded-2xl border border-white/20 inline-block px-8 font-passion text-3xl tracking-wider">
                  PRIZE AWARDED CHECK YOUR EMAIL!
                </div>
              </div>
            </div>
          )}

          {/* LOST / VALID TICKET STATE */}
          {status === 'lost' && (
            <div className="w-full relative p-8 rounded-[32px] text-center animate-in zoom-in slide-in-from-bottom-4 duration-500 border border-white/20 dark:border-white/10 shadow-2xl backdrop-blur-2xl bg-gray-500/10 dark:bg-white/5">
              <div className="relative z-10">
                <div className="flex justify-center mb-6">
                  <div className="p-4 bg-blue-500 rounded-full">
                    <CheckCircle2 size={40} className="text-white" />
                  </div>
                </div>
                <h3 className="text-3xl font-black text-blue-500 dark:text-blue-400 mb-2">TICKET IS VALID</h3>
                <p className="text-gray-500 dark:text-gray-400">Your entry is confirmed active! However, it has not been marked as a winner yet. Stay tuned for the draw!</p>
              </div>
            </div>
          )}
          
          {/* PENDING STATE */}
          {status === 'pending' && (
            <div className="w-full relative p-8 rounded-[32px] text-center animate-in zoom-in slide-in-from-bottom-4 duration-500 border border-brand-light/20 shadow-2xl backdrop-blur-2xl bg-amber-500/10">
              <div className="relative z-10">
                <div className="flex justify-center mb-6">
                  <div className="p-4 bg-amber-500 rounded-full">
                    <Loader2 size={40} className="text-white animate-spin" />
                  </div>
                </div>
                <h3 className="text-2xl font-black text-amber-500 mb-2">PAYMENT PENDING</h3>
                <p className="text-gray-600 dark:text-gray-300">We found the reference, but the payment is still processing. Please wait a moment.</p>
              </div>
            </div>
          )}

          {/* NOT FOUND STATE */}
          {status === 'not_found' && (
            <div className="w-full relative p-8 rounded-[32px] text-center animate-in zoom-in slide-in-from-bottom-4 duration-500 border border-brand-light/20 shadow-2xl backdrop-blur-2xl bg-brand-light/10">
              <div className="relative z-10">
                <div className="flex justify-center mb-6">
                  <div className="p-4 bg-brand-light rounded-full">
                    <Search size={40} className="text-white" />
                  </div>
                </div>
                <h3 className="text-2xl font-black text-brand-light dark:text-brand-dark mb-2">NOT FOUND</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {errorMessage || "We couldn't find a payment with this Reference ID. Please check and try again."}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="mt-16 flex flex-wrap justify-center gap-12 text-center">
        <div className="flex flex-col items-center">
          <span className="text-4xl font-black text-brand-light dark:text-brand-dark">100%</span>
          <span className="text-sm font-bold text-gray-500 uppercase tracking-widest">Verifiable Draws</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-4xl font-black text-brand-light dark:text-brand-dark">24/7</span>
          <span className="text-sm font-bold text-gray-500 uppercase tracking-widest">Auto Verification</span>
        </div>
      </div>
    </div>
  );
};

export default WinningNumber;