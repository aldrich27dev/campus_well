import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar as CalendarIcon, Clock, Video, MapPin, 
  X, CheckCircle, Info, ChevronRight, Save 
} from 'lucide-react';
import { Card, Button } from "../../components/UI";
import { useSystem } from '../../context/SystemContext';

const AppointmentScheduler = ({ studentContext, onClose }) => {
  const { addNotification } = useSystem();
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [sessionType, setSessionType] = useState('Face-to-Face');
  
  // Custom UI States (Replacing window alerts)
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  const timeSlots = ["08:00 AM", "09:30 AM", "11:00 AM", "01:30 PM", "03:00 PM", "04:30 PM"];
  const dates = [
    { day: "Mon", date: "20" }, { day: "Tue", date: "21" },
    { day: "Wed", date: "22" }, { day: "Thu", date: "23" }, { day: "Fri", date: "24" },
  ];

  const handleFinalize = () => {
    setIsProcessing(true);
    
    // Simulate D2 WellnessDB Update
    setTimeout(() => {
      const appointmentData = {
        studentId: studentContext.id,
        date: `April ${selectedDate}, 2026`,
        time: selectedTime,
        type: sessionType
      };

      addNotification(
        studentContext.name, 
        `Appointment Scheduled: ${appointmentData.date} at ${appointmentData.time}`
      );

      setIsProcessing(false);
      setShowSuccessToast(true);
      
      // Auto-close after 2 seconds
      setTimeout(() => {
        setShowSuccessToast(false);
        onClose(); 
      }, 2000);
    }, 800);
  };

  return (
    <div className="relative h-full flex flex-col bg-white dark:bg-slate-900 rounded-[2.5rem] overflow-hidden">
      
      {/* 1. COMPACT HEADER */}
      <header className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
        <div>
          <span className="text-[9px] font-black text-[#1e3a8a] dark:text-blue-400 uppercase tracking-[0.2em]">Process 2.4 // Scheduling</span>
          <h2 className="text-xl font-black text-slate-800 dark:text-white uppercase italic tracking-tighter">Session Setup</h2>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors">
          <X size={20} className="text-slate-400" />
        </button>
      </header>

      {/* 2. RESPONSIVE SCROLL AREA */}
      <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
        
        {/* Student Context Strip (Mobile Friendly) */}
        <div className="flex items-center gap-3 p-4 bg-blue-50 dark:bg-blue-500/5 rounded-2xl border border-blue-100 dark:border-blue-800/30">
          <div className="h-10 w-10 bg-[#1e3a8a] rounded-xl flex items-center justify-center text-white font-black text-xs">
            {studentContext.student?.substring(0, 2)}
          </div>
          <div>
            <p className="text-[10px] font-black text-[#1e3a8a] dark:text-blue-400 uppercase tracking-widest">{studentContext.student}</p>
            <p className="text-[9px] text-slate-500 font-bold uppercase tracking-tighter italic">{studentContext.idNumber}</p>
          </div>
        </div>

        {/* Date & Time Selection Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Date Picker */}
          <section>
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] mb-4 flex items-center gap-2">
              <CalendarIcon size={12} /> Appointment Date
            </h4>
            <div className="grid grid-cols-5 gap-2">
              {dates.map((d) => (
                <button
                  key={d.date}
                  onClick={() => setSelectedDate(d.date)}
                  className={`py-3 rounded-xl border-2 transition-all flex flex-col items-center ${
                    selectedDate === d.date 
                    ? 'border-[#1e3a8a] bg-[#1e3a8a] text-white shadow-lg shadow-blue-500/20' 
                    : 'border-slate-50 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800 text-slate-400 hover:border-slate-200'
                  }`}
                >
                  <span className="text-[8px] font-black uppercase mb-1">{d.day}</span>
                  <span className="text-sm font-black">{d.date}</span>
                </button>
              ))}
            </div>
          </section>

          {/* Time Picker */}
          <section>
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] mb-4 flex items-center gap-2">
              <Clock size={12} /> Selected Slot
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {timeSlots.map((slot) => (
                <button
                  key={slot}
                  onClick={() => setSelectedTime(slot)}
                  className={`py-3 px-2 rounded-xl border font-black text-[10px] transition-all ${
                    selectedTime === slot 
                    ? 'bg-[#1e3a8a]/10 border-[#1e3a8a] text-[#1e3a8a] dark:text-blue-400' 
                    : 'border-slate-100 dark:border-slate-800 text-slate-400 dark:text-slate-500 hover:bg-white dark:hover:bg-slate-700'
                  }`}
                >
                  {slot}
                </button>
              ))}
            </div>
          </section>
        </div>

        {/* Session Type */}
        <section>
          <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] mb-4">Delivery Mode</h4>
          <div className="flex flex-col sm:flex-row gap-3">
            {[
              { id: 'Face-to-Face', icon: MapPin, label: 'On-Campus' },
              { id: 'Virtual', icon: Video, label: 'Virtual Meet' }
            ].map((mode) => (
              <button
                key={mode.id}
                onClick={() => setSessionType(mode.id)}
                className={`flex-1 p-4 rounded-2xl flex items-center gap-3 border transition-all ${
                  sessionType === mode.id 
                  ? 'border-[#1e3a8a] bg-[#1e3a8a]/5 text-[#1e3a8a] dark:text-blue-400 font-black' 
                  : 'border-slate-100 dark:border-slate-800 text-slate-400 font-bold'
                }`}
              >
                <mode.icon size={16} />
                <span className="text-xs uppercase tracking-tight">{mode.label}</span>
              </button>
            ))}
          </div>
        </section>
      </div>

      {/* 3. FIXED FOOTER ACTION */}
      <footer className="p-6 bg-slate-50 dark:bg-slate-800/30 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-4">
        <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-400">
          <span>April {selectedDate || '--'} // {selectedTime || '--'}</span>
          <span className="text-[#1e3a8a] dark:text-blue-400">{sessionType}</span>
        </div>
        
        <Button 
          variant="primary" 
          className="w-full py-4 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] shadow-xl shadow-blue-500/20 disabled:opacity-50"
          onClick={handleFinalize}
          disabled={!selectedDate || !selectedTime || isProcessing}
        >
          {isProcessing ? 'Updating D2 WellnessDB...' : 'Finalize Appointment'}
        </Button>
      </footer>

      {/* 4. SUCCESS TOAST (Replacing window.alert) */}
      <AnimatePresence>
        {showSuccessToast && (
          <motion.div 
            initial={{ y: 50, opacity: 0 }} 
            animate={{ y: 0, opacity: 1 }} 
            exit={{ y: 50, opacity: 0 }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 bg-emerald-500 text-white px-6 py-3 rounded-full flex items-center gap-3 shadow-2xl z-[120]"
          >
            <CheckCircle size={18} />
            <span className="text-[10px] font-black uppercase tracking-widest">Schedule Synced Successfully</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AppointmentScheduler;