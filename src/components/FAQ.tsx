import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Trophy, Ticket, PartyPopper, Copy, Check } from 'lucide-react';
import { FAQItem } from '../types';
import { Winner } from '../App';

interface FAQProps {
  winners: Winner[];
}

const FAQ: React.FC<FAQProps> = ({ winners }) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

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
      <div className="mb-24">
        <div className="flex items-center gap-3 mb-8">
          <div className="bg-brand-light dark:bg-brand-dark p-2 rounded-lg">
            <Trophy size={24} className="text-white dark:text-black" />
          </div>
          <h3 className="text-2xl font-black uppercase tracking-tighter italic">Winners Hall of Fame</h3>
        </div>

        {winners.length === 0 ? (
          <div className="bg-custom-card border border-custom p-10 rounded-[32px] text-center text-gray-500 italic opacity-50">
            Awaiting Draw Results...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {winners.map((winner) => (
              <div key={winner._id} className="bg-custom-card border border-custom p-6 rounded-[32px] shadow-sm hover:shadow-xl transition-all group relative overflow-hidden">
                <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-30 transition-opacity"><PartyPopper size={60} /></div>
                <div className="flex items-start justify-between mb-4">
                    <div className="text-[10px] font-black uppercase tracking-widest text-brand-light dark:text-brand-dark bg-brand-light/10 dark:bg-brand-dark/10 px-2 py-1 rounded-md">Verified</div>
                    <button 
                      onClick={() => handleCopy(winner.paymentReference)}
                      className="flex items-center gap-1.5 text-[10px] font-mono text-gray-400 hover:text-brand-light transition-colors bg-gray-50 dark:bg-black/20 px-2 py-1 rounded border border-custom"
                    >
                      {winner.paymentReference.slice(0, 10)}...
                      {copiedId === winner.paymentReference ? <Check size={10} className="text-green-500" /> : <Copy size={10} />}
                    </button>
                </div>
                <h4 className="text-2xl font-bold mb-1">{formatWinnerName(winner.name)}</h4>
                <p className="text-gray-500 text-sm flex items-center gap-2">
                    <Ticket size={14} /> Won: <span className="font-bold text-gray-800 dark:text-white uppercase text-xs">{winner.eventName}</span>
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      <FAQSection />
    </section>
  );
};

const FAQSection: React.FC = () => {
    const FAQ_DATA: FAQItem[] = [
        { question: "Is this platform legit?", answer: "Absolutely. Nicket provides fully transparent, bank-verified raffle draws. Every ticket ID is publically verifiable on our result checker." },
        { question: "How do I enter?", answer: "Pick your prize, select your lucky numbers, and complete checkout. We'll send you an official Ticket ID immediately." },
        { question: "How do winners get notified?", answer: "We contact winners directly via email. Physical prizes are shipped across Nigeria, cash is transferred within 24hrs." }
    ];
    return (
        <div className="max-w-4xl mx-auto mt-20">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-albert font-bold mb-4 uppercase italic tracking-tighter">Support</h2>
          </div>
          <div className="space-y-4">
            {FAQ_DATA.map((item, idx) => <AccordionItem key={idx} item={item} />)}
          </div>
        </div>
    );
};

const AccordionItem: React.FC<{ item: FAQItem }> = ({ item }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="mb-4">
      <button onClick={() => setIsOpen(!isOpen)} className="w-full bg-custom-card p-6 rounded-2xl flex items-center justify-between border border-custom shadow-sm text-left transition-all">
        <span className="text-lg font-bold">{item.question}</span>
        {isOpen ? <ChevronUp size={20}/> : <ChevronDown size={20}/>}
      </button>
      {isOpen && <div className="bg-custom-card px-6 pb-6 rounded-b-2xl border-x border-b border-custom text-gray-500 dark:text-gray-400 leading-relaxed text-sm animate-fade-in">{item.answer}</div>}
    </div>
  );
};

export default FAQ;
