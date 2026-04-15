import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Clock, Video, Users, MessageSquare, Send, CheckCircle } from 'lucide-react';
import { useSystem } from '../context/SystemContext';

const Appointments = () => {
  const [submitted, setSubmitted] = useState(false);
  const [mode, setMode] = useState('virtual');
  const navigate = useNavigate();
  const { user } = useSystem();

  return (
    /* REMOVED <StudentLayout> - App.jsx handles the Navbar now */
    <main className="py-10 px-4 min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="max-w-4xl mx-auto">
        <header className="mb-10">
          <h1 className="text-4xl font-black text-[#1e3a8a] dark:text-white uppercase tracking-tighter italic">Schedule Support</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium tracking-tight">Connect with a GRC counselor for a private session.</p>
        </header>

        {!submitted ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 lg:p-12 shadow-xl border border-slate-100 dark:border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-12"
          >
            {/* Form Side */}
            <div className="space-y-6">
              <div>
                <label className="block text-[10px] font-black uppercase text-slate-400 mb-3 tracking-[0.2em]">Process 1.1: Select Mode</label>
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={() => setMode('virtual')}
                    className={`flex items-center justify-center gap-3 p-4 rounded-2xl font-bold text-sm transition-all ${
                      mode === 'virtual' 
                      ? 'bg-[#1e3a8a] text-white shadow-lg shadow-blue-500/20' 
                      : 'bg-slate-50 dark:bg-slate-800 text-slate-400'
                    }`}
                  >
                    <Video size={18} /> Virtual
                  </button>
                  <button 
                    onClick={() => setMode('in-person')}
                    className={`flex items-center justify-center gap-3 p-4 rounded-2xl font-bold text-sm transition-all ${
                      mode === 'in-person' 
                      ? 'bg-[#1e3a8a] text-white shadow-lg shadow-blue-500/20' 
                      : 'bg-slate-50 dark:bg-slate-800 text-slate-400'
                    }`}
                  >
                    <Users size={18} /> In-Person
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase text-slate-400 mb-3 tracking-widest">Process 1.2: Date & Time</label>
                <div className="space-y-3">
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                      type="date" 
                      className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl p-4 pl-12 text-sm font-bold focus:ring-2 ring-[#1e3a8a] outline-none dark:text-white" 
                    />
                  </div>
                  <div className="relative">
                    <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <select className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl p-4 pl-12 text-sm font-bold focus:ring-2 ring-[#1e3a8a] outline-none dark:text-white appearance-none">
                      <option>09:00 AM - 10:00 AM</option>
                      <option>10:30 AM - 11:30 AM</option>
                      <option>02:00 PM - 03:00 PM</option>
                      <option>03:30 PM - 04:30 PM</option>
                    </select>
                  </div>
                </div>
              </div>

              <button 
                onClick={() => setSubmitted(true)}
                className="w-full bg-[#1e3a8a] text-white py-5 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl flex items-center justify-center gap-3 hover:scale-[1.02] transition-transform"
              >
                <Send size={18} /> Submit Request
              </button>
            </div>

            {/* Info Side - DFD Reference */}
            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-[2rem] p-8 flex flex-col justify-between border border-slate-100 dark:border-slate-800">
              <div className="space-y-8">
                <div className="flex gap-4">
                  <div className="h-12 w-12 bg-[#92c37c]/20 text-[#92c37c] rounded-2xl flex items-center justify-center shrink-0">
                    <MessageSquare size={22} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 dark:text-white uppercase text-xs tracking-tight">FDD Note</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed font-medium">
                      This module fulfills the <span className="text-slate-700 dark:text-slate-300 font-bold">Appointment Scheduling</span> function defined in the FDD hierarchy.
                    </p>
                  </div>
                </div>
                
                <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
                  <p className="text-[10px] font-black text-[#1e3a8a] uppercase tracking-widest mb-2">DFD Level 1: Process 1.5</p>
                    <p className="text-[11px] text-slate-400 font-mono leading-relaxed">
                    [Student] -{' '}(Request) -{' '}&gt; <br/>
                    [Validate] -{' '}(Save) -{' '}&gt; <br/>
                    [DB: Appointments]
                    </p>
                </div>
              </div>

              <div className="mt-8">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">CampusWell Analytics v4.0</p>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }} 
            animate={{ scale: 1, opacity: 1 }} 
            className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 p-16 text-center shadow-2xl"
          >
              <div className="h-24 w-24 bg-green-100 dark:bg-green-900/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-8">
               <CheckCircle size={44} />
              </div>
              <h2 className="text-4xl font-black italic uppercase tracking-tighter dark:text-white">Request Logged</h2>
              <p className="text-slate-500 dark:text-slate-400 mt-4 max-w-sm mx-auto font-medium leading-relaxed">
               {user?.name?.split(' ')[0] || 'Aldrich'}, the DFD flow has completed. Your request is stored in <span className="text-[#1e3a8a] font-bold">D4: ReferralsDB</span>.
              </p>
              <button 
               onClick={() => navigate('/student/dashboard')}
               className="mt-12 bg-slate-900 dark:bg-white dark:text-slate-900 text-white px-10 py-4 rounded-2xl font-black uppercase text-xs tracking-[0.2em] hover:opacity-90 transition-opacity"
              >
                Return to Dashboard
              </button>
          </motion.div>
        )}
      </div>
    </main>
  );
};

export default Appointments;