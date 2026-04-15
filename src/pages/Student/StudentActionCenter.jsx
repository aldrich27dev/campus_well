import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, Calendar, Clock, MapPin, CheckCircle2, 
  AlertCircle, ArrowRight, X, MessageSquare, Info 
} from 'lucide-react';
import { Card, Button } from "../../components/UI";
import { useSystem } from '../../context/SystemContext';

const StudentActionCenter = () => {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);

  // Mock Data: This represents the data flow from Counselor (P2.4) -> D2 -> Student (P1.3)
  const appointment = {
    id: "APT-2026-004",
    counselor: "Ms. Sarah Reyes (Guidance)",
    date: "April 22, 2026",
    time: "01:30 PM",
    venue: "Guidance Office - Room 102",
    type: "Face-to-Face Interview",
    priority: "High"
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6 lg:p-12 transition-colors duration-300">
      <div className="max-w-4xl mx-auto space-y-10">
        
        {/* Header Section */}
        <header className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Process 1.3 // Schedule Management</span>
          </div>
          <h1 className="text-4xl font-black text-[#1e3a8a] dark:text-white uppercase italic tracking-tighter leading-none">
            Action Center
          </h1>
        </header>

        {/* Status Tracker (Aligns with your Flowchart) */}
        <div className="grid grid-cols-3 gap-4">
          {['Assessment', 'Review', 'Action'].map((step, i) => (
            <div key={step} className="flex flex-col gap-2">
              <div className={`h-1.5 rounded-full ${i <= 2 ? 'bg-emerald-500 shadow-lg shadow-emerald-500/20' : 'bg-slate-200'}`} />
              <span className={`text-[9px] font-black uppercase tracking-widest ${i === 2 ? 'text-emerald-500' : 'text-slate-400'}`}>
                {step}
              </span>
            </div>
          ))}
        </div>

        {/* Main Appointment Card */}
        {!isConfirmed ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card noPadding className="overflow-hidden border-none shadow-2xl bg-white dark:bg-slate-900 rounded-[3rem]">
              <div className="bg-[#1e3a8a] p-10 text-white relative overflow-hidden">
                <Bell className="absolute -right-6 -top-6 w-40 h-40 text-white/10 rotate-12" />
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                  <div>
                    <div className="flex items-center gap-2 mb-4 bg-white/10 w-fit px-3 py-1 rounded-full border border-white/20">
                      <AlertCircle size={14} className="text-amber-400" />
                      <span className="text-[9px] font-black uppercase tracking-[0.1em]">Urgent: Consultation Request</span>
                    </div>
                    <h2 className="text-3xl font-black uppercase italic tracking-tight leading-tight">Session Invitation</h2>
                    <p className="text-blue-200/80 text-xs font-bold mt-2 max-w-md">
                      The Guidance Office has scheduled a follow-up session based on your CampusWell wellness score.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-10 grid md:grid-cols-2 gap-10">
                <div className="space-y-8">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-blue-50 dark:bg-blue-500/10 rounded-2xl text-[#1e3a8a] dark:text-blue-400">
                      <Calendar size={20} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Date & Time</p>
                      <p className="text-sm font-black text-slate-800 dark:text-white">{appointment.date}</p>
                      <p className="text-xs font-bold text-slate-500">{appointment.time}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-emerald-50 dark:bg-emerald-500/10 rounded-2xl text-emerald-600">
                      <MapPin size={20} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Venue & Mode</p>
                      <p className="text-sm font-black text-slate-800 dark:text-white">{appointment.venue}</p>
                      <p className="text-xs font-bold text-slate-500">{appointment.type}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800/50 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <Info size={14} className="text-[#1e3a8a]" />
                      <span className="text-[10px] font-black text-[#1e3a8a] dark:text-blue-400 uppercase tracking-widest">Counselor Note</span>
                    </div>
                    <p className="text-xs font-medium text-slate-600 dark:text-slate-300 italic leading-relaxed">
                      "Hi Aldrich, I noticed some high stress indicators in your last assessment. Let's have a quick chat to discuss some stress management techniques for IT students."
                    </p>
                  </div>
                  <div className="mt-8 flex flex-col gap-3">
                    <Button variant="primary" className="w-full py-4 rounded-2xl text-[10px] uppercase font-black tracking-widest flex items-center justify-center gap-2 shadow-xl shadow-blue-500/20" onClick={() => setShowConfirmModal(true)}>
                      Confirm Attendance <CheckCircle2 size={16} />
                    </Button>
                    <button className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] hover:text-rose-500 transition-colors py-2">
                      Request Reschedule
                    </button>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        ) : (
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
            <Card className="p-12 text-center border-emerald-100 bg-emerald-50/30 dark:bg-emerald-500/5 rounded-[3rem]">
              <div className="h-20 w-20 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-emerald-500/30">
                <CheckCircle2 size={40} />
              </div>
              <h2 className="text-2xl font-black text-slate-800 dark:text-white uppercase italic tracking-tighter">Attendance Confirmed</h2>
              <p className="text-sm font-bold text-slate-500 mt-2">D2 WellnessDB successfully updated. Your counselor has been notified.</p>
              <Button variant="outline" className="mt-8 px-10" onClick={() => setIsConfirmed(false)}>View Details</Button>
            </Card>
          </motion.div>
        )}

        {/* DFD Visualizer (For your defense walkthrough) */}
        <div className="p-8 rounded-[2.5rem] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
          <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
             Backend Data Flow Logic
          </h4>
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4 text-[11px] font-bold">
            <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 text-[#1e3a8a] rounded-xl">
               <span className="opacity-50">FROM:</span> Counselor P2.4
            </div>
            <ArrowRight className="text-slate-300 hidden md:block" />
            <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 rounded-xl">
               <span className="opacity-50">STORE:</span> D2 WellnessDB
            </div>
            <ArrowRight className="text-slate-300 hidden md:block" />
            <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-600 rounded-xl">
               <span className="opacity-50">VIEW:</span> Student P1.3
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {showConfirmModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-md">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-950/40" />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white dark:bg-slate-900 w-full max-w-md rounded-[2.5rem] overflow-hidden shadow-2xl relative z-10 p-10 text-center">
              <h3 className="text-xl font-black text-slate-800 dark:text-white uppercase italic tracking-tighter mb-4">Confirm Attendance?</h3>
              <p className="text-xs font-bold text-slate-500 leading-relaxed mb-8">
                Confirming means you will attend the session on <span className="text-[#1e3a8a]">{appointment.date}</span> at <span className="text-[#1e3a8a]">{appointment.time}</span>.
              </p>
              <div className="flex flex-col gap-3">
                <Button variant="primary" className="py-4" onClick={() => { setIsConfirmed(true); setShowConfirmModal(false); }}>
                  Yes, I will attend
                </Button>
                <Button variant="outline" className="py-4" onClick={() => setShowConfirmModal(false)}>
                  Cancel
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default StudentActionCenter;