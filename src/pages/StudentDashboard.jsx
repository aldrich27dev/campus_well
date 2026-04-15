import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Info, ChevronRight, Activity, TrendingUp } from 'lucide-react';
import StudentLayout from '../layouts/StudentLayout';
import { useSystem } from '../context/SystemContext';


const StudentDashboard = () => {
  const [selectedMood, setSelectedMood] = useState(null);
  const { user } = useSystem();

  const moods = [
    { emoji: '😊', label: 'Great', color: 'hover:bg-green-50 dark:hover:bg-green-900/20 hover:text-green-600' },
    { emoji: '😐', label: 'Okay', color: 'hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600' },
    { emoji: '😔', label: 'Down', color: 'hover:bg-yellow-50 dark:hover:bg-yellow-900/20 hover:text-yellow-600' },
    { emoji: '😠', label: 'Stressed', color: 'hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600' },
  ];
      const displayName = user?.name || "User";

  return (
    <StudentLayout>
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Welcome Header */}
        <section className="relative">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight uppercase italic">
            Hello, {displayName}! 👋
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-[0.2em] mt-1">
            Welcome back to the {user?.role || 'Student'} Portal
          </p>
            <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">
              System Health: <span className="text-[#92c37c] font-bold uppercase tracking-widest text-[10px]">Active</span> • Your wellness data is synchronized.
            </p>
          </motion.div>
        </section>

        <div className="grid grid-cols-12 gap-6">
          
          {/* Mood Input Card (Process 1.2) - Now Full Width Top */}
          <div className="col-span-12 bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 md:p-10 border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none">
            <div className="flex items-center justify-between mb-8">
               <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-[#1e3a8a] dark:text-blue-400 flex items-center gap-2">
                 <Heart size={14} className="text-red-500" /> Process 1.2 // Daily Mood Tracker
               </h3>
               <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Select your current state</span>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {moods.map((m) => (
                <button
                  key={m.label}
                  onClick={() => setSelectedMood(m.label)}
                  className={`flex flex-col items-center p-8 md:p-12 rounded-[2.5rem] border-2 transition-all duration-300 group ${
                    selectedMood === m.label 
                    ? 'bg-[#1e3a8a] border-[#1e3a8a] text-white scale-105 shadow-lg shadow-blue-500/20' 
                    : `bg-slate-50 dark:bg-slate-800/50 border-transparent text-slate-500 ${m.color}`
                  }`}
                >
                  <span className="text-5xl mb-4 group-hover:scale-110 transition-transform">{m.emoji}</span>
                  <span className="text-[10px] font-black uppercase tracking-widest">{m.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Stress Monitoring Trend (Process 1.6) - Now Primary Focus */}
          <div className="col-span-12 bg-white dark:bg-slate-900 rounded-[2.5rem] p-10 border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-4">
              <div>
                <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-[#92c37c] flex items-center gap-2">
                  <TrendingUp size={14} /> D3 // Stress Analytics
                </h3>
                <h2 className="text-2xl font-black dark:text-white uppercase tracking-tighter mt-1">Weekly Monitoring Trend</h2>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 bg-red-50 dark:bg-red-900/10 px-4 py-2 rounded-xl">
                   <div className="h-2 w-2 rounded-full bg-red-400 animate-pulse"></div>
                   <span className="text-[10px] font-black uppercase text-red-500">Critical Threshold: 80%</span>
                </div>
                <button className="text-[10px] font-black uppercase tracking-widest flex items-center gap-1 text-[#1e3a8a] dark:text-blue-400 hover:gap-2 transition-all">
                  Full Report <ChevronRight size={14} />
                </button>
              </div>
            </div>
            
            {/* Charts Area */}
            <div className="h-72 flex items-end justify-between gap-3 md:gap-6 px-2">
              {[40, 70, 45, 90, 65, 30, 55].map((val, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-4 group">
                  <div className="w-full relative flex items-end justify-center">
                    <motion.div 
                      initial={{ height: 0 }} 
                      animate={{ height: `${val}%` }}
                      transition={{ duration: 1, delay: i * 0.1 }}
                      className={`w-full max-w-[60px] rounded-2xl transition-all duration-300 ${
                        val > 80 
                        ? 'bg-gradient-to-t from-red-500 to-orange-400 shadow-lg shadow-red-500/20' 
                        : 'bg-slate-100 dark:bg-slate-800 group-hover:bg-[#1e3a8a] group-hover:shadow-lg group-hover:shadow-blue-500/20'
                      }`}
                      style={{ height: `${val}%` }}
                    >
                      {val > 80 && (
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-[9px] font-black text-red-500 whitespace-nowrap">
                          {val}% SPIKE
                        </div>
                      )}
                    </motion.div>
                  </div>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Day {i+1}</span>
                </div>
              ))}
            </div>

            {/* AI Insight Box */}
            <div className="mt-12 p-6 bg-slate-50 dark:bg-slate-800/50 rounded-3xl flex flex-col md:flex-row items-center gap-4 border border-slate-100 dark:border-slate-800">
               <div className="h-12 w-12 bg-white dark:bg-slate-900 rounded-2xl flex items-center justify-center text-[#1e3a8a] shadow-sm shrink-0">
                 <Activity size={20} className="text-[#92c37c]" />
               </div>
               <div className="text-center md:text-left">
                 <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">System Intelligence Insight</p>
                 <p className="text-xs font-medium text-slate-500 dark:text-slate-400 italic">
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