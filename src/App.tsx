import React, { useState, useEffect } from 'react';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import PrizeGrid from './components/PrizeGrid';
import FAQ from './components/FAQ';
import Footer from './components/Footer';
import HowItWorks from './components/HowItWorks';
import WinningNumber from './components/WinningNumber';
import Registration from './components/Registration';
import ContactFloater from './components/ContactFloater';

export type TabType = 'home' | 'how-it-works' | 'winning-number' | 'register';

export interface Winner {
  _id: string;
  name: string;
  eventName: string;
  paymentReference: string;
}

export interface EventOption {
  _id: string;
  name: string;
  location: string;
  date: string;
  price: number;
  currency: string;
  active: boolean;
  image?: string;
}

export interface GlobalSettings {
  platformName: string;
  supportEmail: string;
  currency: string;
  maintenanceMode: boolean;
  socials: {
    twitter: string;
    instagram: string;
    facebook: string;
    whatsapp: string;
    phone: string;
    email: string;
  };
}

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [isDark, setIsDark] = useState(true);
  const [siteSettings, setSiteSettings] = useState<GlobalSettings | null>(null);
  const [globalEvents, setGlobalEvents] = useState<EventOption[]>([]);
  const [globalWinners, setGlobalWinners] = useState<Winner[]>([]);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  useEffect(() => {
    const initAppData = async () => {
      try {
        const [settingsRes, eventsRes, winnersRes] = await Promise.all([
          fetch('https://nicket-backend.onrender.com/api/settings'),
          fetch('https://nicket-backend.onrender.com/api/events'),
          fetch('https://nicket-backend.onrender.com/api/payments/recent-winners')
        ]);

        if (settingsRes.ok) setSiteSettings(await settingsRes.json());
        if (eventsRes.ok) setGlobalEvents(await eventsRes.json());
        if (winnersRes.ok) setGlobalWinners(await winnersRes.json());

      } catch (error) {
        console.error("Critical preloader sync failed", error);
      }
    };
    initAppData();
  }, []);

  const toggleTheme = () => setIsDark(!isDark);

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden bg-custom-bg text-custom-text transition-colors duration-300 relative">
      <Navbar 
        onNavigate={setActiveTab} 
        activeTab={activeTab} 
        isDark={isDark} 
        onToggleTheme={toggleTheme} 
      />
      
      <main className="flex-grow pt-20">
        {siteSettings?.maintenanceMode && activeTab !== 'winning-number' ? (
          <div className="h-[70vh] flex flex-col items-center justify-center text-center px-6 animate-in fade-in zoom-in duration-500">
            <div className="w-20 h-20 bg-brand-light/10 rounded-3xl flex items-center justify-center mb-8">
              <span className="text-4xl">🛠️</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-albert font-black italic mb-6 uppercase">Upgrading...</h1>
            <button onClick={() => setActiveTab('winning-number')} className="mt-10 px-8 py-4 bg-custom-btn rounded-full font-bold">Check My Ticket</button>
          </div>
        ) : (
          <>
            {activeTab === 'home' && (
              <>
                <Hero onNavigate={setActiveTab} />
                <PrizeGrid onNavigate={setActiveTab} events={globalEvents} /> 
                <FAQ winners={globalWinners} /> 
              </>
            )}

            {activeTab === 'how-it-works' && <HowItWorks onNavigate={setActiveTab} />}
            {activeTab === 'winning-number' && <WinningNumber />}
            {activeTab === 'register' && <Registration events={globalEvents} />}
          </>
        )}
      </main>

      <Footer onNavigate={setActiveTab} activeTab={activeTab} settings={siteSettings} />
      {activeTab !== 'register' && <ContactFloater settings={siteSettings} />}
      <Analytics />
      <SpeedInsights />
    </div>
  );
};

export default App;
