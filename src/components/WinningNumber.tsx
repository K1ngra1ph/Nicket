import React, { useState } from 'react';
import { Search, CheckCircle2, Trophy, Loader2, Database, User, Tag, Layout, Hash, Ticket } from 'lucide-react';

const WinningNumber: React.FC = () => {
  const [ticketId, setTicketId] = useState('');
  const [status, setStatus] = useState<'idle' | 'won' | 'lost' | 'not_found' | 'searching' | 'pending'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [ticketData, setTicketData] = useState<any>(null); // Stores the receipt info

  const verifyWithBackend = async (ref: string) => {
    setStatus('searching');
    setErrorMessage('');
    setTicketData(null);
    
    try {
      const response = await fetch(`https://nicket-backend.onrender.com/api/payments/verify/${ref}`);
      const data = await response.json();

      if (!response.ok) {
        setStatus('not_found');
        setErrorMessage(data.message || "Ticket not found in our database");
        return;
      }

      const currentStatus = (data.status || data.paymentStatus || "").toLowerCase();
      const isPaid = currentStatus === 'paid' || currentStatus === 'successful';

      if (isPaid) {
        setTicketData(data); // Save data for the receipt
        const metadata = data.metadata || data.metaData || {};
        const isWinner = metadata.winner === true || metadata.winner === "true";

        if (isWinner) {
          setStatus('won');
        } else {
          setStatus('lost');
        }
      } 
      else if (currentStatus === 'pending') {
        setStatus('pending');
      } 
      else {
        setStatus('not_found');
        setErrorMessage(`Entry is invalid. Payment status: ${currentStatus}`);
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
          CHECK YOUR <span className="text-brand-light dark:text-brand-dark italic uppercase">Ticket</span>
        </h1>
        <p className="text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
          Enter your Ticket ID to generate your digital receipt and check winning status.
        </p>
      </div>

      <div className="w-full max-w-2xl bg-custom-card p-8 md:p-12 rounded-[40px] border border-custom shadow-2xl mb-20 relative overflow-hidden">
        <form onSubmit={handleCheck} className="space-y-8 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-4 text-gray-400">
              <Database size={14} />
              <label className="block text-xs font-black uppercase tracking-[0.2em]">Ticket ID</label>
            </div>
            <div className="relative">
              <input 
                type="text" 
                placeholder="e.g. NICKET-123456"
                value={ticketId}
                onChange={(e) => setTicketId(e.target.value)}
                className="w-full bg-gray-50 dark:bg-black/40 border-2 border-custom rounded-2xl px-6 py-5 text-xl font-bold focus:border-brand-light dark:focus:border-brand-dark outline-none transition-all"
                required
              />
              <div className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400">
                {status === 'searching' ? <Loader2 size={24} className="animate-spin" /> : <Search size={24} />}
              </div>
            </div>
          </div>

          <button 
            type="submit"
            disabled={status === 'searching'}
            className="w-full bg-custom-btn py-5 rounded-2xl text-xl font-bold hover:scale-[1.01] transition-all disabled:opacity-50"
          >
            {status === 'searching' ? 'Verifying...' : 'Verify & Generate Receipt'}
          </button>
        </form>

        {/* RESULTS & RECEIPT */}
        <div className="mt-12">
          {(status === 'won' || status === 'lost') && ticketData && (
            <div className="animate-in fade-in zoom-in duration-500">
              {/* Outcome Header */}
              <div className={`mb-8 p-6 rounded-3xl text-center border-2 ${
                status === 'won' 
                ? 'bg-green-500/10 border-green-500/50 text-green-600' 
                : 'bg-blue-500/10 border-blue-500/50 text-blue-600'
              }`}>
                {status === 'won' ? (
                  <>
                    <Trophy className="mx-auto mb-2" size={48} />
                    <h3 className="text-3xl font-black uppercase italic">Winner!</h3>
                    <p className="font-bold opacity-80 uppercase tracking-widest text-xs">Prize awarded - check your email</p>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="mx-auto mb-2" size={48} />
                    <h3 className="text-3xl font-black uppercase italic">Ticket Valid</h3>
                    <p className="font-bold opacity-80 uppercase tracking-widest text-xs">Good luck in the next draw!</p>
                  </>
                )}
              </div>

              {/* Digital Receipt Stub */}
              <div className="bg-gray-50 dark:bg-black/20 border-2 border-dashed border-custom p-8 rounded-3xl relative">
                <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-custom-card rounded-full border-r border-custom"></div>
                <div className="absolute -right-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-custom-card rounded-full border-l border-custom"></div>
                
                <h4 className="text-center font-black uppercase tracking-widest text-gray-400 text-xs mb-8">Official Play Receipt</h4>
                
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-gray-500 text-sm font-bold uppercase"><User size={16}/> Player</div>
                    <div className="font-bold text-right">{ticketData.name}</div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-gray-500 text-sm font-bold uppercase"><Ticket size={16}/> Reference</div>
                    <div className="font-mono font-bold text-brand-light dark:text-brand-dark">{ticketData.paymentReference}</div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-gray-500 text-sm font-bold uppercase"><Layout size={16}/> Event</div>
                    <div className="font-bold max-w-[200px] text-right truncate">{ticketData.eventName || "Event Entry"}</div>
                  </div>

                  <div className="pt-6 border-t border-custom">
                    <div className="flex items-center gap-2 text-gray-500 text-sm font-bold uppercase mb-4"><Hash size={16}/> Selected Numbers</div>
                    <div className="flex flex-wrap gap-2">
                      {ticketData.selectedNumbers?.map((num: number, i: number) => (
                        <span key={i} className="bg-custom-btn px-4 py-2 rounded-xl text-lg font-black min-w-[45px] text-center shadow-lg">
                          {num}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Pending State */}
          {status === 'pending' && (
            <div className="text-center p-8 bg-amber-500/10 border border-amber-500/20 rounded-3xl">
              <Loader2 className="mx-auto mb-4 animate-spin text-amber-500" size={40} />
              <h3 className="text-xl font-bold text-amber-500">PAYMENT PENDING</h3>
              <p className="text-gray-500 text-sm">We've found the record, but the bank is still processing. Try again in 2 minutes.</p>
            </div>
          )}

          {/* Error State */}
          {status === 'not_found' && (
            <div className="text-center p-8 bg-brand-light/10 border border-brand-light/20 rounded-3xl">
              <Search className="mx-auto mb-4 text-brand-light" size={40} />
              <h3 className="text-xl font-bold text-brand-light uppercase">No Record Found</h3>
              <p className="text-gray-500 text-sm">{errorMessage}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WinningNumber;