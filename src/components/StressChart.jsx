import React from 'react';
import { motion } from 'framer-motion';

// Process 7.1: Data Analytics & Wellness Trends
const StressChart = () => {
  // Mock data representing stress levels mapped from MoodPicker values
  const data = [
    { day: 'Mon', val: 45 },
    { day: 'Tue', val: 75 },
    { day: 'Wed', val: 50 },
    { day: 'Thu', val: 90 }, // Triggered Process 1.4 Notification
    { day: 'Fri', val: 60 },
    { day: 'Sat', val: 35 },
    { day: 'Sun', val: 55 }
  ];

  return (
    <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm transition-colors duration-300">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h3 className="font-black text-xs uppercase tracking-[0.2em] text-[#1e3a8a] dark:text-blue-400 italic">
            Process 7.1 // Stress Monitoring Trend
          </h3>
          <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase mt-1">
            Weekly Wellness Data Synchronization
          </p>
        </div>
        <div className="flex gap-2">
          <span className="flex items-center gap-1 text-[9px] font-black uppercase text-slate-400">
            <span className="w-2 h-2 rounded-full bg-[#92c37c]" /> Stable
          </span>
        </div>
      </div>

      <div className="h-52 flex items-end justify-between px-2 pb-2 gap-3">
        {data.map((item, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-3 group h-full justify-end">
            {/* Value Tooltip on Hover */}
            <div className="opacity-0 group-hover:opacity-100 transition-opacity mb-1">
               <span className="text-[9px] font-mono font-black text-[#1e3a8a] dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2 py-1 rounded-md">
                {item.val}%
               </span>
            </div>

            {/* Animated Bar with Tailwind 4 Variables */}
            <motion.div 
              initial={{ height: 0 }}
              animate={{ height: `${item.val}%` }}
              transition={{ duration: 1.2, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
              className={`w-full rounded-t-2xl transition-all duration-500 relative ${
                item.val > 80 
                ? 'bg-rose-500 shadow-[0_0_20px_rgba(244,63,94,0.3)]' 
                : 'bg-slate-100 dark:bg-slate-800 group-hover:bg-[#1e3a8a] dark:group-hover:bg-blue-500'
              }`}
            >
              {item.val > 80 && (
                <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
              )}
            </motion.div>

            <span className="text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-tighter">
              {item.day}
            </span>
          </div>
        ))}
      </div>
      
      {/* Chart Legend aligned with DFD Role Access */}
      <div className="mt-8 pt-6 border-t border-slate-50 dark:border-slate-800 flex justify-between items-center">
        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest italic">
          Confidentially Secured for User: Aldrich
        </span>
        <button className="text-[10px] font-black text-[#1e3a8a] dark:text-blue-400 hover:tracking-[0.2em] transition-all uppercase">
          Full Report →
        </button>
      </div>
    </div>
  );
};

export default StressChart;