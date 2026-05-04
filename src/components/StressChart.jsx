import React from 'react';
import { motion } from 'framer-motion';

const StressChart = () => {
  const data = [
    { day: 'Mon', val: 45 },
    { day: 'Tue', val: 75 },
    { day: 'Wed', val: 50 },
    { day: 'Thu', val: 90 },
    { day: 'Fri', val: 60 },
    { day: 'Sat', val: 35 },
    { day: 'Sun', val: 55 }
  ];

  return (
    <div className="bg-surface dark:bg-surface-elevated p-8 rounded-[2.5rem] border border-border shadow-surface transition-colors duration-300">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h3 className="font-black text-xs uppercase tracking-[0.2em] text-campus-blue dark:text-campus-green italic">
            Process 7.1 // Stress Monitoring Trend
          </h3>
          <p className="text-[10px] font-bold text-muted-foreground uppercase mt-1">
            Weekly Wellness Data Synchronization
          </p>
        </div>
        <div className="flex gap-2">
          <span className="flex items-center gap-1 text-[9px] font-black uppercase text-muted-foreground">
            <span className="w-2 h-2 rounded-full bg-campus-green" /> Stable
          </span>
        </div>
      </div>

      <div className="h-52 flex items-end justify-between px-2 pb-2 gap-3">
        {data.map((item, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-3 group h-full justify-end">
            <div className="opacity-0 group-hover:opacity-100 transition-opacity mb-1">
               <span className="text-[9px] font-mono font-black text-campus-blue dark:text-campus-green bg-muted dark:bg-muted px-2 py-1 rounded-md">
                {item.val}%
               </span>
            </div>

            <motion.div
              initial={{ height: 0 }}
              animate={{ height: `${item.val}%` }}
              transition={{ duration: 1.2, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
              className={`w-full rounded-t-2xl transition-all duration-500 relative ${
                item.val > 80
                  ? 'bg-rose-500 shadow-soft'
                  : 'bg-muted dark:bg-muted group-hover:bg-campus-blue dark:group-hover:bg-campus-green'
              }`}
            >
              {item.val > 80 && (
                <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-primary-foreground rounded-full animate-pulse" />
              )}
            </motion.div>

            <span className="text-[10px] font-black text-muted-foreground uppercase tracking-tighter">
              {item.day}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-8 pt-6 border-t border-border flex justify-between items-center">
        <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest italic">
          Confidentially Secured for User: Aldrich
        </span>
        <button className="text-[10px] font-black text-campus-blue dark:text-campus-green hover:tracking-[0.2em] transition-all uppercase">
          Full Report →
        </button>
      </div>
    </div>
  );
};

export default StressChart;
