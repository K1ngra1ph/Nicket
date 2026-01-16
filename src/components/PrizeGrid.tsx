import React from 'react';
import { TabType, EventOption } from '../App';

interface PrizeGridProps {
  onNavigate: (tab: TabType) => void;
  events: EventOption[];
}

const PrizeCard: React.FC<{ prize: any, onNavigate: (tab: TabType) => void }> = ({ prize, onNavigate }) => {
  const progress = prize.active ? 65 : 100; 

  return (
    <div className="group bg-custom-card rounded-[32px] overflow-hidden border border-custom hover:border-brand-light dark:hover:border-brand-dark transition-all duration-300 flex flex-col h-full shadow-lg">
      <div className="relative aspect-square overflow-hidden bg-gray-100 dark:bg-gray-800">
        <img src={prize.image} alt={prize.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
        <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full text-white text-xs font-bold uppercase tracking-widest">
          {prize.category}
        </div>
      </div>
      
      <div className="p-8 flex flex-col flex-grow">
        <h3 className="text-2xl font-albert font-bold mb-2 group-hover:text-brand-light dark:group-hover:text-brand-dark transition-colors">{prize.title}</h3>
        <p className="text-gray-500 dark:text-gray-400 mb-6">Entry: <span className="text-current font-bold">₦{prize.entryFee.toLocaleString()}</span></p>

        <div className="mt-auto">
          <div className="flex justify-end text-sm mb-2"><span className="text-brand-light dark:text-brand-dark font-black tracking-tighter text-lg">{prize.active ? "OPEN" : "CLOSED"}</span></div>
          <div className="w-full h-2 bg-gray-200 dark:bg-white/10 rounded-full overflow-hidden mb-8">
            <div className={`h-full rounded-full transition-all duration-1000 ${!prize.active ? 'bg-gray-400' : 'bg-brand-light dark:bg-brand-dark'}`} style={{ width: `${progress}%` }}></div>
          </div>

          {!prize.active ? (
            <button disabled className="w-full py-4 rounded-2xl bg-gray-200 dark:bg-white/5 text-gray-500 dark:text-gray-500 font-bold cursor-not-allowed border border-custom">Draw Ended</button>
          ) : (
            <button 
              onClick={() => {
                localStorage.setItem("preSelectedEventId", prize.id);
                onNavigate('register');
              }}
              className="block w-full py-4 rounded-2xl bg-custom-btn font-bold transition-all transform active:scale-95 shadow-lg text-center hover:opacity-90 uppercase tracking-wider"
            >
              Play2Win
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const PrizeGrid: React.FC<PrizeGridProps> = ({ onNavigate, events }) => {
  const prizes = events.map((event) => ({
    id: event._id,
    title: event.name,
    category: event.location || "Online",
    image: event.image || `https://picsum.photos/seed/${event._id}/600/600`, 
    entryFee: event.price || 1000,
    active: event.active
  }));

  return (
    <section className="max-w-7xl mx-auto px-6 py-32">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
        <div>
          <h2 className="text-5xl font-albert font-bold mb-4 italic uppercase tracking-tighter">Prizes To Be Won</h2>
          <p className="text-xl text-gray-500 dark:text-gray-400">Exclusive items and experiences just a play away.</p>
        </div>
        
        <div className="flex gap-4">
          <button className="px-8 py-3 rounded-full bg-brand-light dark:bg-brand-dark text-white dark:text-black font-bold text-sm shadow-md">
            {prizes.length} Events Available
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {prizes.map(prize => <PrizeCard key={prize.id} prize={prize} onNavigate={onNavigate} />)}
      </div>
    </section>
  );
};

export default PrizeGrid;