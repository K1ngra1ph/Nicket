import React, { useState } from 'react';
import { Menu, X, ArrowRight, Sun, Moon } from 'lucide-react';
import { TabType } from '../App';
import Logo from './Logo';

interface NavbarProps {
  onNavigate: (tab: TabType) => void;
  activeTab: string;
  isDark: boolean;
  onToggleTheme: () => void;
}

const NAV_ITEMS: { label: string; value: TabType }[] = [
  { label: 'Home', value: 'home' },
  { label: 'How It Works', value: 'how-it-works' },
  { label: 'Check Nicket', value: 'winning-number' },
];

const Navbar: React.FC<NavbarProps> = ({ onNavigate, activeTab, isDark, onToggleTheme }) => {
  const [isOpen, setIsOpen] = useState(false);

  const isRegistering = activeTab === 'register';

  const handleNavClick = (tab: TabType) => {
    onNavigate(tab);
    setIsOpen(false);
  };

  const NavLinks = () => (
    <>
      {NAV_ITEMS.map((item) => (
        <button 
          key={item.value}
          onClick={() => handleNavClick(item.value)}
          className={`text-lg font-medium transition-colors ${
            activeTab === item.value 
              ? 'text-brand-light dark:text-brand-dark' 
              : 'text-gray-500 hover:text-brand-light dark:text-gray-400 dark:hover:text-brand-dark'
          }`}
        >
          {item.label}
        </button>
      ))}
    </>
  );

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-custom-nav backdrop-blur-md border-b border-custom">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        
        {/* Logo */}
        <button 
          onClick={() => onNavigate('home')}
          className="flex items-center group transform transition-transform hover:scale-105 active:scale-95"
        >
          <Logo size="md" />
        </button>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-10">
          
          {/* 1. HIDE LINKS IF REGISTERING */}
          {!isRegistering && <NavLinks />}
          
          <button 
            onClick={onToggleTheme}
            className="p-2 rounded-full border border-custom text-gray-500 hover:text-brand-light dark:text-brand-dark transition-all"
          >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {/* 2. HIDE "PLAY NOW" BUTTON IF REGISTERING */}
          {!isRegistering && (
            <button 
              onClick={() => onNavigate('register')}
              className="bg-custom-btn px-8 py-3 rounded-full font-bold flex items-center gap-2 transition-all transform hover:scale-105 active:scale-95 shadow-lg shadow-brand-light/20 dark:shadow-brand-dark/10"
            >
              Play Now <ArrowRight size={18} />
            </button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center gap-4">
          <button onClick={onToggleTheme} className="p-2 text-gray-500 dark:text-brand-dark">
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          
          {/* Hide Menu Icon if on Register page (Optional, remove check if you still want mobile menu) */}
          {!isRegistering && (
            <button 
              className="text-gray-500 dark:text-white" 
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          )}
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isOpen && !isRegistering && (
        <div className="md:hidden bg-custom-card absolute top-20 left-0 w-full p-8 flex flex-col gap-6 border-b border-custom shadow-xl animate-fade-in">
          <NavLinks />
          <button 
            onClick={() => handleNavClick('register')}
            className="bg-custom-btn px-6 py-4 rounded-full font-bold flex items-center justify-between text-center"
          >
            Play Now <ArrowRight size={20} />
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
