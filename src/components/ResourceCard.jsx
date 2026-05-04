import React from 'react';
import { motion } from 'framer-motion';
import { PlayCircle, FileText, Headphones, Heart, Shield } from 'lucide-react';

export const ResourceCard = ({ title, type, duration, category = 'General' }) => {
  const getIcon = () => {
    switch (type) {
      case 'Video': return <PlayCircle size={18} />;
      case 'Article': return <FileText size={18} />;
      case 'Audio': return <Headphones size={18} />;
      default: return <Heart size={18} />;
    }
  };

  const getCategoryStyle = () => {
    const styles = {
      'Mental Health': 'bg-campus-blue text-primary-foreground shadow-soft',
      'Self-Care': 'bg-campus-green text-primary-foreground shadow-soft',
      'Emergency': 'bg-rose-500 text-primary-foreground shadow-soft',
      'General': 'bg-muted dark:bg-muted text-muted-foreground'
    };
    return styles[category] || styles['General'];
  };

  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="bg-surface dark:bg-surface-elevated rounded-[2.5rem] p-7 shadow-surface border border-border cursor-pointer group transition-all duration-300 hover:shadow-soft"
    >
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-lg transition-transform group-hover:rotate-6 ${getCategoryStyle()}`}>
        {getIcon()}
      </div>

      <div className="space-y-3">
        <span className="text-[10px] font-black uppercase text-campus-blue dark:text-campus-green tracking-[0.2em]">
          {category}
        </span>

        <h4 className="font-black text-lg text-foreground leading-tight uppercase tracking-tighter italic transition-colors group-hover:text-campus-blue dark:group-hover:text-campus-green">
          {title}
        </h4>

        <div className="flex items-center gap-3 pt-2">
          <div className="px-3 py-1 bg-muted dark:bg-muted rounded-full border border-border">
             <span className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">{type}</span>
          </div>
          <span className="text-[10px] font-bold text-border">•</span>
          <span className="text-[10px] font-bold text-muted-foreground italic font-mono">{duration}</span>
        </div>
      </div>

      <div className="mt-6 pt-5 border-t border-border/60 flex items-center justify-between opacity-50 group-hover:opacity-100 transition-opacity">
        <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
          <Shield size={12} className="text-muted-foreground/70" /> Secure_P3.1
        </span>
        <button className="text-[10px] font-black text-campus-blue dark:text-campus-green uppercase tracking-tighter hover:underline">
          Open Resource
        </button>
      </div>
    </motion.div>
  );
};
