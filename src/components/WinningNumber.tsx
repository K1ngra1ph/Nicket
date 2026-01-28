import React, { useState } from 'react';
import { Search, CheckCircle2, Trophy, Loader2, Database, User, Layout, Hash, Ticket, XCircle, Hourglass } from 'lucide-react';

const WinningNumber: React.FC = () => {
  const [ticketId, setTicketId] = useState('');
  const [status, setStatus] = useState<'idle' | 'won' | 'lost' | 'not_found' | 'searching' | 'pending' | 'waiting'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [ticketData, setTicketData] = useState<any>(null);

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

      if (currentStatus === 'paid' || currentStatus === 'successful') {
        setTicketData(data);
        
        const metadata = data.metadata || data.metaData || {};
        const isWinner = metadata.winner === true || metadata.winner === "true";
        const isDrawn = data.eventDetails?.drawStatus === 'drawn';

        if (isWinner) {
          setStatus('won');
        } 
        else if (!isDrawn) {
          setStatus('waiting');
        } 
        else {
          setStatus('lost');
        }
        
      } else {
        setStatus('pending');
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
        <h1 className="text-5xl md:text-7xl font-albert font-black mb-8 uppercase tracking-tighter">
          Check Your <span className="text-brand-light dark:text-brand-dark italic">Ticket</span>
        </h1>
        <p className="text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
          Enter your Ticket ID to check your winning status.
        </p>
      </div>

      <div className="w-full max-w-2xl bg-custom-card p-8 md:p-12 rounded-[40px] border border-custom shadow-2xl relative overflow-hidden">
        <div className="absolute -top-24 -left-24 w-64 h-64 bg-brand-light/10 dark:bg-brand-dark/10 blur-[100px] rounded-full"></div>
        
        <form onSubmit={handleCheck} className="space-y-8 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-4 text-gray-400">
              <Database size={14} />
              <label className="block text-xs font-black uppercase tracking-[0.2em]">Ticket ID</label>
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
              <div className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-brand-light transition-colors">
                {status === 'searching' ? <Loader2 size={24} className="animate-spin" /> : <Search size={24} />}
              </div>
            </div>
          </div>

          <button 
            type="submit"
            disabled={status === 'searching'}
            className="w-full bg-custom-btn py-5 rounded-2xl text-xl font-bold hover:scale-[1.01] active:scale-[0.98] transition-all disabled:opacity-50 shadow-xl flex items-center justify-center gap-3 uppercase tracking-widest"
          >
            {status === 'searching' ? 'Verifying...' : 'Verify Entry'}
          </button>
        </form>

        {/* RECEIPT RENDERING */}
        {ticketData && (status === 'won' || status === 'lost' || status === 'waiting') && (
          <div className="mt-12 animate-in fade-in zoom-in duration-500">
            
            {/* Visual Status Banner */}
            <div className={`mb-8 p-8 rounded-3xl text-center border-2 ${
              status === 'won' 
              ? 'bg-green-500/10 border-green-500 text-green-500' 
              : status === 'waiting'
              ? 'bg-amber-500/10 border-amber-500/30 text-amber-500'
              : 'bg-rose-500/10 border-rose-500/30 text-rose-500'
            }`}>
              {status === 'won' && (
                <>
                  <Trophy className="mx-auto mb-4 animate-bounce" size={56} />
                  <h3 className="text-3xl font-black uppercase italic tracking-tighter">You are a Winner!🏆</h3>
                  <p className="text-xs font-bold uppercase tracking-widest opacity-80 mt-1">Check your email for claim instructions</p>
                </>
              )}

              {status === 'waiting' && (
                <>
                  <Hourglass className="mx-auto mb-4 animate-pulse" size={56} />
                  <h3 className="text-3xl font-black uppercase italic tracking-tighter text-amber-600 dark:text-amber-400">Awaiting Draw</h3>
                  <p className="text-xs font-bold uppercase tracking-widest opacity-80 mt-1 text-gray-500">Ticket Active: You haven't lost yet. Wait for results!</p>
                </>
              )}

              {status === 'lost' && (
                <>
                  <XCircle className="mx-auto mb-4" size={56} />
                  <h3 className="text-3xl font-black uppercase italic tracking-tighter">No Win Today</h3>
                  <p className="text-xs font-bold uppercase tracking-widest opacity-80 mt-1">Unfortunately, Better luck next time!</p>
                </>
              )}
            </div>

            <div className="bg-gray-50 dark:bg-black/20 border-2 border-dashed border-custom p-8 rounded-[32px] relative overflow-hidden">
              <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-custom-card rounded-full border-r-2 border-custom"></div>
              <div className="absolute -right-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-custom-card rounded-full border-l-2 border-custom"></div>
              
              <h4 className="text-center font-black uppercase tracking-[0.3em] text-gray-400 text-[10px] mb-8 text-wrap overflow-hidden">My NICKET</h4>
              
              <div className="space-y-6 relative z-10">
                <div className="flex justify-between items-center border-b border-custom/10 pb-3">
                    <span className="flex items-center gap-2 text-gray-500 text-xs font-bold uppercase"><User size={14}/> Player</span>
                    <span className="font-bold text-white truncate max-w-[150px]">{ticketData.name || "Nicket User"}</span>
                </div>

                <div className="flex justify-between items-center border-b border-custom/10 pb-3">
                    <span className="flex items-center gap-2 text-gray-500 text-xs font-bold uppercase"><Ticket size={14}/> Reference</span>
                    <span className="font-mono font-bold text-brand-light dark:text-brand-dark text-[11px] sm:text-sm">{ticketData.paymentReference}</span>
                </div>

                <div className="flex justify-between items-center border-b border-custom/10 pb-3">
                    <span className="flex items-center gap-2 text-gray-500 text-xs font-bold uppercase shrink-0"><Layout size={14}/> Prize</span>
                    <span className="font-bold text-white truncate max-w-[180px]">{ticketData.eventName || "Entry"}</span>
                </div>

                {/* DRAW RESULT ROW */}
                <div className="flex justify-between items-center border-b border-custom/10 pb-3">
                    <span className="flex items-center gap-2 text-gray-500 text-xs font-bold uppercase"><Trophy size={14}/> Final Status</span>
                    <span className={`font-black uppercase tracking-widest text-lg ${
                        status === 'won' ? 'text-green-500' : 
                        status === 'waiting' ? 'text-amber-500' : 
                        'text-rose-500'
                    }`}>
                        {status === 'won' ? "WON" : status === 'waiting' ? "WAITING" : "LOSE"}
                    </span>
                </div>

                <div className="pt-2">
                  <span className="flex items-center gap-2 text-gray-400 text-xs font-bold uppercase mb-4"><Hash size={14}/> Lucky Number(s)</span>
                  <div className="flex flex-wrap gap-2">
                    {ticketData.selectedNumbers?.map((num: number, i: number) => (
                      <span key={i} className="bg-custom-btn px-4 py-2 rounded-xl text-lg font-black shadow-lg min-w-[45px] text-center border-none">
                        {num}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WinningNumber;
