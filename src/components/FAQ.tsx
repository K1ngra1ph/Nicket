import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Trophy, Ticket, PartyPopper, Copy, Check, Info } from 'lucide-react';
import { Winner } from '../App';

interface FAQProps {
  winners: Winner[]; 
}

const FAQ: React.FC<FAQProps> = ({ winners }) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const FAQ_DATA = [
    {
      question: "Is this platform legit?",
      answer: "Absolutely. Nicket is a fully transparent raffle platform. Every ticket ID is unique and can be verified against bank-verified payments on our result checker."
    },
    {
      question: "How do I enter a raffle?",
      answer: "Choose your preferred prize from the grid, pick your lucky numbers (you can even pick the same number multiple times!), and complete the checkout via Monnify. You'll receive your ID instantly."
    },
    {
      question: "What can I win?",
      answer: "Our catalog includes gadgets, luxury accessories, cash prizes, and high-value vouchers. Check our prizes section for currently active entries."
    },
    {
      question: "What happens if I don't win?",
      answer: "At Nicket, every play matters. While there's one top prize, most draws include 'Runner-Up' rewards such as discount codes for your next play."
    },
    {
      question: "How do I get my prize?",
      answer: "Winners are notified automatically via email. For cash prizes, we pay into your verified account within 24hrs. Physical prizes are delivered to your location across Nigeria."
    }
  ];

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
      {/* WINNERS WALL */}
      <div className="mb-24">
        <div className="flex items-center gap-3 mb-8">
          <div className="bg-brand-light dark:bg-brand-dark p-2 rounded-lg">
            <Trophy size={24} className="text-white dark:text-black" />
          </div>
          <h3 className="text-2xl font-black uppercase tracking-tighter italic">Winners Wall</h3>
        </div>

        {winners.length === 0 ? (
          <div className="bg-custom-card border border-custom p-10 rounded-[40px] text-center text-gray-500 italic">
            Check back after the next scheduled draw!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {winners.map((winner) => (
              <div key={winner._id} className="bg-custom-card border border-custom p-6 rounded-[35px] shadow-sm hover:shadow-xl transition-all relative overflow-hidden group">
                <div className="absolute -top-10 -right-10 p-3 opacity-5 group-hover:opacity-10 transition-opacity"><PartyPopper size={120} /></div>
                <div className="flex items-start justify-between mb-4">
                    <span className="text-[10px] font-black uppercase text-green-500 bg-green-500/10 px-2 py-1 rounded-md tracking-widest">Verified Win</span>
                    <button onClick={() => handleCopy(winner.paymentReference)} className="flex items-center gap-1 text-[9px] font-mono text-gray-400 bg-gray-100 dark:bg-white/5 p-1 px-2 rounded border border-custom transition-all">
                      {winner.paymentReference.slice(0, 10)}.. {copiedId === winner.paymentReference ? <Check size={10}/> : <Copy size={10}/>}
                    </button>
                </div>
                <h4 className="text-xl font-bold text-gray-900 dark:text-white">{formatWinnerName(winner.name)}</h4>
                <p className="text-gray-400 text-xs flex items-center gap-2 mt-1">
                    <Ticket size={12} /> Prize: <span className="font-bold text-gray-700 dark:text-white uppercase truncate">{winner.eventName}</span>
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* FULL FAQ SECTION */}
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 justify-center mb-12">
            <Info size={32} className="text-brand-light" />
            <h2 className="text-5xl font-albert font-black italic tracking-tighter uppercase">Support</h2>
        </div>
        <div className="space-y-4">
          {FAQ_DATA.map((item, idx) => (
            <AccordionItem key={idx} question={item.question} answer={item.answer} />
          ))}
        </div>
      </div>
    </section>
  );
};

const AccordionItem: React.FC<{ question: string, answer: string }> = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="mb-4">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-custom-card p-6 rounded-[28px] flex items-center justify-between border border-custom transition-all"
      >
        <span className="text-lg font-bold">{question}</span>
        {isOpen ? <ChevronUp size={20}/> : <ChevronDown size={20}/>}
      </button>
      {isOpen && <div className="p-8 bg-gray-50 dark:bg-black/20 rounded-b-[28px] mt-[-20px] pt-12 border-x border-b border-custom text-gray-500 dark:text-gray-400 leading-relaxed text-sm animate-in slide-in-from-top-2">{answer}</div>}
    </div>
  );
};

export default FAQ;
