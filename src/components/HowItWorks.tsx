import React from 'react';
import { Smartphone, Ticket, Zap, Gift } from 'lucide-react';
import { TabType } from '../App';

interface HowItWorksProps {
  onNavigate: (tab: TabType) => void;
}

const STEPS = [
  {
    icon: <Smartphone size={40} className="text-brand-light dark:text-brand-dark" />,
    title: "Select your prize",
    desc: "Browse our collection of active events and choose the prize you want to win."
  },
  {
    icon: <Ticket size={40} className="text-brand-light dark:text-brand-dark" />,
    title: "Pick your numbers",
    desc: "Select your lucky number on the game board. Each entry brings you closer to the win."
  },
  {
    icon: <Zap size={40} className="text-brand-light dark:text-brand-dark" />,
    title: "Wait for the draw",
    desc: "Once the spots are filled or the timer ends, our system selects our winners transparently."
  },
  {
    icon: <Gift size={40} className="text-brand-light dark:text-brand-dark" />,
    title: "Instant Notification",
    desc: "Winners are notified immediately via email and phone. Prizes are dispatched within 24 hours."
  }
];

const HowItWorks: React.FC<HowItWorksProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-7xl mx-auto px-6 py-32 min-h-screen">
      <div className="text-center mb-24">
        <h1 className="text-5xl md:text-7xl font-albert font-black mb-8 italic uppercase">
          HOW IT <span className="text-brand-light dark:text-brand-dark">WORKS</span>
        </h1>
        <p className="text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
          Transparency and excitement combined. We've simplified gaming so you can focus on winning with <span className="font-bold">Nicket</span>.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        {STEPS.map((step, idx) => (
          <div key={idx} className="relative p-8 bg-custom-card rounded-[40px] border border-custom flex flex-col items-center text-center group hover:border-brand-light dark:hover:border-brand-dark transition-all shadow-lg">
            <div className="mb-8 p-6 bg-gray-50 dark:bg-[#181818] rounded-full shadow-inner transition-transform group-hover:scale-110">
              {step.icon}
            </div>
            <h3 className="text-2xl font-bold mb-4 font-albert">{step.title}</h3>
            <p className="text-gray-500 dark:text-gray-400 leading-relaxed font-light">{step.desc}</p>
            
            <div className="absolute top-8 right-8 text-6xl font-black text-gray-100 dark:text-white/5 group-hover:text-brand-light/10 dark:group-hover:text-brand-dark/10 select-none">
              0{idx + 1}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-32 p-12 bg-custom-btn rounded-[40px] text-center shadow-2xl shadow-brand-light/20">
        <h2 className="text-3xl md:text-5xl font-albert font-bold mb-8 text-white">Ready to change your luck?</h2>
        {/* UPDATED: Uses onNavigate instead of href */}
        <button 
          onClick={() => onNavigate('register')}
          className="inline-block bg-white dark:bg-black text-black dark:text-white px-12 py-5 rounded-full text-xl font-bold hover:scale-105 transition-all shadow-xl"
        >
          Play Now
        </button>
      </div>
    </div>
  );
};

export default HowItWorks;