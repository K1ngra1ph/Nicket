import React, { useState, useEffect } from 'react';
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

export interface GlobalSettings {
  platformName: string;
  supportEmail: string;
  currency: string;
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

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch('https://nicket-backend.onrender.com/api/settings');
        if (res.ok) {
          const data = await res.json();
          setSiteSettings(data);
        }
      } catch (error) {
        console.error("Failed to load site settings", error);
      }
    };
    fetchSettings();
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
        {activeTab === 'home' && (
          <>
            <Hero onNavigate={setActiveTab} />
            <PrizeGrid onNavigate={setActiveTab} />
            <FAQ />
          </>
        )}

        {activeTab === 'how-it-works' && <HowItWorks onNavigate={setActiveTab} />}
        
        {activeTab === 'winning-number' && <WinningNumber />}

        {activeTab === 'register' && <Registration />}
      </main>

      {/* 4. Pass settings to Footer */}
      <Footer onNavigate={setActiveTab} activeTab={activeTab} settings={siteSettings} />

      {/* 5. Pass settings to ContactFloater */}
      {activeTab !== 'register' && <ContactFloater settings={siteSettings} />}

      {/* Vercel Speed Insights */}
      <SpeedInsights />
    </div>
  );
};

export default App;