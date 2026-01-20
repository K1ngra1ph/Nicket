import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Trophy, Ticket, PartyPopper, Copy, Check } from 'lucide-react';
import { FAQItem } from '../types';

interface Winner {
  _id: string;
  name: string;
  eventName: string;
  paymentReference: string;
}

const FAQ_DATA: FAQItem[] = [
  {
    question: "Is this platform legit?",
    answer: "Absolutely. Nicket is a fully transparent raffle platform. We provide real-time updates and public winners lists for every draw, verifiable by your Ticket ID."
  },
  {
    question: "How do I enter a raffle?",
    answer: "Simply choose a prize, select your numbers, and complete your purchase. Once a draw is executed by the admin, winners are instantly updated on the 'Check Ticket' page."
  },
  {
    question: "What happens if I don't win?",
    answer: "Nicket's promise is 'No Empty Hands'. While there's one main prize, many raffles feature secondary rewards or discount vouchers for future plays."
  },
  {
    question: "How do I get my prize?",
    answer: "Winners are contacted immediately via email. Physical prizes are delivered within Nigeria, while cash prizes are transferred within 24 hours."
  }
];

const FAQ: React.FC = () => {
  const [winners, setWinners] = useState<Winner[]>([]);
  const [loadingWinners, setLoadingWinners] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    const fetchWinners = async () => {
      try {
        const res = await fetch('https://nicket-backend.onrender.com/api/payments/recent-winners');
        if (res.ok) {
          const data = await res.json();
          setWinners(data);
        }
      } catch (err) {
        console.error("Winners Wall Error:", err);
      } finally {
        setLoadingWinners(false);
      }
    };
    fetchWinners();
  }, []);

  const handleCopy = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const formatWinnerName = (name: string) => {
    const parts = name.split(' ');
    if (parts.length > 1) return `${parts[0]} ${parts[1][0]}.`;
    return name;
  };

  return (
    <section className="max-w-6xl mx-auto px-6 py-32">
      
      {/* --- THE WINNERS WALL --- */}
      <div className="mb-24">
        <div className="flex items-center gap-3 mb-8">
          <div className="bg-brand-light dark:bg-brand-dark p-2 rounded-lg">
            <Trophy size={24} className="text-white dark:text-black" />
          </div>
          <h3 className="text-2xl font-black uppercase tracking-tighter italic">Recent Winners</h3>
        </div>

        {loadingWinners ? (
          <div className="h-32 flex items-center justify-center text-gray-400 animate-pulse font-bold uppercase tracking-widest text-xs">
            Fetching Luckiest Players...
          </div>
        ) : winners.length === 0 ? (
          <div className="bg-custom-card border border-custom p-10 rounded-[32px] text-center text-gray-500 italic">
            Next draw is happening soon. Could you be our next winner?
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {winners.map((winner) => (
              <div key={winner._id} className="bg-custom-card border border-custom p-6 rounded-[32px] shadow-sm hover:shadow-xl transition-all group relative overflow-hidden">
                <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-30 transition-opacity">
                    <PartyPopper size={60} />
                </div>
                <div className="flex items-start justify-between mb-4">
                    <div className="text-[10px] font-black uppercase tracking-widest text-brand-light dark:text-brand-dark bg-brand-light/10 dark:bg-brand-dark/10 px-2 py-1 rounded-md">Verified Winner</div>
                    
                    {/* COPIABLE TICKET ID */}
                    <button 
                      onClick={() => handleCopy(winner.paymentReference)}
                      className="flex items-center gap-1.5 text-[10px] font-mono text-gray-400 hover:text-brand-light dark:hover:text-brand-dark transition-colors bg-gray-50 dark:bg-black/20 px-2 py-1 rounded border border-custom"
                      title="Click to copy Ticket ID"
                    >
                      {winner.paymentReference.slice(0, 12)}...
                      {copiedId === winner.paymentReference ? <Check size={10} className="text-green-500" /> : <Copy size={10} />}
                    </button>
                </div>
                <h4 className="text-2xl font-bold mb-1">{formatWinnerName(winner.name)}</h4>
                <p className="text-gray-500 dark:text-gray-400 text-sm flex items-center gap-2">
                    <Ticket size={14} /> Won: <span className="font-bold text-gray-800 dark:text-white uppercase tracking-tighter">{winner.eventName}</span>
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* --- FAQ SECTION --- */}
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-albert font-bold mb-4">
            Frequently <span className="font-passion text-brand-light dark:text-brand-dark italic">Asked</span> Questions
          </h2>
          <p className="text-lg text-gray-500 dark:text-gray-400">Everything you need to know about playing and winning with Nicket.</p>
        </div>
        
        <div className="space-y-4">
          {FAQ_DATA.map((item, idx) => (
            <AccordionItem key={idx} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
};

const AccordionItem: React.FC<{ item: FAQItem }> = ({ item }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="mb-4">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-custom-card p-6 rounded-2xl flex items-center justify-between border border-custom hover:border-brand-light dark:hover:border-brand-dark transition-all text-left shadow-sm"
      >
        <span className="text-xl font-medium">{item.question}</span>
        {isOpen ? <ChevronUp className="text-brand-light dark:text-brand-dark" /> : <ChevronDown className="text-gray-500" />}
      </button>
      {isOpen && (
        <div className="bg-custom-card px-6 pb-6 rounded-b-2xl border-x border-b border-custom text-gray-500 dark:text-gray-400 leading-relaxed animate-in slide-in-from-top-2 duration-300">
          {item.answer}
        </div>
      )}
    </div>
  );
};

export default FAQ;