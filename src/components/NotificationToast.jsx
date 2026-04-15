import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BellRing, X, ShieldCheck } from 'lucide-react';

// Process 1.4: Automated Notification System Bridge
export const NotificationToast = ({ message, isVisible, onClose, type = "System" }) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
          className="fixed bottom-8 right-8 z-[100] min-w-[320px] max-w-md bg-white dark:bg-slate-900 p-5 rounded-[2rem] shadow-2xl shadow-blue-500/10 border border-slate-100 dark:border-slate-800 flex items-center gap-4 transition-colors duration-300"
        >
          {/* Module Icon - Campus Blue branding */}
          <div className="h-12 w-12 bg-[#1e3a8a] dark:bg-blue-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-500/20">
            <BellRing size={20} className="text-white animate-pulse" />
          </div>

          <div className="flex-1 pr-4">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-[10px] font-black uppercase text-[#1e3a8a] dark:text-blue-400 tracking-[0.2em]">
                {type} Alert
              </span>
              <span className="h-1 w-1 rounded-full bg-slate-300 dark:bg-slate-700" />
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter flex items-center gap-1">
                <ShieldCheck size={10} /> Sync_Active
              </span>
            </div>
            <p className="text-sm font-black text-slate-800 dark:text-white leading-tight tracking-tight uppercase italic">
              {message}
            </p>
          </div>

          <button 
            onClick={onClose} 
            className="p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors text-slate-400 hover:text-rose-500"
          >
            <X size={18} strokeWidth={3} />
          </button>

          {/* Clean Aesthetic Progress Bar */}
          <motion.div 
            initial={{ width: "100%" }}
            animate={{ width: "0%" }}
            transition={{ duration: 5, ease: "linear" }}
            onAnimationComplete={onClose}
            className="absolute bottom-0 left-8 right-8 h-1 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden"
          >
            <div className="h-full bg-[#1e3a8a] dark:bg-blue-500 rounded-full" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};