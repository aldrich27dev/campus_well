import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BellRing, X, ShieldCheck } from 'lucide-react';

export const NotificationToast = ({ message, isVisible, onClose, type = "System" }) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
          className="fixed bottom-8 right-8 z-[100] min-w-[320px] max-w-md bg-surface dark:bg-surface-elevated p-5 rounded-[2rem] shadow-2xl border border-border flex items-center gap-4 transition-colors duration-300"
        >
          <div className="h-12 w-12 bg-campus-blue dark:bg-campus-green rounded-2xl flex items-center justify-center flex-shrink-0 shadow-soft">
            <BellRing size={20} className="text-primary-foreground animate-pulse" />
          </div>

          <div className="flex-1 pr-4">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-[10px] font-black uppercase text-campus-blue dark:text-campus-green tracking-[0.2em]">
                {type} Alert
              </span>
              <span className="h-1 w-1 rounded-full bg-border" />
              <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-tighter flex items-center gap-1">
                <ShieldCheck size={10} /> Sync_Active
              </span>
            </div>
            <p className="text-sm font-black text-foreground leading-tight tracking-tight uppercase italic">
              {message}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-xl transition-colors text-muted-foreground hover:text-rose-500"
          >
            <X size={18} strokeWidth={3} />
          </button>

          <motion.div
            initial={{ width: "100%" }}
            animate={{ width: "0%" }}
            transition={{ duration: 5, ease: "linear" }}
            onAnimationComplete={onClose}
            className="absolute bottom-0 left-8 right-8 h-1 bg-muted rounded-full overflow-hidden"
          >
            <div className="h-full bg-campus-blue dark:bg-campus-green rounded-full" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
