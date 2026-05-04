import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar as CalendarIcon, Clock, Video, MapPin,
  X, CheckCircle
} from 'lucide-react';
import { Card, Button } from "../../components/UI";
import { useSystem } from '../../context/SystemContext';

const AppointmentScheduler = ({ studentContext, onClose }) => {
  const { addNotification } = useSystem();
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [sessionType, setSessionType] = useState('Face-to-Face');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  const timeSlots = ["08:00 AM", "09:30 AM", "11:00 AM", "01:30 PM", "03:00 PM", "04:30 PM"];
  const dates = [
    { day: "Mon", date: "20" }, { day: "Tue", date: "21" },
    { day: "Wed", date: "22" }, { day: "Thu", date: "23" }, { day: "Fri", date: "24" },
  ];

  const handleFinalize = () => {
    setIsProcessing(true);

    setTimeout(() => {
      const yearLevel = studentContext.yearLevel || 'N/A';
      const appointmentData = {
        studentId: studentContext.id,
        date: `April ${selectedDate}, 2026`,
        time: selectedTime,
        type: sessionType,
        yearLevel,
      };

      addNotification(
        { name: studentContext.name, yearLevel },
        `Appointment Scheduled: ${appointmentData.date} at ${appointmentData.time}`,
        { type: 'appointment', yearLevel }
      );

      setIsProcessing(false);
      setShowSuccessToast(true);

      setTimeout(() => {
        setShowSuccessToast(false);
        onClose();
      }, 2000);
    }, 800);
  };

  return (
    <div className="relative h-full flex flex-col bg-surface dark:bg-surface-elevated rounded-[2.5rem] overflow-hidden">
      <header className="p-6 border-b border-border flex justify-between items-center bg-muted/40 dark:bg-muted/20">
        <div>
          <span className="text-[9px] font-black text-campus-blue dark:text-campus-green uppercase tracking-[0.2em]">Process 2.4 // Scheduling</span>
          <h2 className="text-xl font-black text-foreground uppercase italic tracking-tighter">Session Setup</h2>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-muted rounded-full transition-colors">
          <X size={20} className="text-muted-foreground" />
        </button>
      </header>

      <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
        <div className="flex items-center gap-3 p-4 bg-campus-blue/5 dark:bg-campus-blue/10 rounded-2xl border border-campus-blue/10 dark:border-campus-blue/20">
          <div className="h-10 w-10 bg-campus-blue rounded-xl flex items-center justify-center text-primary-foreground font-black text-xs">
            {studentContext.student?.substring(0, 2)}
          </div>
          <div>
            <p className="text-[10px] font-black text-campus-blue dark:text-campus-green uppercase tracking-widest">{studentContext.student}</p>
            <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-tighter italic">{studentContext.idNumber}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <section>
            <h4 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.15em] mb-4 flex items-center gap-2">
              <CalendarIcon size={12} /> Appointment Date
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
              {dates.map((d) => (
                <button
                  key={d.date}
                  onClick={() => setSelectedDate(d.date)}
                  className={`py-3 rounded-xl border-2 transition-all flex flex-col items-center ${
                    selectedDate === d.date
                      ? 'border-campus-blue bg-campus-blue text-primary-foreground shadow-soft'
                      : 'border-border bg-muted/40 dark:bg-muted/25 text-muted-foreground hover:border-campus-blue'
                  }`}
                >
                  <span className="text-[8px] font-black uppercase mb-1">{d.day}</span>
                  <span className="text-sm font-black">{d.date}</span>
                </button>
              ))}
            </div>
          </section>

          <section>
            <h4 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.15em] mb-4 flex items-center gap-2">
              <Clock size={12} /> Selected Slot
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {timeSlots.map((slot) => (
                <button
                  key={slot}
                  onClick={() => setSelectedTime(slot)}
                  className={`py-3 px-2 rounded-xl border font-black text-[10px] transition-all ${
                    selectedTime === slot
                      ? 'bg-campus-blue/10 border-campus-blue text-campus-blue dark:text-campus-green'
                      : 'border-border text-muted-foreground hover:bg-muted'
                  }`}
                >
                  {slot}
                </button>
              ))}
            </div>
          </section>
        </div>

        <section>
          <h4 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.15em] mb-4">Delivery Mode</h4>
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
                    ? 'border-campus-blue bg-campus-blue/5 text-campus-blue dark:text-campus-green font-black'
                    : 'border-border text-muted-foreground font-bold'
                }`}
              >
                <mode.icon size={16} />
                <span className="text-xs uppercase tracking-tight">{mode.label}</span>
              </button>
            ))}
          </div>
        </section>
      </div>

      <footer className="p-6 bg-muted/40 dark:bg-muted/20 border-t border-border flex flex-col gap-4">
        <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-muted-foreground">
          <span>April {selectedDate || '--'} // {selectedTime || '--'}</span>
          <span className="text-campus-blue dark:text-campus-green">{sessionType}</span>
        </div>

        <Button
          variant="primary"
          className="w-full py-4 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] shadow-soft disabled:opacity-50"
          onClick={handleFinalize}
          disabled={!selectedDate || !selectedTime || isProcessing}
        >
          {isProcessing ? 'Updating D2 WellnessDB...' : 'Finalize Appointment'}
        </Button>
      </footer>

      <AnimatePresence>
        {showSuccessToast && (
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 bg-campus-green text-primary-foreground px-6 py-3 rounded-full flex items-center gap-3 shadow-2xl z-[120]"
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
