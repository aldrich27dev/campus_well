import React, { useState, useRef, useEffect } from 'react';
import { useSystem } from '../context/SystemContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, BellRing, ShieldAlert, FileSearch, CheckCircle2, X } from 'lucide-react';

const NotificationCenter = () => {
  const { notifications, user } = useSystem(); // Assuming 'user' contains 'role'
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  
  // Role Detection (Defaults to student if not found)
  const role = user?.role?.toLowerCase() || 'student';
  const unreadCount = notifications.filter(n => !n.read).length;

  // Handle outside clicks to close
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Role-based UI Mapping
  const roleConfig = {
    admin: {
      label: "Process 9.1 // System Logs",
      sub: "Security & Infrastructure Alerts",
      actionLabel: "View Audit Trail"
    },
    counselor: {
      label: "Process 6.2 // Activity Log",
      sub: "Automated Student Alerts",
      actionLabel: "View Case File"
    },
    student: {
      label: "Process 1.4 // My Updates",
      sub: "Wellness & Appointment Alerts",
      actionLabel: "View Details"
    }
  };

  const currentConfig = roleConfig[role] || roleConfig.student;

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button */}
      <motion.button 
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`relative p-3 rounded-2xl border transition-all duration-300 ${
          isOpen 
          ? 'bg-[#1e3a8a] text-white border-transparent shadow-lg shadow-blue-500/20' 
          : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
        }`}
      >
        {unreadCount > 0 ? <BellRing size={20} className="animate-pulse" /> : <Bell size={20} />}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[9px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-white dark:border-slate-900 shadow-sm">
            {unreadCount}
          </span>
        )}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Mobile Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm z-[49] md:hidden"
              onClick={() => setIsOpen(false)}
            />

            <motion.div 
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.95 }}
              /* Mobile: Fixed bottom sheet | Desktop: Absolute dropdown */
              className="fixed md:absolute bottom-0 md:bottom-auto left-0 md:left-auto right-0 md:mt-4 w-full md:w-85 bg-white dark:bg-slate-900 rounded-t-[2.5rem] md:rounded-[2.5rem] shadow-2xl border-t md:border border-slate-100 dark:border-slate-800 z-50 overflow-hidden"
            >
              {/* Header */}
              <div className="p-6 border-b border-slate-50 dark:border-slate-800/50 bg-slate-50/50 dark:bg-slate-800/30 flex justify-between items-center">
                <div>
                  <h3 className="font-black text-[#1e3a8a] dark:text-blue-400 text-[11px] uppercase tracking-[0.2em]">
                    {currentConfig.label}
                  </h3>
                  <p className="text-[9px] font-bold text-slate-400 uppercase mt-0.5">{currentConfig.sub}</p>
                </div>
                <div className="flex items-center gap-3">
                  {unreadCount > 0 && (
                    <span className="text-[9px] font-black px-2 py-0.5 bg-rose-100 dark:bg-rose-500/10 text-rose-600 rounded-full">
                      {unreadCount} NEW
                    </span>
                  )}
                  <button onClick={() => setIsOpen(false)} className="md:hidden p-2 text-slate-400 hover:text-slate-600">
                    <X size={18} />
                  </button>
                </div>
              </div>
              
              {/* Notification List */}
              <div className="max-h-[60vh] md:max-h-[400px] overflow-y-auto scrollbar-hide pb-safe">
                {notifications.length === 0 ? (
                  <div className="p-10 text-center space-y-3">
                    <div className="w-12 h-12 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center mx-auto">
                      <CheckCircle2 size={20} className="text-slate-300" />
                    </div>
                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">No pending actions</p>
                  </div>
                ) : (
                  notifications.map((n) => (
                    <div 
                      key={n.id} 
                      className="p-5 border-b border-slate-50 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer group active:bg-slate-100 dark:active:bg-slate-800"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${n.read ? 'bg-slate-200 dark:bg-slate-700' : 'bg-blue-500 animate-pulse'}`} />
                          <span className="text-[11px] font-black text-slate-800 dark:text-white uppercase tracking-tighter italic">
                            {role === 'student' ? 'System Message' : n.student}
                          </span>
                        </div>
                        <span className="text-[9px] text-slate-400 font-mono font-bold">{n.time}</span>
                      </div>
                      
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                        {n.message || `Triggered ${n.status || 'system'} alert via ${n.type || 'module'}.`}
                      </p>
                      
                      <div className="mt-4 flex items-center gap-3">
                        <button className="flex items-center gap-1.5 text-[9px] font-black text-[#1e3a8a] dark:text-blue-400 uppercase tracking-widest hover:gap-3 transition-all">
                          <FileSearch size={12} /> {currentConfig.actionLabel}
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Footer */}
              <div className="p-4 bg-slate-50/50 dark:bg-slate-800/20 text-center pb-8 md:pb-4">
                <button className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] hover:text-[#1e3a8a] transition-colors">
                  Clear All {role} Logs
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationCenter;