import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CalendarDays, Clock3, MapPin, Send, Loader2,
  ChevronRight, CalendarRange, Sparkles, AlertTriangle, CheckCircle2
} from 'lucide-react';
import { useSystem } from '../context/SystemContext';
import { Card, Button } from '../components/UI';

const MotionDiv = motion.div;

const SLOT_OPTIONS = ['9:00 AM', '10:30 AM', '1:30 PM', '3:00 PM', '4:00 PM'];
const DAILY_CAPACITY = 6;
const BACKEND_WINDOW = 14;

const formatDateKey = (date) => date.toISOString().slice(0, 10);

const Appointments = () => {
  const navigate = useNavigate();
  const { user, profile, appointments, createAppointment, addNotification } = useSystem();
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [reason, setReason] = useState('');
  const [availableDates, setAvailableDates] = useState([]);
  const [loadingDates, setLoadingDates] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const todayKey = formatDateKey(new Date());
  const yearLevel = profile?.yearLevel || 'N/A';

  const bookedByDate = useMemo(() => {
    return appointments.reduce((acc, appt) => {
      const status = String(appt.status || '').toLowerCase();
      if (status === 'cancelled' || status === 'rescheduled') return acc;
      const key = appt.date;
      if (!acc[key]) acc[key] = [];
      acc[key].push(appt.time);
      return acc;
    }, {});
  }, [appointments]);

  useEffect(() => {
    let mounted = true;
    const loadDates = async () => {
      setLoadingDates(true);
      await new Promise(resolve => setTimeout(resolve, 600));

      const dates = [];
      const start = new Date();
      for (let i = 0; i < BACKEND_WINDOW; i += 1) {
        const d = new Date(start);
        d.setDate(start.getDate() + i);
        const key = formatDateKey(d);
        const bookedCount = (appointments || []).filter(
          (appt) => appt.date === key && String(appt.status).toLowerCase() !== 'cancelled'
        ).length;
        dates.push({
          key,
          date: d,
          label: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          day: d.toLocaleDateString('en-US', { weekday: 'short' }),
          bookedCount,
          isFull: bookedCount >= DAILY_CAPACITY,
          isToday: key === todayKey,
        });
      }

      if (mounted) {
        setAvailableDates(dates);
        const today = dates.find(item => item.isToday);
        const nextAvailable = dates.find(item => !item.isFull);
        const initial = today && !today.isFull ? today : nextAvailable;
        if (initial) {
          setSelectedDate(initial.key);
        }
        setLoadingDates(false);
      }
    };

    loadDates();
    return () => {
      mounted = false;
    };
  }, [appointments, todayKey]);

  const selectedDateInfo = availableDates.find(item => item.key === selectedDate);
  const nextAvailableDate = availableDates.find(item => !item.isFull);
  const occupiedSlots = bookedByDate[selectedDate] || [];
  const openSlots = SLOT_OPTIONS.filter(slot => !occupiedSlots.includes(slot));
  const activeSelectedTime = selectedTime && openSlots.includes(selectedTime) ? selectedTime : openSlots[0] || '';
  const isSelectedDateFull = selectedDateInfo?.isFull;
  const canBook = selectedDate && activeSelectedTime && !isSelectedDateFull && openSlots.includes(activeSelectedTime);

  const handleSubmit = async () => {
    if (!canBook) return;
    setSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 800));

    createAppointment({
      student: user?.name || 'CampusWell Student',
      yearLevel,
      date: selectedDate,
      time: activeSelectedTime,
      reason,
      status: 'pending',
      assistantState: 'Pending',
      priority: profile?.riskLevel || 'Normal',
    });

    const studentName = user?.name || 'CampusWell Student';
    const requestMessage = `Your counseling request for ${selectedDateInfo?.day}, ${selectedDateInfo?.label} at ${activeSelectedTime} is pending assistant approval.`;
    const counselorMessage = `${studentName} - ${yearLevel} requested counseling for ${selectedDateInfo?.day}, ${selectedDateInfo?.label} at ${activeSelectedTime}.`;

    addNotification(
      { name: studentName, yearLevel },
      'Appointment Submitted',
      {
        type: 'appointment',
        category: 'appointment',
        roles: ['student'],
        message: requestMessage,
        yearLevel,
      }
    );

    addNotification(
      { name: studentName, yearLevel },
      'New Counseling Request',
      {
        type: 'appointment',
        category: 'appointment',
        roles: ['counselor', 'admin'],
        message: counselorMessage,
        yearLevel,
      }
    );

    setSubmitting(false);
    setSubmitted(true);
  };

  return (
    <main className="py-6 md:py-12 px-4 min-h-screen bg-background transition-colors duration-300">
      <div className="max-w-6xl mx-auto space-y-6 md:space-y-8">
        <header className="text-center lg:text-left space-y-3">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-3xl md:text-5xl font-black text-campus-blue dark:text-campus-green uppercase tracking-tighter italic">
              Schedule Counseling
            </h1>
            <p className="text-muted-foreground mt-2 font-black text-[10px] uppercase tracking-[0.3em]">
              Smart availability, fixed slots, and assistant-managed approvals
            </p>
          </motion.div>

          {nextAvailableDate && selectedDateInfo?.isFull && (
            <div className="inline-flex items-center gap-2 rounded-full bg-campus-blue/10 dark:bg-campus-blue/15 px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-campus-blue dark:text-campus-green">
              <Sparkles size={14} /> Next Available Date: {nextAvailableDate.label}
            </div>
          )}
        </header>

        <AnimatePresence mode="wait">
          {!submitted ? (
              <MotionDiv
                key="booking"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-surface dark:bg-surface-elevated rounded-[2.5rem] shadow-2xl border border-border overflow-hidden"
              >
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-0">
                <div className="lg:col-span-3 p-6 md:p-8 space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-lg md:text-xl font-black uppercase italic tracking-tighter text-foreground flex items-center gap-2">
                        <CalendarRange size={18} className="text-campus-blue dark:text-campus-green" />
                        Calendar View
                      </h2>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mt-1">
                        Tap a date to view only available slots
                      </p>
                    </div>
                  </div>

                  {loadingDates ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3">
                      {Array.from({ length: 8 }).map((_, idx) => (
                        <div key={idx} className="h-28 rounded-[1.5rem] bg-muted/30 dark:bg-muted/20 animate-pulse" />
                      ))}
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3">
                      {availableDates.map((item) => (
                        <button
                          key={item.key}
                          type="button"
                          disabled={item.isFull}
                          onClick={() => {
                            setSelectedDate(item.key);
                            setSelectedTime('');
                          }}
                          className={`text-left rounded-[1.5rem] p-4 border transition-all duration-300 min-h-[7rem] ${
                            item.key === selectedDate
                              ? 'border-campus-blue bg-campus-blue/5 shadow-soft'
                              : item.isFull
                                ? 'border-border bg-muted/60 dark:bg-muted/30 text-muted-foreground opacity-70'
                                : 'border-border bg-surface dark:bg-surface-elevated hover:border-campus-blue'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <p className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground">{item.day}</p>
                              <p className="mt-2 text-lg font-black text-foreground">{item.label}</p>
                            </div>
                            <div className={`h-3 w-3 rounded-full ${item.isFull ? 'bg-rose-400' : item.key === selectedDate ? 'bg-campus-blue' : 'bg-campus-green'}`} />
                          </div>
                          <div className="mt-4 flex items-center justify-between">
                            <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">
                              {item.bookedCount}/{DAILY_CAPACITY}
                            </span>
                            <span className={`text-[9px] font-black uppercase tracking-widest ${item.isFull ? 'text-rose-500' : 'text-campus-green'}`}>
                              {item.isFull ? 'Full' : 'Open'}
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="lg:col-span-2 p-6 md:p-8 bg-muted/30 dark:bg-muted/20 border-t lg:border-t-0 lg:border-l border-border space-y-6">
                  <div>
                    <h2 className="text-lg md:text-xl font-black uppercase italic tracking-tighter text-foreground flex items-center gap-2">
                      <Clock3 size={18} className="text-campus-blue dark:text-campus-green" />
                      Available Slots
                    </h2>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mt-1">
                      8 AM - 5 PM working hours
                    </p>
                  </div>

                  <div className="rounded-[1.5rem] border border-border bg-surface dark:bg-surface-elevated p-4">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Selected Date</p>
                    <p className="mt-2 text-sm font-black text-foreground">
                      {selectedDateInfo ? `${selectedDateInfo.day}, ${selectedDateInfo.label}` : 'Select a date'}
                    </p>
                    {selectedDateInfo?.isFull && (
                      <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-rose-100/80 dark:bg-rose-500/10 px-3 py-1 text-[9px] font-black uppercase tracking-widest text-rose-600">
                        <AlertTriangle size={12} /> Full Day
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {SLOT_OPTIONS.map((slot) => {
                      const isBlocked = !openSlots.includes(slot);
                      return (
                        <button
                          key={slot}
                          type="button"
                          disabled={isBlocked || !selectedDate}
                          onClick={() => setSelectedTime(slot)}
                          className={`rounded-2xl border px-3 py-4 text-left transition-all ${
                            activeSelectedTime === slot
                              ? 'border-campus-blue bg-campus-blue text-primary-foreground shadow-soft'
                              : isBlocked || !selectedDate
                                ? 'border-border bg-muted/60 dark:bg-muted/30 text-muted-foreground opacity-60'
                                : 'border-border bg-surface dark:bg-surface-elevated text-foreground hover:border-campus-blue'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-[10px] font-black uppercase tracking-widest">{slot}</span>
                            {!isBlocked && <ChevronRight size={14} className="opacity-60" />}
                          </div>
                          <p className="mt-2 text-[9px] font-bold uppercase tracking-widest opacity-70">
                            {isBlocked ? 'Booked' : '60 min session'}
                          </p>
                        </button>
                      );
                    })}
                  </div>

                  <div className="rounded-[1.5rem] border border-border bg-surface dark:bg-surface-elevated p-4">
                    <label className="block text-[10px] font-black uppercase text-muted-foreground tracking-[0.2em] mb-3">
                      Reason for Counseling
                    </label>
                    <textarea
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      placeholder="Tell us a bit about what you'd like support with..."
                      className="min-h-[120px] w-full rounded-2xl border border-border bg-muted/30 dark:bg-muted/20 p-4 text-sm font-medium text-foreground outline-none focus:ring-4 focus:ring-campus-blue/10 resize-none"
                    />
                  </div>

                  <Button
                    variant="primary"
                    className="w-full py-4 rounded-2xl text-[10px] md:text-[11px] font-black uppercase tracking-[0.2em] shadow-soft"
                    disabled={!canBook || submitting}
                    onClick={handleSubmit}
                  >
                    {submitting ? <Loader2 size={18} className="animate-spin" /> : <><Send size={18} /> Submit Pending Request</>}
                  </Button>

                  <p className="text-[10px] font-bold text-muted-foreground leading-relaxed text-center">
                    New appointments enter <span className="font-black text-campus-blue dark:text-campus-green">Pending</span> state until the Assistant confirms, reschedules, or marks the session completed.
                  </p>
                </div>
              </div>
            </MotionDiv>
          ) : (
            <motion.div
              key="success"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-surface dark:bg-surface-elevated rounded-[3rem] p-10 md:p-16 text-center shadow-2xl border border-border"
            >
              <div className="h-20 w-20 bg-campus-green/15 text-campus-green rounded-3xl flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 size={40} />
              </div>
              <h2 className="text-3xl font-black italic uppercase tracking-tighter text-foreground">
                Request Submitted
              </h2>
              <p className="text-muted-foreground mt-4 font-bold text-sm max-w-md mx-auto leading-relaxed">
                Your appointment is now pending assistant approval. You will be notified when it is confirmed or rescheduled.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
                <Button variant="primary" className="w-full sm:w-auto px-8 py-4 rounded-2xl" onClick={() => navigate('/student/dashboard')}>
                  Back to Dashboard
                </Button>
                <Button variant="outline" className="w-full sm:w-auto px-8 py-4 rounded-2xl" onClick={() => setSubmitted(false)}>
                  Book Another
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
};

export default Appointments;
