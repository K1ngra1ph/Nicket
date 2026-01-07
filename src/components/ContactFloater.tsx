
import React, { useState } from 'react';
import { Phone, Mail, MessageCircle, X, MessageSquareText } from 'lucide-react';

const ContactFloater: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const contactOptions = [
    {
      icon: <Phone size={24} />,
      label: 'Call',
      href: 'tel:+2348000000000',
      color: 'bg-blue-500',
    },
    {
      icon: <Mail size={24} />,
      label: 'Email',
      href: 'mailto:support@nicket.com',
      color: 'bg-red-500',
    },
    {
      icon: <MessageCircle size={24} />,
      label: 'WhatsApp',
      href: 'https://wa.me/2348000000000',
      color: 'bg-green-500',
    },
  ];

  return (
    <div className="fixed bottom-8 right-8 z-[100] flex flex-col items-end gap-4">
      {/* Expanded Menu */}
      <div 
        className={`flex flex-col gap-4 transition-all duration-500 ease-out transform ${
          isOpen ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-10 opacity-0 scale-75 pointer-events-none'
        }`}
      >
        {contactOptions.map((option, idx) => (
          <a
            key={idx}
            href={option.href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 group"
          >
            <span className="bg-custom-card px-4 py-2 rounded-xl text-sm font-bold shadow-lg border border-custom opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              {option.label}
            </span>
            <div className={`${option.color} text-white p-4 rounded-2xl shadow-xl hover:scale-110 active:scale-95 transition-all transform`}>
              {option.icon}
            </div>
          </a>
        ))}
      </div>

      {/* Main Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-3 bg-custom-btn px-6 py-4 rounded-3xl shadow-2xl transition-all transform hover:scale-105 active:scale-95 group overflow-hidden relative ${
          isOpen ? 'ring-4 ring-brand-light/20 dark:ring-brand-dark/20' : ''
        }`}
      >
        <div className="relative z-10 flex items-center gap-2">
          {isOpen ? <X size={28} className="animate-in spin-in duration-300" /> : <MessageSquareText size={28} className="animate-in zoom-in duration-300" />}
          <span className="font-bold text-lg hidden md:block">
            {isOpen ? 'Close' : 'Contact Us'}
          </span>
        </div>
        
        {/* Animated background glow */}
        <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
      </button>

      {/* Backdrop for mobile to close when clicking outside */}
      {isOpen && (
        <div 
          className="fixed inset-0 -z-10 bg-black/5 dark:bg-black/20 backdrop-blur-sm md:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </div>
  );
};

export default ContactFloater;