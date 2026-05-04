import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Activity, TrendingUp, ChevronRight } from 'lucide-react';
import StudentLayout from '../layouts/StudentLayout';
import { useSystem } from '../context/SystemContext';
import DashboardSkeleton from '../components/ui/Skeleton';

const MotionDiv = motion.div;

const StudentDashboard = () => {
  const [selectedMood, setSelectedMood] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useSystem();

  const moods = [
    { emoji: '😊', label: 'Great', color: 'hover:bg-green-50/70 dark:hover:bg-green-900/20 hover:text-green-600' },
    { emoji: '😐', label: 'Okay', color: 'hover:bg-campus-blue/10 dark:hover:bg-campus-blue/15 hover:text-campus-blue' },
    { emoji: '😔', label: 'Down', color: 'hover:bg-amber-50/70 dark:hover:bg-amber-900/20 hover:text-amber-600' },
    { emoji: '😠', label: 'Stressed', color: 'hover:bg-rose-50/70 dark:hover:bg-rose-900/20 hover:text-rose-600' },
  ];

  const displayName = user?.name || 'Student';

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 900);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <DashboardSkeleton title="Loading Student Dashboard" subtitle="Preparing your wellness overview..." />;
  }

  return (
    <StudentLayout>
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-0 space-y-6 md:space-y-8">
        <section className="relative">
          <MotionDiv initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-foreground tracking-tight uppercase italic">
              Hello, {displayName}! 👋
            </h1>
            <p className="text-muted-foreground text-xs font-bold uppercase tracking-[0.2em] mt-1">
              Welcome back to the {user?.role || 'Student'} Portal
            </p>
          </MotionDiv>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6">
          <div className="lg:col-span-12 bg-surface dark:bg-surface-elevated rounded-[2.5rem] p-5 sm:p-8 md:p-10 border border-border shadow-xl">
            <div className="flex items-center justify-between mb-8 gap-3">
              <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-campus-blue dark:text-campus-green flex items-center gap-2">
                <Heart size={14} className="text-rose-500" /> Process 1.2 // Daily Mood Tracker
              </h3>
              <span className="hidden sm:inline text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                Select your current state
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {moods.map((m) => (
                <button
                  key={m.label}
                  onClick={() => setSelectedMood(m.label)}
                  className={`flex flex-col items-center p-6 sm:p-8 md:p-12 rounded-[2.5rem] border-2 transition-all duration-300 group ${
                    selectedMood === m.label
                      ? 'bg-campus-blue border-campus-blue text-primary-foreground scale-[1.02] shadow-soft'
                      : `bg-muted/30 dark:bg-muted/20 border-border text-muted-foreground ${m.color}`
                  }`}
                >
                  <span className="text-4xl sm:text-5xl mb-4 group-hover:scale-110 transition-transform">{m.emoji}</span>
                  <span className="text-[10px] font-black uppercase tracking-widest">{m.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="lg:col-span-12 bg-surface dark:bg-surface-elevated rounded-[2.5rem] p-5 sm:p-8 md:p-10 border border-border shadow-xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 md:mb-12 gap-4">
              <div>
                <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-campus-green flex items-center gap-2">
                  <TrendingUp size={14} /> D3 // Stress Analytics
                </h3>
                <h2 className="text-2xl font-black text-foreground uppercase tracking-tighter mt-1">
                  Weekly Monitoring Trend
                </h2>
              </div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                <div className="flex items-center gap-2 bg-rose-50/70 dark:bg-rose-900/10 px-4 py-2 rounded-xl border border-rose-100/70 dark:border-rose-900/30">
                  <div className="h-2 w-2 rounded-full bg-rose-400 animate-pulse" />
                  <span className="text-[10px] font-black uppercase text-rose-500">Critical Threshold: 80%</span>
                </div>
                <button className="text-[10px] font-black uppercase tracking-widest flex items-center gap-1 text-campus-blue dark:text-campus-green hover:gap-2 transition-all">
                  Full Report <ChevronRight size={14} />
                </button>
              </div>
            </div>

            <div className="h-64 sm:h-72 flex items-end justify-between gap-2 sm:gap-3 md:gap-6 px-0 sm:px-2">
              {[40, 70, 45, 90, 65, 30, 55].map((val, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-4 group min-w-0">
                  <div className="w-full relative flex items-end justify-center">
                    <MotionDiv
                      initial={{ height: 0 }}
                      animate={{ height: `${val}%` }}
                      transition={{ duration: 1, delay: i * 0.1 }}
                      className={`w-full max-w-[48px] sm:max-w-[60px] rounded-2xl transition-all duration-300 ${
                        val > 80
                          ? 'bg-gradient-to-t from-rose-500 to-amber-400 shadow-soft'
                          : 'bg-muted dark:bg-muted group-hover:bg-campus-blue dark:group-hover:bg-campus-green'
                      }`}
                      style={{ height: `${val}%` }}
                    >
                      {val > 80 && (
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-[9px] font-black text-rose-500 whitespace-nowrap">
                          {val}% SPIKE
                        </div>
                      )}
                    </MotionDiv>
                  </div>
                  <span className="text-[10px] font-black text-muted-foreground uppercase tracking-tighter">Day {i + 1}</span>
                </div>
              ))}
            </div>

            <div className="mt-8 md:mt-12 p-4 sm:p-6 bg-muted/40 dark:bg-muted/20 rounded-3xl flex flex-col md:flex-row items-center gap-4 border border-border">
              <div className="h-12 w-12 bg-surface dark:bg-surface-elevated rounded-2xl flex items-center justify-center text-campus-blue shadow-sm shrink-0 border border-border">
                <Activity size={20} className="text-campus-green" />
              </div>
              <div className="text-center md:text-left">
                <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest mb-1">
                  System Intelligence Insight
                </p>
                <p className="text-xs font-medium text-muted-foreground italic">
                  "Your stress peaks on Day 4 correlate with high system interaction. Consider visiting the Resources library for relaxation tips."
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </StudentLayout>
  );
};

export default StudentDashboard;
