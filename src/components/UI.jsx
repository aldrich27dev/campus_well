import React from 'react';

// Process 8.1: Unified UI System
export const Button = ({ children, variant = 'primary', className = '', ...props }) => {
  const variants = {
    primary: 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-soft',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/90 shadow-soft',
    outline: 'border-2 border-border text-muted-foreground hover:border-primary hover:text-primary dark:hover:text-primary',
  };

  return (
    <button 
      className={`px-6 py-3 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all duration-300 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

// Clean Input with Brand Focus
export const Input = ({ label, ...props }) => (
  <div className="w-full">
    {label && (
      <label className="block text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-2 ml-2">
        {label}
      </label>
    )}
    <input 
      className="w-full px-5 py-3.5 bg-surface/80 dark:bg-surface-elevated/70 border border-border rounded-2xl outline-none focus:ring-4 focus:ring-ring focus:border-primary text-foreground transition-all duration-300 placeholder:text-muted-foreground/60 font-bold text-sm"
      {...props}
    />
  </div>
);

// The Core CampusWell Container
export const Card = ({ children, className = '', noPadding = false }) => (
  <div className={`
    bg-surface dark:bg-surface-elevated 
    border border-border 
    rounded-[2.5rem] 
    ${noPadding ? 'p-0' : 'p-8'} 
    shadow-surface transition-all duration-300 
    ${className}
  `}>
    {children}
  </div>
);
