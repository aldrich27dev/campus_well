import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, AlertTriangle, CheckCircle, Bell,
  Filter, Search, TrendingUp, Shield, ArrowRight, X,
  Calendar, Lock, LayoutGrid, Clock
} from 'lucide-react';
import { Card, Button } from "../components/UI";
import AppointmentScheduler from "../components/Counselor/AppointmentScheduler";
import DashboardSkeleton from '../components/ui/Skeleton';

const MotionDiv = motion.div;

const CounselorDashboard = () => {
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isScheduling, setIsScheduling] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const activeNotifications = [
    { id: 1, student: "ALDRICH NAAG", yearLevel: '2nd Year', idNumber: "2022-00123", time: "2 mins ago", score: "94/100", details: "Critical anxiety levels detected. Follow-up required per Protocol 4.1.", risk: "High" },
    { id: 2, student: "JUAN DELA CRUZ", yearLevel: '3rd Year', idNumber: "2022-05421", time: "1 hour ago", score: "82/100", details: "Persistent low mood reported in weekly assessment.", risk: "Medium" }
  ];

  const recentMoods = [
    { student: 'Aldrich Naag', yearLevel: '2nd Year', mood: 'Stressed', tone: 'text-rose-500', bg: 'bg-rose-50/70 dark:bg-rose-500/10' },
    { student: 'Juan Dela Cruz', yearLevel: '3rd Year', mood: 'Down', tone: 'text-amber-500', bg: 'bg-amber-50/70 dark:bg-amber-500/10' },
    { student: 'Maria Clara', yearLevel: '1st Year', mood: 'Okay', tone: 'text-campus-blue', bg: 'bg-campus-blue/10 dark:bg-campus-blue/15' },
  ];

  const stats = [
    { label: 'Active Referrals', val: '12', icon: Users, color: 'text-campus-blue', bg: 'bg-campus-blue/10 dark:bg-campus-blue/15' },
    { label: 'Pending Slots', val: '04', icon: Bell, color: 'text-amber-500', bg: 'bg-amber-50/70 dark:bg-amber-500/10' },
    { label: 'Cleared Today', val: '08', icon: CheckCircle, color: 'text-campus-green', bg: 'bg-emerald-50/70 dark:bg-emerald-500/10' },
  ];

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 900);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <DashboardSkeleton title="Loading Counselor Dashboard" subtitle="Pulling student alerts and recent moods..." />;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <main className="flex-1 p-6 lg:p-12 transition-colors duration-300">
        <div className="max-w-7xl mx-auto space-y-10">
          <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-border pb-10">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-campus-blue rounded-lg text-primary-foreground shadow-soft">
                  <LayoutGrid size={18} />
                </div>
                <div className="flex flex-col">
                  <span className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.3em]">System Admin // P2.3</span>
                  <h1 className="text-4xl font-black text-campus-blue dark:text-campus-green uppercase tracking-tighter italic leading-none">
                    Case Management
                  </h1>
                </div>
              </div>
            </div>

            <div className="relative group w-full md:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-campus-blue transition-colors" size={16} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Query Student ID (D1 Access)..."
                className="w-full bg-surface dark:bg-surface-elevated border border-border rounded-2xl py-4 pl-12 pr-6 text-[11px] font-bold shadow-sm outline-none focus:ring-4 focus:ring-campus-blue/10 transition-all text-foreground"
              />
            </div>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-3 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat, i) => (
                  <Card key={i} className="group hover:border-campus-blue transition-all duration-500 overflow-hidden relative">
                    <div className={`absolute top-0 right-0 w-24 h-24 ${stat.bg} rounded-bl-full -mr-10 -mt-10 transition-transform group-hover:scale-110`} />
                    <stat.icon className={`${stat.color} mb-6 relative z-10`} size={28} />
                    <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest relative z-10">{stat.label}</p>
                    <h2 className="text-4xl font-black text-foreground mt-2 tracking-tighter relative z-10">{stat.val}</h2>
                  </Card>
                ))}
              </div>

              <Card className="p-6 md:p-8 border-none shadow-sm bg-surface dark:bg-surface-elevated rounded-[2rem]">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h3 className="text-[11px] md:text-sm font-black text-campus-blue dark:text-campus-green uppercase tracking-widest flex items-center gap-2">
                      <Users size={16} /> Recent Mood
                    </h3>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mt-1">
                      Latest student check-ins with year level
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {recentMoods.map((item) => (
                    <div key={item.student} className={`rounded-[1.5rem] border border-border p-4 ${item.bg}`}>
                      <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{item.yearLevel}</p>
                      <p className="mt-2 text-sm font-black text-foreground">{item.student}</p>
                      <p className={`mt-3 text-xs font-black uppercase italic ${item.tone}`}>{item.mood}</p>
                    </div>
                  ))}
                </div>
              </Card>

              <Card noPadding className="overflow-hidden border-rose-100/70 dark:border-rose-900/20 shadow-xl shadow-rose-500/5">
                <div className="p-8 border-b border-border flex justify-between items-center bg-muted/30 dark:bg-muted/15">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-rose-500 rounded-lg text-primary-foreground animate-pulse shadow-soft">
                      <AlertTriangle size={18} />
                    </div>
                    <div>
                      <h3 className="font-black text-foreground uppercase tracking-tighter italic">High Stress Alerts</h3>
                      <p className="text-[9px] font-bold text-rose-500 uppercase tracking-widest">Protocol 4.0 // Immediate Action Required</p>
                    </div>
                  </div>
                  <button className="p-2 text-muted-foreground hover:text-foreground"><Filter size={18} /></button>
                </div>

                <div className="divide-y divide-border bg-surface/70 dark:bg-surface-elevated/50">
                  {activeNotifications.map((notif) => (
                    <MotionDiv
                      key={notif.id}
                      whileHover={{ x: 4 }}
                      className="p-8 flex flex-col md:flex-row md:items-center justify-between hover:bg-muted/50 dark:hover:bg-muted/25 transition-all group gap-4"
                    >
                      <div className="flex items-center gap-6">
                        <div className="h-14 w-14 bg-muted dark:bg-muted rounded-2xl flex items-center justify-center font-black text-muted-foreground group-hover:bg-campus-blue group-hover:text-primary-foreground transition-all text-sm shadow-inner">
                          {notif.student?.substring(0, 2)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-black text-foreground uppercase tracking-tight">{notif.student}</p>
                            <span className="text-[8px] bg-rose-100 text-rose-600 px-2 py-0.5 rounded-full font-black uppercase">Urgent</span>
                          </div>
                          <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground mt-1">
                            {notif.yearLevel}
                          </p>
                          <div className="flex items-center gap-3 mt-1.5">
                            <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest flex items-center gap-1">
                              <Clock size={10} /> {notif.time}
                            </span>
                            <span className="text-[10px] font-black text-campus-blue dark:text-campus-green">SCORE: {notif.score}</span>
                          </div>
                        </div>
                      </div>
                      <Button variant="primary" onClick={() => setSelectedStudent(notif)} className="shadow-soft">Review Case</Button>
                    </MotionDiv>
                  ))}
                </div>
              </Card>
            </div>

            <aside className="space-y-6">
              <div className="bg-campus-blue text-primary-foreground p-8 rounded-[3rem] shadow-2xl relative overflow-hidden group">
                  <TrendingUp className="absolute -right-4 -top-4 text-primary-foreground/10 w-32 h-32 group-hover:scale-110 transition-transform duration-700" />
                  <div className="flex items-center gap-2 mb-8">
                    <Shield size={14} className="text-campus-green" />
                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary-foreground/70">AI Diagnostic (D3)</h4>
                  </div>
                  <p className="text-[12px] font-bold text-primary-foreground/90 leading-relaxed italic">"Aggregate anxiety levels are peaking in 2nd-year IT batches. Correlation suggests high project workload."</p>
                  <div className="mt-8 pt-6 border-t border-primary-foreground/10">
                    <button className="text-[9px] font-black uppercase tracking-widest text-campus-green hover:text-primary-foreground flex items-center gap-2 transition-colors">
                      Generate Full Report <ArrowRight size={10} />
                    </button>
                  </div>
              </div>
            </aside>
          </div>
        </div>
      </main>

      <AnimatePresence>
        {selectedStudent && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-sm">
            <MotionDiv initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedStudent(null)} className="absolute inset-0 bg-background/60" />
            <MotionDiv initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} className="bg-surface dark:bg-surface-elevated w-full max-w-2xl rounded-[3rem] overflow-hidden shadow-2xl relative z-10 p-10 border border-border">
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
                     <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50/70 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full">
                        <Lock size={10} />
                        <span className="text-[9px] font-black uppercase tracking-widest">Encrypted Data Store D2</span>
                     </div>
                  </div>

                  <div className="flex justify-between items-start mb-10">
                    <div>
                      <h2 className="text-4xl font-black text-campus-blue dark:text-campus-green uppercase tracking-tighter italic leading-tight">{selectedStudent.student}</h2>
                      <p className="text-muted-foreground font-bold text-xs uppercase tracking-widest mt-1">Institutional ID: {selectedStudent.idNumber}</p>
                      <p className="text-campus-green font-black text-[10px] uppercase tracking-[0.2em] mt-2">{selectedStudent.yearLevel}</p>
                    </div>
                    <button onClick={() => setSelectedStudent(null)} className="p-3 bg-muted dark:bg-muted rounded-2xl hover:text-rose-500 transition-colors"><X size={20} /></button>
                  </div>

                  <div className="space-y-6 mb-10">
                    <div className="bg-muted/40 dark:bg-muted/20 p-8 rounded-[2rem] border border-border shadow-inner">
                      <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-3">Diagnostic Context</p>
                      <p className="text-sm font-medium text-foreground italic leading-relaxed">"{selectedStudent.details}"</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                       <div className="p-5 rounded-2xl bg-rose-50/70 dark:bg-rose-500/5 border border-rose-100/80 dark:border-rose-900/20">
                          <p className="text-[9px] font-black text-rose-400 uppercase tracking-widest">Alert Level</p>
                          <p className="text-lg font-black text-rose-600 uppercase italic">Critical</p>
                       </div>
                       <div className="p-5 rounded-2xl bg-campus-blue/5 dark:bg-campus-blue/10 border border-campus-blue/10 dark:border-campus-blue/20">
                          <p className="text-[9px] font-black text-blue-400 uppercase tracking-widest">Score Aggregate</p>
                          <p className="text-lg font-black text-campus-blue dark:text-campus-green italic">{selectedStudent.score}</p>
                       </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button
                      variant="primary"
                      onClick={() => setIsScheduling(true)}
                      className="flex-1 py-5 rounded-2xl flex items-center justify-center gap-3 text-xs font-black uppercase tracking-widest shadow-soft"
                    >
                      <Calendar size={18} /> Schedule Interview (P2.4)
                    </Button>
                    <Button variant="outline" className="flex-1 py-5 rounded-2xl text-xs font-black uppercase tracking-widest" onClick={() => setSelectedStudent(null)}>
                      Dismiss Alert
                    </Button>
                  </div>
                </>
              )}
            </MotionDiv>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CounselorDashboard;
