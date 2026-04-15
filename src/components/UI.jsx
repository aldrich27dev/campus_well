import React from 'react';

// Process 8.1: Unified UI System
export const Button = ({ children, variant = 'primary', className = '', ...props }) => {
  const variants = {
    // Official Campus Blue
    primary: 'bg-[#1e3a8a] text-white hover:bg-[#1e3a8a]/90 shadow-lg shadow-blue-900/20',
    // Official Campus Green
    secondary: 'bg-[#92c37c] text-white hover:bg-[#92c37c]/90 shadow-lg shadow-green-900/20',
    // Clean Outline for Sub-actions
    outline: 'border-2 border-slate-100 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:border-[#92c37c] hover:text-[#92c37c] dark:hover:text-[#92c37c]',
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
      <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-2 ml-2">
        {label}
      </label>
    )}
    <input 
      className="w-full px-5 py-3.5 bg-slate-50/50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-2xl outline-none focus:ring-4 focus:ring-[#92c37c]/10 focus:border-[#92c37c] dark:text-white transition-all duration-300 placeholder:text-slate-300 dark:placeholder:text-slate-600 font-bold text-sm"
      {...props}
    />
  </div>
);

// The Core CampusWell Container
export const Card = ({ children, className = '', noPadding = false }) => (
  <div className={`
    bg-white dark:bg-slate-900 
    border border-slate-100 dark:border-slate-800 
    rounded-[2.5rem] 
    ${noPadding ? 'p-0' : 'p-8'} 
    shadow-sm transition-all duration-300 
    ${className}
  `}>
    {children}
  </div>
);