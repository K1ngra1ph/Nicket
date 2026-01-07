import React, { useState, useEffect } from 'react';
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

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

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

      <Footer onNavigate={setActiveTab} activeTab={activeTab} />

      {activeTab !== 'register' && <ContactFloater />}
    </div>
  );
};

export default App;