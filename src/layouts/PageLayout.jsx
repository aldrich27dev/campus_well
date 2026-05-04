import React from 'react';
import { motion } from 'framer-motion';

const PageLayout = ({ children, role, title }) => {
  const MotionDiv = motion.div;
  return (
      <main className="flex-1 overflow-x-clip">
        <header className="h-20 flex items-center justify-between px-4 sm:px-6 lg:px-10">
          <h1 className="text-xl font-bold text-foreground italic uppercase tracking-tight">{title}</h1>
          <div className="flex items-center gap-4 bg-surface p-2 rounded-[1.5rem] border border-border shadow-surface">
            <div className="text-right">
              <p className="text-xs font-black text-campus-blue leading-none">Aldrich Naag</p>
              <p className="text-[10px] text-muted-foreground font-bold uppercase">{role}</p>
            </div>
            <div className="h-10 w-10 bg-campus-green rounded-2xl border border-border/70 shadow-sm flex items-center justify-center text-primary-foreground font-bold">
              AN
            </div>
          </div>
        </header>

        <MotionDiv 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="px-4 sm:px-6 lg:px-10 pt-4"
        >
          {children}
        </MotionDiv>
      </main>
  );
};

export default PageLayout;
