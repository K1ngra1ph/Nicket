import React, { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { TabType } from '../App';

interface HeroProps {
  onNavigate: (tab: TabType) => void;
}

interface HeroEvent {
  _id: string;
  name: string;
}

const Hero: React.FC<HeroProps> = ({ onNavigate }) => {
  const [featured, setFeatured] = useState<HeroEvent[]>([]);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await fetch('/events?active=true');
        if (res.ok) {
          const data = await res.json();
          setFeatured(data.slice(0, 2));
        }
      } catch (error) {
        console.error("Failed to load hero events", error);
      }
    };
    fetchFeatured();
  }, []);

  return (
    <section className="relative min-h-[90vh] flex flex-col items-center justify-center px-6 overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-brand-light/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-purple-600/10 dark:bg-brand-dark/10 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Floating Elements */}
      {featured.length > 0 && (
        <div className="absolute left-[10%] top-1/4 hidden lg:block animate-float">
          <div className="w-48 h-60 bg-custom-card rounded-3xl p-4 border border-custom shadow-2xl rotate-[-12deg]">
            <img 
              src={`https://picsum.photos/seed/${featured[0]._id}/400/400`} 
              className="w-full h-full object-cover rounded-2xl" 
              alt={featured[0].name} 
            />
            <div className="mt-2 text-center text-xs font-bold truncate opacity-70">
              {featured[0].name}
            </div>
          </div>
        </div>
      )}
      {featured.length > 1 && (
        <div className="absolute right-[10%] bottom-1/4 hidden lg:block animate-float-delayed">
          <div className="w-48 h-60 bg-custom-card rounded-3xl p-4 border border-custom shadow-2xl rotate-[12deg]">
            <img 
              src={`https://picsum.photos/seed/${featured[1]._id}/400/400`} 
              className="w-full h-full object-cover rounded-2xl" 
              alt={featured[1].name} 
            />
             <div className="mt-2 text-center text-xs font-bold truncate opacity-70">
              {featured[1].name}
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-albert font-bold leading-tight mb-8">
          Nigeria’s First Real Raffle<br />
          <span className="text-brand-light dark:text-brand-dark italic tracking-tighter">Nicket</span> Where<br />
          Every Play Pays.
        </h1>
        <p className="text-xl md:text-2xl text-gray-500 dark:text-gray-400 mb-12 font-medium">
          No Empty Hands. Real Prizes. Real Winners.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          <button 
            onClick={() => onNavigate('register')}
            className="w-full sm:w-auto bg-custom-btn px-10 py-5 rounded-full text-xl font-bold flex items-center justify-center gap-3 transition-all transform hover:scale-105 shadow-xl"
          >
            Start Winning Now <ArrowRight size={24} />
          </button>
        </div>
      </div>

      {/* Intro Sub-heading Section */}
      <div className="mt-32 w-full max-w-7xl">
        <div className="bg-gradient-to-r from-brand-light/20 to-purple-600/20 p-[1px] rounded-[40px]">
          <div className="bg-custom-card rounded-[40px] px-8 py-20 text-center flex flex-col items-center">
            <h2 className="text-3xl md:text-5xl font-albert font-bold mb-6 italic">Still Scrolling?</h2>
            <p className="text-xl md:text-2xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto font-light leading-relaxed mb-10">
              Tired of confusing games and impossible odds? We built <span className="font-bold text-brand-light dark:text-brand-dark">Nicket</span> to make playing easy, winning real, and actually worth your time.
            </p>
            <button 
              onClick={() => onNavigate('register')}
              className="bg-custom-btn px-12 py-5 rounded-full text-xl font-bold hover:scale-105 transition-all shadow-xl"
            >
              Play Now
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero