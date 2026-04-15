import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, Video, Users, Send, CheckCircle, Heart, Loader2 } from 'lucide-react';
import { useSystem } from '../context/SystemContext';

const Appointments = () => {
  const [issubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [mode, setMode] = useState('virtual');
  const [message, setMessage] = useState('');
  
  // New States for Validation
  const [date, setDate] = useState('');
  const [time, setTime] = useState('09:00 AM - 10:00 AM');
  
  const navigate = useNavigate();
  const { user } = useSystem();

  // Logic to prevent submission if date is empty
  const isFormInvalid = !date || !time;

  const handleBooking = async () => {
    if (isFormInvalid) return;
    
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsSubmitting(false);
    setSubmitted(true);
  };

  return (
    <main className="py-6 md:py-12 px-4 min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <div className="max-w-4xl mx-auto">
        
        <header className="mb-8 md:mb-10 text-center lg:text-left">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-3xl md:text-5xl font-black text-[#1e3a8a] dark:text-white uppercase tracking-tighter italic">
              Schedule Support
            </h1>
            <p className="text-slate-400 mt-2 font-black text-[10px] uppercase tracking-[0.3em]">
              Professional Wellness Intake Portal
            </p>
          </motion.div>
        </header>

        <AnimatePresence mode="wait">
          {!submitted ? (
            <motion.div 
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden"
            >
              <div className="p-6 md:p-10 space-y-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                  
                  {/* Left: Selectors */}
                  <div className="space-y-6">
                    <div>
                      <label className="block text-[10px] font-black uppercase text-slate-400 mb-4 tracking-[0.2em]">Access Method</label>
                      <div className="grid grid-cols-2 gap-3">
                        {[ { id: 'virtual', label: 'Virtual', icon: Video }, { id: 'in-person', label: 'In-Person', icon: Users }].map((item) => (
                          <button 
                            key={item.id}
                            onClick={() => setMode(item.id)}
                            className={`flex items-center justify-center gap-2 p-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${
                              mode === item.id 
                              ? 'bg-[#1e3a8a] text-white shadow-lg shadow-blue-500/20' 
                              : 'bg-slate-50 dark:bg-slate-800 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
                            }`}
                          >
                            <item.icon size={16} /> {item.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <label className="block text-[10px] font-black uppercase text-slate-400 mb-1 tracking-widest">
                        Appointment Details <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-[#1e3a8a]" size={18} />
                        <input 
                          type="date" 
                          required
                          value={date}
                          onChange={(e) => setDate(e.target.value)}
                          className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl p-4 pl-12 text-sm font-bold focus:ring-2 ring-blue-500 outline-none dark:text-white" 
                        />
                      </div>
                      <div className="relative">
                        <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#1e3a8a]" size={18} />
                        <select 
                          value={time}
                          onChange={(e) => setTime(e.target.value)}
                          className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl p-4 pl-12 text-sm font-bold focus:ring-2 ring-blue-500 outline-none dark:text-white appearance-none cursor-pointer"
                        >
                          <option value="09:00 AM - 10:00 AM">09:00 AM - 10:00 AM</option>
                          <option value="10:30 AM - 11:30 AM">10:30 AM - 11:30 AM</option>
                          <option value="02:00 PM - 03:00 PM">02:00 PM - 03:00 PM</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Right: Message Area */}
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2 mb-4">
                      <Heart size={16} className="text-rose-500" />
                      <label className="block text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">Tell us how you feel</label>
                    </div>
                    <textarea 
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Share your thoughts here..."
                      className="flex-grow w-full min-h-[160px] bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl p-5 text-sm font-medium focus:ring-2 ring-[#1e3a8a] outline-none dark:text-white resize-none shadow-inner"
                    />
                  </div>
                </div>

                {/* Bottom Center Button */}
                <div className="flex flex-col items-center gap-3 pt-4">
                  <button 
                    onClick={handleBooking}
                    disabled={issubmitting || isFormInvalid}
                    className="w-full md:w-80 bg-[#1e3a8a] text-white py-5 rounded-2xl font-black text-xs uppercase tracking-[0.3em] shadow-2xl flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-30 disabled:grayscale disabled:cursor-not-allowed"
                  >
                    {issubmitting ? (
                      <Loader2 className="animate-spin" size={20} />
                    ) : (
                      <><Send size={18} /> Process Booking</>
                    )}
                  </button>
                  {isFormInvalid && !issubmitting && (
                    <p className="text-[9px] font-black uppercase tracking-widest text-rose-500 animate-pulse">
                      Please select a preferred date to continue
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="success"
              initial={{ scale: 0.9, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }} 
              className="bg-white dark:bg-slate-900 rounded-[3rem] p-10 md:p-20 text-center shadow-2xl border border-slate-100 dark:border-slate-800"
            >
              <div className="h-20 w-20 bg-green-500 text-white rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-lg">
                <CheckCircle size={40} />
              </div>
              <h2 className="text-3xl font-black italic uppercase tracking-tighter dark:text-white">Confirmed</h2>
              <p className="text-slate-400 mt-4 font-bold text-sm max-w-xs mx-auto">
                Your appointment is sent.
              </p>
              <button 
                onClick={() => navigate('/student/dashboard')}
                className="mt-10 bg-slate-900 dark:bg-white dark:text-slate-900 text-white px-10 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:opacity-80 transition-all"
              >
                Go Back
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
};

export default Appointments;