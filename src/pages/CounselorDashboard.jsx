import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, AlertTriangle, CheckCircle, Bell, 
  Filter, Search, TrendingUp, Shield, ArrowRight, X, 
  Calendar, Lock, LayoutGrid, Clock
} from 'lucide-react';

import { Card, Button } from "../components/UI"; 
import { useSystem } from '../context/SystemContext';
// ADDED: Import the scheduler component
import AppointmentScheduler from "../components/Counselor/AppointmentScheduler";

const CounselorDashboard = () => {
  const { notifications = [] } = useSystem();
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  // ADDED: State to trigger the Scheduler view
  const [isScheduling, setIsScheduling] = useState(false);

  // Simulated Database Retrieval (Process 2.3: Active Monitoring)
  const activeNotifications = [
    { id: 1, student: "ALDRICH NAAG", idNumber: "2022-00123", time: "2 mins ago", score: "94/100", details: "Critical anxiety levels detected. Follow-up required per Protocol 4.1.", risk: "High" },
    { id: 2, student: "JUAN DELA CRUZ", idNumber: "2022-05421", time: "1 hour ago", score: "82/100", details: "Persistent low mood reported in weekly assessment.", risk: "Medium" }
  ];

  const stats = [
    { label: 'Active Referrals', val: '12', icon: Users, color: 'text-[#1e3a8a]', bg: 'bg-blue-50 dark:bg-blue-500/10' },
    { label: 'Pending Slots', val: '04', icon: Bell, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-500/10' },
    { label: 'Cleared Today', val: '08', icon: CheckCircle, color: 'text-[#92c37c]', bg: 'bg-emerald-50 dark:bg-emerald-500/10' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col font-sans">
      <main className="flex-1 p-6 lg:p-12 transition-colors duration-300">
        <div className="max-w-7xl mx-auto space-y-10">
          
          {/* Enhanced Header with Process Labels */}
          <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-slate-200 dark:border-slate-800 pb-10">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#1e3a8a] rounded-lg text-white shadow-lg shadow-blue-500/20">
                  <LayoutGrid size={18} />
                </div>
                <div className="flex flex-col">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">System Admin // P2.3</span>
                  <h1 className="text-4xl font-black text-[#1e3a8a] dark:text-white uppercase tracking-tighter italic leading-none">
                    Case Management
                  </h1>
                </div>
              </div>
            </div>

            <div className="relative group w-full md:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#1e3a8a] transition-colors" size={16} />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Query Student ID (D1 Access)..." 
                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl py-4 pl-12 pr-6 text-[11px] font-bold shadow-sm outline-none focus:ring-4 focus:ring-[#1e3a8a]/10 transition-all dark:text-white" 
              />
            </div>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-3 space-y-8">
              
              {/* Stats Grid with Interactive Feel */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat, i) => (
                  <Card key={i} className="group hover:border-[#1e3a8a] transition-all duration-500 overflow-hidden relative">
                    <div className={`absolute top-0 right-0 w-24 h-24 ${stat.bg} rounded-bl-full -mr-10 -mt-10 transition-transform group-hover:scale-110`} />
                    <stat.icon className={`${stat.color} mb-6 relative z-10`} size={28} />
                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest relative z-10">{stat.label}</p>
                    <h2 className="text-4xl font-black text-slate-800 dark:text-white mt-2 tracking-tighter relative z-10">{stat.val}</h2>
                  </Card>
                ))}
              </div>

              {/* Alert Table Area */}
              <Card noPadding className="overflow-hidden border-rose-100 dark:border-rose-900/20 shadow-xl shadow-rose-500/5">
                <div className="p-8 border-b border-slate-50 dark:border-slate-800 flex justify-between items-center bg-white dark:bg-slate-900">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-rose-500 rounded-lg text-white animate-pulse shadow-lg shadow-rose-500/40">
                      <AlertTriangle size={18} />
                    </div>
                    <div>
                      <h3 className="font-black text-slate-800 dark:text-white uppercase tracking-tighter italic">High Stress Alerts</h3>
                      <p className="text-[9px] font-bold text-rose-500 uppercase tracking-widest">Protocol 4.0 // Immediate Action Required</p>
                    </div>
                  </div>
                  <button className="p-2 text-slate-400 hover:text-slate-600"><Filter size={18} /></button>
                </div>
                
                <div className="divide-y divide-slate-50 dark:divide-slate-800 bg-white/50 dark:bg-slate-900/50">
                  {activeNotifications.map((notif) => (
                    <motion.div 
                      key={notif.id} 
                      whileHover={{ x: 4 }}
                      className="p-8 flex flex-col md:flex-row md:items-center justify-between hover:bg-white dark:hover:bg-slate-800 transition-all group gap-4"
                    >
                      <div className="flex items-center gap-6">
                        <div className="h-14 w-14 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center font-black text-slate-400 group-hover:bg-[#1e3a8a] group-hover:text-white transition-all text-sm shadow-inner">
                          {notif.student?.substring(0, 2)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-tight">{notif.student}</p>
                            <span className="text-[8px] bg-rose-100 text-rose-600 px-2 py-0.5 rounded-full font-black uppercase">Urgent</span>
                          </div>
                          <div className="flex items-center gap-3 mt-1.5">
                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-1">
                              <Clock size={10} /> {notif.time}
                            </span>
                            <span className="text-[10px] font-black text-[#1e3a8a] dark:text-blue-400">SCORE: {notif.score}</span>
                          </div>
                        </div>
                      </div>
                      <Button variant="primary" onClick={() => setSelectedStudent(notif)} className="shadow-lg shadow-blue-500/10">Review Case</Button>
                    </motion.div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Sidebar Insights */}
            <aside className="space-y-6">
              <div className="bg-[#1e3a8a] text-white p-8 rounded-[3rem] shadow-2xl relative overflow-hidden group">
                  <TrendingUp className="absolute -right-4 -top-4 text-white/5 w-32 h-32 group-hover:scale-110 transition-transform duration-700" />
                  <div className="flex items-center gap-2 mb-8">
                    <Shield size={14} className="text-blue-300" />
                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-200/60">AI Diagnostic (D3)</h4>
                  </div>
                  <p className="text-[12px] font-bold text-blue-50 leading-relaxed italic">"Aggregate anxiety levels are peaking in 2nd-year IT batches. Correlation suggests high project workload."</p>
                  <div className="mt-8 pt-6 border-t border-white/10">
                    <button className="text-[9px] font-black uppercase tracking-widest text-blue-300 hover:text-white flex items-center gap-2 transition-colors">
                      Generate Full Report <ArrowRight size={10} />
                    </button>
                  </div>
              </div>
            </aside>
          </div>
        </div>
      </main>

      {/* Enhanced Modal (Process 2.4 Transition) */}
      <AnimatePresence>
        {selectedStudent && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedStudent(null)} className="absolute inset-0 bg-slate-900/60" />
            <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-[3rem] overflow-hidden shadow-2xl relative z-10 p-10 border border-slate-100 dark:border-slate-800">
              
              {/* ADDED: Scheduler view overlay inside the modal area when triggered */}
              {isScheduling ? (
                <AppointmentScheduler 
                  studentContext={selectedStudent} 
                  onClose={() => {
                    setIsScheduling(false);
                    setSelectedStudent(null);
                  }}
                />
              ) : (
                <>
                  <div className="flex items-center gap-2 mb-6">
                     <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full">
                        <Lock size={10} />
                        <span className="text-[9px] font-black uppercase tracking-widest">Encrypted Data Store D2</span>
                     </div>
                  </div>

                  <div className="flex justify-between items-start mb-10">
                    <div>
                      <h2 className="text-4xl font-black text-[#1e3a8a] dark:text-white uppercase tracking-tighter italic leading-tight">{selectedStudent.student}</h2>
                      <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-1">Institutional ID: {selectedStudent.idNumber}</p>
                    </div>
                    <button onClick={() => setSelectedStudent(null)} className="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl hover:text-rose-500 transition-colors"><X size={20} /></button>
                  </div>

                  <div className="space-y-6 mb-10">
                    <div className="bg-slate-50 dark:bg-slate-800/50 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800/50 shadow-inner">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Diagnostic Context</p>
                      <p className="text-sm font-medium text-slate-600 dark:text-slate-300 italic leading-relaxed">"{selectedStudent.details}"</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                       <div className="p-5 rounded-2xl bg-rose-50 dark:bg-rose-500/5 border border-rose-100 dark:border-rose-900/20">
                          <p className="text-[9px] font-black text-rose-400 uppercase tracking-widest">Alert Level</p>
                          <p className="text-lg font-black text-rose-600 uppercase italic">Critical</p>
                       </div>
                       <div className="p-5 rounded-2xl bg-blue-50 dark:bg-blue-500/5 border border-blue-100 dark:border-blue-900/20">
                          <p className="text-[9px] font-black text-blue-400 uppercase tracking-widest">Score Aggregate</p>
                          <p className="text-lg font-black text-[#1e3a8a] dark:text-blue-400 italic">{selectedStudent.score}</p>
                       </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4">
                    {/* UPDATED: Added onClick to set scheduling state */}
                    <Button 
                      variant="primary" 
                      onClick={() => setIsScheduling(true)}
                      className="flex-1 py-5 rounded-2xl flex items-center justify-center gap-3 text-xs font-black uppercase tracking-widest shadow-xl shadow-blue-500/20"
                    >
                      <Calendar size={18} /> Schedule Interview (P2.4)
                    </Button>
                    <Button variant="outline" className="flex-1 py-5 rounded-2xl text-xs font-black uppercase tracking-widest" onClick={() => setSelectedStudent(null)}>
                      Dismiss Alert
                    </Button>
                  </div>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CounselorDashboard;