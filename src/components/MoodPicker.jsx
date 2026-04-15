import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Smile, Meh, Frown, AlertCircle, Heart, ArrowRight } from 'lucide-react';

const moods = [
  { label: 'Great', value: 5, icon: Heart, color: 'text-rose-500', bg: 'bg-rose-50', darkBg: 'dark:bg-rose-500/10' },
  { label: 'Good', value: 4, icon: Smile, color: 'text-emerald-500', bg: 'bg-emerald-50', darkBg: 'dark:bg-emerald-500/10' },
  { label: 'Okay', value: 3, icon: Meh, color: 'text-blue-500', bg: 'bg-blue-50', darkBg: 'dark:bg-blue-500/10' },
  { label: 'Down', value: 2, icon: Frown, color: 'text-amber-500', bg: 'bg-amber-50', darkBg: 'dark:bg-amber-500/10' },
  { label: 'Stressed', value: 1, icon: AlertCircle, color: 'text-rose-600', bg: 'bg-rose-50', darkBg: 'dark:bg-rose-600/10' },
];

export const MoodPicker = ({ onMoodSelect, navigate }) => {
  const [selected, setSelected] = useState(null);
  const [showTrigger, setShowTrigger] = useState(false);

  const handleSelect = (mood) => {
    setSelected(mood.label);
    
    // Process 1.4 Trigger Logic: Value 1 or 2 flags the system for immediate support
    if (mood.value <= 2) {
      setShowTrigger(true);
    } else {
      setShowTrigger(false);
    }

    if (onMoodSelect) onMoodSelect(mood);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center gap-3 p-1">
        {moods.map((mood) => {
          const Icon = mood.icon;
          const isSelected = selected === mood.label;
          
          return (
            <motion.button
              key={mood.label}
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleSelect(mood)}
              className={`flex flex-col items-center gap-2 p-4 rounded-[1.5rem] transition-all duration-300 flex-1 border ${
                isSelected 
                ? `${mood.bg} ${mood.darkBg} border-current shadow-lg shadow-current/10` 
                : 'bg-transparent border-transparent hover:bg-slate-50 dark:hover:bg-slate-800/50'
              }`}
            >
              <div className={`p-2 rounded-xl transition-colors ${isSelected ? 'bg-white dark:bg-slate-900 shadow-sm' : ''}`}>
                <Icon 
                  size={22} 
                  strokeWidth={isSelected ? 2.5 : 2}
                  className={isSelected ? mood.color : 'text-slate-400 dark:text-slate-600'} 
                />
              </div>
              <span className={`text-[10px] font-black uppercase tracking-tighter ${isSelected ? 'text-slate-800 dark:text-white' : 'text-slate-400 dark:text-slate-600'}`}>
                {mood.label}
              </span>
            </motion.button>
          );
        })}
      </div>

      {/* Automated Support Trigger - Aligned with Referral System (Process 4.0) */}
      <AnimatePresence>
        {showTrigger && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-rose-50 dark:bg-rose-500/5 border border-rose-100 dark:border-rose-500/20 p-4 rounded-3xl flex items-center justify-between group cursor-pointer"
                 onClick={() => navigate('/student/appointments')}>
              <div className="flex items-center gap-3">
                <div className="bg-rose-500 text-white p-2 rounded-xl">
                  <Heart size={16} fill="white" />
                </div>
                <div>
                  <p className="text-[11px] font-black uppercase text-rose-600 dark:text-rose-400 leading-none">Immediate Support Available</p>
                  <p className="text-[10px] font-bold text-rose-500/70 dark:text-rose-400/50 mt-1 uppercase tracking-tight">Would you like to speak with a counselor?</p>
                </div>
              </div>
              <ArrowRight size={18} className="text-rose-500 group-hover:translate-x-1 transition-transform" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};