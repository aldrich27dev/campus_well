import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useSystem } from '../context/SystemContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, BellRing, FileSearch, CheckCircle2, X, CalendarClock, ShieldAlert, ClipboardList } from 'lucide-react';

const NotificationCenter = () => {
  const { notifications, user } = useSystem();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const role = user?.role?.toLowerCase() || 'student';
  const visibleNotifications = useMemo(() => {
    return notifications.filter((n) => {
      const audience = Array.isArray(n.roles) && n.roles.length > 0 ? n.roles : ['student', 'counselor', 'admin'];
      return audience.includes('all') || audience.includes(role);
    });
  }, [notifications, role]);
  const unreadCount = visibleNotifications.filter(n => !n.read).length;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const roleConfig = {
    admin: { label: 'Process 9.1 // System Logs', sub: 'Security & Infrastructure Alerts', actionLabel: 'View Audit Trail' },
    counselor: { label: 'Process 6.2 // Activity Log', sub: 'Automated Student Alerts', actionLabel: 'View Case File' },
    student: { label: 'Process 1.4 // My Updates', sub: 'Wellness & Appointment Alerts', actionLabel: 'View Details' }
  };

  const currentConfig = roleConfig[role] || roleConfig.student;
  const MotionButton = motion.button;
  const MotionDiv = motion.div;
  const getBadge = (n) => {
    if (n.type === 'appointment') return { label: role === 'student' ? 'Appointment' : 'Booking', icon: CalendarClock };
    if (n.type === 'assessment') return { label: n.risk === 'High' ? 'High Risk' : 'Assessment', icon: ShieldAlert };
    return { label: 'System', icon: ClipboardList };
  };

  const getTitle = (n) => {
    const year = n.yearLevel ? ` - ${n.yearLevel}` : '';

    if (role === 'student') {
      if (n.type === 'appointment') return `Your Appointment${year}`;
      if (n.type === 'assessment' && n.risk === 'High') return 'Support Check-In';
      return n.student ? `CampusWell Update${year}` : 'CampusWell Update';
    }

    if (role === 'counselor') {
      if (n.type === 'appointment') return `${n.student}${year} requested counseling`;
      if (n.type === 'assessment' && n.risk === 'High') return `${n.student}${year} triggered a high-risk alert`;
      return `${n.student}${year}`;
    }

    if (role === 'admin') {
      if (n.type === 'appointment') return `Appointment Logged: ${n.student}${year}`;
      if (n.type === 'assessment' && n.risk === 'High') return `High-risk event: ${n.student}${year}`;
      return `${n.student}${year}`;
    }

    return n.student || 'System Update';
  };

  const getMessage = (n) => {
    const year = n.yearLevel ? ` ${n.yearLevel}` : '';
    if (n.type === 'appointment') {
      if (role === 'student') return n.message || `Your counseling request for ${n.date} at ${n.time} is now pending assistant approval.`;
      if (role === 'counselor') return n.message || `New counseling request from ${n.student}${year} for ${n.date} at ${n.time}.`;
      return n.message || `Appointment recorded for ${n.student}${year} on ${n.date} at ${n.time}.`;
    }

    if (n.type === 'assessment' && n.risk === 'High') {
      if (role === 'student') return n.message || 'A support check-in was shared with the counseling team after your recent assessment.';
      if (role === 'counselor') return n.message || `High-risk wellness alert requires review for ${n.student}${year}.`;
      return n.message || `High-risk student alert logged for ${n.student}${year}.`;
    }

    return n.message || n.status || `Triggered ${n.type || 'system'} alert.`;
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <MotionButton
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`relative p-3 rounded-2xl border transition-all duration-300 ${
          isOpen
            ? 'bg-campus-blue text-primary-foreground border-transparent shadow-soft'
            : 'bg-surface dark:bg-surface-elevated border-border text-muted-foreground hover:bg-muted/70 dark:hover:bg-muted/40'
        }`}
      >
        {unreadCount > 0 ? <BellRing size={20} className="animate-pulse" /> : <Bell size={20} />}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-rose-500 text-primary-foreground text-[9px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-background shadow-sm">
            {unreadCount}
          </span>
        )}
      </MotionButton>

      <AnimatePresence>
        {isOpen && (
          <>
            <MotionDiv
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-background/55 backdrop-blur-sm z-[49] md:hidden"
              onClick={() => setIsOpen(false)}
            />

              <MotionDiv
                initial={{ opacity: 0, y: 50, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 50, scale: 0.95 }}
              className="fixed md:absolute bottom-0 md:bottom-auto left-0 md:left-auto right-0 md:mt-4 w-full md:w-[21rem] bg-surface dark:bg-surface-elevated rounded-t-[2.5rem] md:rounded-[2.5rem] shadow-2xl border-t md:border border-border z-50 overflow-hidden"
              >
              <div className="p-6 border-b border-border/60 bg-muted/40 dark:bg-muted/20 flex justify-between items-center">
                <div>
                  <h3 className="font-black text-campus-blue dark:text-campus-green text-[11px] uppercase tracking-[0.2em]">
                    {currentConfig.label}
                  </h3>
                  <p className="text-[9px] font-bold text-muted-foreground uppercase mt-0.5">{currentConfig.sub}</p>
                </div>
                <div className="flex items-center gap-3">
                  {unreadCount > 0 && (
                    <span className="text-[9px] font-black px-2 py-0.5 bg-rose-100 dark:bg-rose-500/10 text-rose-600 rounded-full">
                      {unreadCount} NEW
                    </span>
                  )}
                  <button onClick={() => setIsOpen(false)} className="md:hidden p-2 text-muted-foreground hover:text-foreground">
                    <X size={18} />
                  </button>
                </div>
              </div>

              <div className="max-h-[60vh] md:max-h-[400px] overflow-y-auto scrollbar-hide pb-safe">
                {visibleNotifications.length === 0 ? (
                  <div className="p-10 text-center space-y-3">
                    <div className="w-12 h-12 bg-muted dark:bg-muted rounded-2xl flex items-center justify-center mx-auto">
                      <CheckCircle2 size={20} className="text-muted-foreground/50" />
                    </div>
                    <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">No pending {role} actions</p>
                  </div>
                ) : (
                  visibleNotifications.map((n) => {
                    const badge = getBadge(n);
                    const BadgeIcon = badge.icon;
                    return (
                    <div
                      key={n.id}
                      className="p-5 border-b border-border/60 hover:bg-muted/50 dark:hover:bg-muted/25 transition-colors cursor-pointer group active:bg-muted/80 dark:active:bg-muted/40"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${n.read ? 'bg-muted-foreground/20' : 'bg-campus-blue animate-pulse'}`} />
                          <span className="text-[11px] font-black text-foreground uppercase tracking-tighter italic">
                            {getTitle(n)}
                          </span>
                        </div>
                        <span className="text-[9px] text-muted-foreground font-mono font-bold">{n.time}</span>
                      </div>

                      <p className="text-[11px] text-muted-foreground leading-snug">
                        {getMessage(n)}
                      </p>

                      <div className="mt-3 flex flex-wrap items-center gap-2">
                        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-muted/50 dark:bg-muted/25 text-muted-foreground text-[9px] font-black uppercase tracking-widest">
                          <BadgeIcon size={11} /> {badge.label}
                        </div>
                        {n.risk === 'High' && (
                          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-rose-100/80 dark:bg-rose-500/10 text-rose-600 text-[9px] font-black uppercase tracking-widest">
                            Priority Alert
                          </div>
                        )}
                      </div>

                      <div className="mt-4 flex items-center gap-3">
                        <button className="flex items-center gap-1.5 text-[9px] font-black text-campus-blue dark:text-campus-green uppercase tracking-widest hover:gap-3 transition-all">
                          <FileSearch size={12} /> {currentConfig.actionLabel}
                        </button>
                      </div>
                    </div>
                    );
                  })
                )}
              </div>

              <div className="p-4 bg-muted/40 dark:bg-muted/20 text-center pb-8 md:pb-4">
                <button className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.3em] hover:text-campus-blue transition-colors">
                  Clear All {role} Logs
                </button>
              </div>
            </MotionDiv>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationCenter;
