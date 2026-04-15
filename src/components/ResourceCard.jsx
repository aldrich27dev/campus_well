import React from 'react';
import { motion } from 'framer-motion';
import { PlayCircle, FileText, Headphones, Heart, Shield } from 'lucide-react';

// Module 3: Digital Resource Library
export const ResourceCard = ({ title, type, duration, category = 'General' }) => {
  
  const getIcon = () => {
    switch (type) {
      case 'Video': return <PlayCircle size={18} />;
      case 'Article': return <FileText size={18} />;
      case 'Audio': return <Headphones size={18} />;
      default: return <Heart size={18} />;
    }
  };

  // FIX: Added dark: variants to the category styles to ensure the icon box changes
  const getCategoryStyle = () => {
    const styles = {
      'Mental Health': 'bg-[#1e3a8a] text-white shadow-[#1e3a8a]/20',
      'Self-Care': 'bg-[#92c37c] text-white shadow-[#92c37c]/20',
      'Emergency': 'bg-rose-500 text-white shadow-rose-500/20',
      'General': 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
    };
    return styles[category] || styles['General'];
  };

  return (
    <motion.div 
      whileHover={{ y: -8, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      // FIX: Explicitly added dark:bg-slate-900 and dark:border-slate-800
      className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-7 shadow-sm border border-slate-100 dark:border-slate-800 cursor-pointer group transition-all duration-300 hover:shadow-2xl"
    >
      {/* Module Identifier Icon */}
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-lg transition-transform group-hover:rotate-6 ${getCategoryStyle()}`}>
        {getIcon()}
      </div>

      <div className="space-y-3">
        {/* Category Label */}
        <span className="text-[10px] font-black uppercase text-[#1e3a8a] dark:text-blue-400 tracking-[0.2em]">
          {category}
        </span>

        <h4 className="font-black text-lg text-slate-800 dark:text-white leading-tight uppercase tracking-tighter italic transition-colors group-hover:text-[#1e3a8a] dark:group-hover:text-blue-400">
          {title}
        </h4>

        {/* Metadata Section */}
        <div className="flex items-center gap-3 pt-2">
          <div className="px-3 py-1 bg-slate-50 dark:bg-slate-800 rounded-full border border-transparent dark:border-slate-700">
             <span className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-widest">{type}</span>
          </div>
          <span className="text-[10px] font-bold text-slate-300 dark:text-slate-700">•</span>
          <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 italic font-mono">{duration}</span>
        </div>
      </div>

      {/* Process 1.5 Traceability - Secure Access Footer */}
      <div className="mt-6 pt-5 border-t border-slate-50 dark:border-slate-800/50 flex items-center justify-between opacity-40 group-hover:opacity-100 transition-opacity">
        <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
          <Shield size={12} className="text-slate-300 dark:text-slate-600" /> Secure_P3.1
        </span>
        <button className="text-[10px] font-black text-[#1e3a8a] dark:text-blue-400 uppercase tracking-tighter hover:underline">
          Open Resource
        </button>
      </div>
    </motion.div>
  );
};