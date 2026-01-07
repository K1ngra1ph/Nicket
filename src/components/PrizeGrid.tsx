import React, { useEffect, useState } from 'react';
import { TabType } from '../App';

interface PrizeGridProps {
  onNavigate: (tab: TabType) => void;
}

interface PrizeCardProps {
  prize: Prize;
  onNavigate: (tab: TabType) => void;
}

interface BackendEvent {
  _id: string;
  name: string;
  location: string;
  price: number;
  active: boolean;
  currency: string;
  image?: string;
}

interface Prize {
  id: string;
  title: string;
  category: string;
  image: string;
  entryFee: number;
  active: boolean;
}

const PrizeCard: React.FC<PrizeCardProps> = ({ prize, onNavigate }) => {
  const progress = prize.active ? 65 : 100; 

  return (
    <div className="group bg-custom-card rounded-[32px] overflow-hidden border border-custom hover:border-brand-light dark:hover:border-brand-dark transition-all duration-300 flex flex-col h-full shadow-lg">
      <div className="relative aspect-square overflow-hidden bg-gray-100 dark:bg-gray-800">
        <img 
          src={prize.image} 
          alt={prize.title} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/600x600?text=No+Image';
          }}
        />
        <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full text-white text-xs font-bold">
          {prize.category}
        </div>
      </div>
      
      <div className="p-8 flex flex-col flex-grow">
        <h3 className="text-2xl font-albert font-bold mb-2 group-hover:text-brand-light dark:group-hover:text-brand-dark transition-colors">
          {prize.title}
        </h3>
        <p className="text-gray-500 dark:text-gray-400 mb-6">
          Entry: <span className="text-current font-bold">₦{prize.entryFee.toLocaleString()}</span>
        </p>

        <div className="mt-auto">
          <div className="flex justify-end text-sm mb-2">
            <span className="text-brand-light dark:text-brand-dark font-black tracking-tighter text-lg">
              {prize.active ? "OPEN" : "CLOSED"}
            </span>
          </div>
          
          <div className="w-full h-2 bg-gray-200 dark:bg-white/10 rounded-full overflow-hidden mb-8">
            <div 
              className={`h-full rounded-full transition-all duration-1000 ${!prize.active ? 'bg-gray-400' : 'bg-brand-light dark:bg-brand-dark'}`}
              style={{ width: `${progress}%` }}
            ></div>
          </div>

          {!prize.active ? (
            <button 
              disabled
              className="w-full py-4 rounded-2xl bg-gray-200 dark:bg-white/5 text-gray-500 dark:text-gray-500 font-bold cursor-not-allowed border border-custom"
            >
              Draw Ended
            </button>
          ) : (
            <button 
              onClick={() => onNavigate('register')}
              className="block w-full py-4 rounded-2xl bg-custom-btn font-bold transition-all transform active:scale-95 shadow-lg text-center hover:opacity-90"
            >
              Play2Win
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const PrizeGrid: React.FC<PrizeGridProps> = ({ onNavigate }) => {
  const [prizes, setPrizes] = useState<Prize[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch("/events"); 
        
        if (!res.ok) throw new Error("Failed to fetch");
        
        const data: BackendEvent[] = await res.json();

        const formattedPrizes: Prize[] = data.map((event) => ({
          id: event._id,
          title: event.name,
          category: event.location || "Online",
          image: event.image || `https://picsum.photos/seed/${event._id}/600/600`, 
          
          entryFee: event.price || 1000,
          active: event.active
        }));

        setPrizes(formattedPrizes);
      } catch (err) {
        console.error("Error loading prizes:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  return (
    <section className="max-w-7xl mx-auto px-6 py-32">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
        <div>
          <h2 className="text-5xl font-albert font-bold mb-4 italic">Prizes To Be Won</h2>
          <p className="text-xl text-gray-500 dark:text-gray-400">Exclusive items and experiences just a play away.</p>
        </div>
        <div className="flex gap-4">
          <button className="px-8 py-3 rounded-full bg-brand-light dark:bg-brand-dark text-white dark:text-black font-bold text-sm shadow-md transition-colors">
            {loading ? "Loading..." : `${prizes.length} Events Available`}
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-20 text-gray-400 animate-pulse">Loading Events from Backend...</div>
      ) : prizes.length === 0 ? (
        <div className="text-center py-20 text-gray-500">No active lottery events found. Check back soon!</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {prizes.map(prize => (
            <PrizeCard key={prize.id} prize={prize} onNavigate={onNavigate} />
          ))}
        </div>
      )}
    </section>
  );
};

export default PrizeGrid;