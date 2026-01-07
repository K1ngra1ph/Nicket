import React from 'react';
import { Instagram, Twitter, Facebook } from 'lucide-react';
import { TabType } from '../App';
import Logo from './Logo';

interface FooterProps {
  onNavigate: (tab: TabType) => void;
  activeTab: TabType;
}

const Footer: React.FC<FooterProps> = ({ onNavigate, activeTab }) => {
  const currentYear = new Date().getFullYear();
  const isRegistering = activeTab === 'register';

  return (
    <footer className="bg-gray-100 dark:bg-[#111] text-current py-20 px-6 mt-32 border-t border-custom">
      <div className="max-w-7xl mx-auto">
        
        {/* CONDITIONAL RENDER: Only show this top section if NOT registering */}
        {!isRegistering && (
          <div className="flex flex-col md:flex-row items-center justify-between gap-12 mb-20">
            <div className="text-center md:text-left">
              <Logo size="xl" className="mb-4" />
              <p className="text-2xl md:text-3xl font-albert font-bold mt-2 relative z-10">
                You always win something. <br />
                <span className="text-brand-light dark:text-brand-dark">That’s our promise.</span>
              </p>
            </div>
            
            <button 
              onClick={() => onNavigate('register')}
              className="bg-custom-btn px-10 py-5 rounded-full text-xl font-bold hover:scale-105 transition-transform shadow-xl text-center"
            >
              Play Now
            </button>
          </div>
        )}

        {/* Adjust styling: Remove top border if the top section is hidden */}
        <div className={`grid grid-cols-1 md:grid-cols-4 gap-12 border-custom ${!isRegistering ? 'border-t pt-12' : ''}`}>
          <div className="col-span-1">
            <Logo size="sm" className="mb-4" />
            <p className="text-gray-500 dark:text-gray-400 font-medium">Making gaming easy, exciting, and open to everyone.</p>
          </div>

          <div>
            <h4 className="font-bold mb-6 text-sm uppercase tracking-widest text-gray-400">Navigation</h4>
            <ul className="space-y-4 font-bold text-gray-600 dark:text-gray-300">
              <li><button onClick={() => onNavigate('home')} className="hover:text-brand-light dark:hover:text-brand-dark transition-colors">Home</button></li>
              <li><button onClick={() => onNavigate('how-it-works')} className="hover:text-brand-light dark:hover:text-brand-dark transition-colors">How it works</button></li>
              <li><button onClick={() => onNavigate('winning-number')} className="hover:text-brand-light dark:hover:text-brand-dark transition-colors">Winning Number</button></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-6 text-sm uppercase tracking-widest text-gray-400">Connect</h4>
            <div className="flex flex-col gap-4 font-bold text-gray-600 dark:text-gray-300">
              <a href="#" className="flex items-center gap-2 hover:text-brand-light dark:hover:text-brand-dark transition-colors"><Instagram size={20} /> Instagram</a>
              <a href="#" className="flex items-center gap-2 hover:text-brand-light dark:hover:text-brand-dark transition-colors"><Twitter size={20} /> Twitter/X</a>
              <a href="#" className="flex items-center gap-2 hover:text-brand-light dark:hover:text-brand-dark transition-colors"><Facebook size={20} /> Facebook</a>
            </div>
          </div>

          <div>
            <h4 className="font-bold mb-6 text-sm uppercase tracking-widest text-gray-400">Legal</h4>
            <ul className="space-y-4 font-bold text-gray-600 dark:text-gray-300">
              <li><a href="#" className="hover:text-brand-light dark:hover:text-brand-dark transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-brand-light dark:hover:text-brand-dark transition-colors">Privacy Policy</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-20 pt-8 border-t border-custom text-center text-sm font-medium text-gray-500">
          Copyright {currentYear} — 311 Nicket Entertainment LTD. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;