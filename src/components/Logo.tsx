
import React, { useState } from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const Logo: React.FC<LogoProps> = ({ className = "", size = 'md' }) => {
  const [imageError, setImageError] = useState(false);
  
  const sizeClasses = {
    sm: 'h-8',
    md: 'h-12',
    lg: 'h-20',
    xl: 'h-32 md:h-40'
  };

  const textSizeClasses = {
    sm: 'text-2xl',
    md: 'text-4xl',
    lg: 'text-6xl',
    xl: 'text-8xl md:text-9xl'
  };

  return (
    <div className={`relative inline-block select-none ${className}`}>
      {!imageError ? (
        <img 
          src="assets/images/nicket-logo.png" 
          alt="Nicket Logo" 
          className={`${sizeClasses[size]} w-auto object-contain`}
          onError={() => setImageError(true)}
        />
      ) : (
        <div className={`font-passion font-bold italic uppercase tracking-tighter ${textSizeClasses[size]} leading-none flex items-center`}>
          {/* Chromatic Aberration Fallback */}
          <span className="absolute left-[1px] top-0 text-cyan-400 opacity-70 mix-blend-screen pointer-events-none">Nicket!</span>
          <span className="absolute -left-[1px] top-0 text-red-500 opacity-70 mix-blend-screen pointer-events-none">Nicket!</span>
          <span className="relative text-brand-light dark:text-white drop-shadow-md">Nicket!</span>
        </div>
      )}
    </div>
  );
};

export default Logo;
