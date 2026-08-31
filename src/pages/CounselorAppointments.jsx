import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CalendarDays, User, CheckCircle, Search, ArrowRightCircle, Clock3,
  BadgeAlert, X, ChevronRight, CalendarRange, Sparkles
} from 'lucide-react';
import { Card, Button } from '../components/UI';
import { useSystem } from '../context/SystemContext';

const SLOT_OPTIONS = ['9:00 AM', '10:30 AM', '1:30 PM', '3:00 PM', '4:00 PM'];
const DAYS_AHEAD = 14;
const DAILY_CAPACITY = 6;

const formatDateKey = (date) => date.toISOString().slice(0, 10);

const CounselorAppointments = () => {
  const { appointments, updateAppointment, addNotification } = useSystem();
  const [rescheduleTarget, setRescheduleTarget] = useState(null);
  const [rescheduleDate, setRescheduleDate] = useState('');
  const [rescheduleTime, setRescheduleTime] = useState('');
  const MotionDiv = motion.div;

  const allAppointments = useMemo(() => appointments || [], [appointments]);
  const pendingAppointments = allAppointments.filter((appt) => String(appt.status).toLowerCase() === 'pending');
  const confirmedAppointments = allAppointments.filter((appt) => String(appt.status).toLowerCase() === 'confirmed');

  const getBookedSlots = (date, ignoreId = null) =>
    allAppointments
      .filter((appt) => appt.date === date && appt.id !== ignoreId && String(appt.status).toLowerCase() !== 'cancelled')
      .map((appt) => appt.time);

  const getDates = (fromDate = new Date(), ignoreId = null) => {
    const dates = [];
    for (let i = 0; i < DAYS_AHEAD; i += 1) {
      const d = new Date(fromDate);
      d.setDate(fromDate.getDate() + i);
      const key = formatDateKey(d);
      const bookedSlots = getBookedSlots(key, ignoreId);
      dates.push({
        key,
        label: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        day: d.toLocaleDateString('en-US', { weekday: 'short' }),
        bookedCount: bookedSlots.length,
        isFull: bookedSlots.length >= DAILY_CAPACITY || bookedSlots.length >= SLOT_OPTIONS.length,
      });
    }
    return dates;
  };

  const rescheduleDates = rescheduleTarget ? getDates(new Date(rescheduleTarget.date), rescheduleTarget.id) : [];
  const selectedRescheduleSlots = rescheduleTarget && rescheduleDate
    ? SLOT_OPTIONS.filter((slot) => !getBookedSlots(rescheduleDate, rescheduleTarget.id).includes(slot))
    : SLOT_OPTIONS;

  const handleConfirm = (appt) => {
    updateAppointment(appt.id, {
      status: 'confirmed',
      assistantState: 'Confirmed',
    });

    addNotification(
      { name: appt.student, yearLevel: appt.yearLevel },
      'Appointment Confirmed',
      {
        type: 'appointment',
        category: 'appointment',
        roles: ['student'],
        message: `Your counseling appointment for ${appt.date} at ${appt.time} has been confirmed.`,
      }
    );
  };

  const handleComplete = (appt) => {
    updateAppointment(appt.id, {
      status: 'completed',
      assistantState: 'Completed',
    });

    addNotification(
      { name: appt.student, yearLevel: appt.yearLevel },
      'Appointment Completed',
      {
        type: 'appointment',
        category: 'appointment',
        roles: ['student'],
        message: `Your counseling appointment on ${appt.date} at ${appt.time} is now marked as completed.`,
      }
    );
  };

  const openReschedule = (appt) => {
    const dates = getDates(new Date(appt.date), appt.id);
    const initialDate = dates.find((d) => !d.isFull)?.key || '';
    const initialSlots = initialDate ? SLOT_OPTIONS.filter((slot) => !getBookedSlots(initialDate, appt.id).includes(slot)) : [];

    setRescheduleTarget(appt);
    setRescheduleDate(initialDate);
    setRescheduleTime(initialSlots[0] || '');
  };

  const confirmReschedule = () => {
    if (!rescheduleTarget || !rescheduleDate || !rescheduleTime) return;

    updateAppointment(rescheduleTarget.id, {
      date: rescheduleDate,
      time: rescheduleTime,
      status: 'pending',
      assistantState: 'Rescheduled',
    });

    addNotification(
      { name: rescheduleTarget.student, yearLevel: rescheduleTarget.yearLevel },
      'Appointment Rescheduled',
      {
        type: 'appointment',
        category: 'appointment',
        roles: ['student'],
        message: `Your counseling appointment has been moved to ${rescheduleDate} at ${rescheduleTime}.`,
      }
    );

    addNotification(
      { name: rescheduleTarget.student, yearLevel: rescheduleTarget.yearLevel },
      'Appointment Rescheduled',
      {
        type: 'appointment',
        category: 'appointment',
        roles: ['counselor', 'admin'],
        message: `${rescheduleTarget.student} - ${rescheduleTarget.yearLevel || 'N/A'} was moved to ${rescheduleDate} at ${rescheduleTime}.`,
      }
    );

    setRescheduleTarget(null);
    setRescheduleDate('');
    setRescheduleTime('');
  };

  return (
    <div className="p-4 md:p-8 lg:p-12 max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-campus-blue dark:text-campus-green tracking-tighter uppercase italic">
            Appointment Manager
          </h1>
          <p className="text-muted-foreground text-xs font-bold uppercase tracking-widest mt-2">
            Assistant approval desk
          </p>
        </div>
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
          <input
            type="text"
            placeholder="Search Student..."
            className="w-full pl-10 pr-4 py-2 bg-surface dark:bg-surface-elevated border border-border rounded-xl text-xs outline-none focus:ring-2 focus:ring-campus-blue/10 transition-all text-foreground"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-end justify-between gap-3 mb-4">
            <h3 className="text-sm font-black text-muted-foreground uppercase tracking-[0.2em]">Pending Requests</h3>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-campus-green">{pendingAppointments.length} pending</span>
          </div>

          {pendingAppointments.length === 0 ? (
            <Card className="p-8 rounded-[2rem] bg-surface dark:bg-surface-elevated border border-border text-center">
              <div className="mx-auto h-12 w-12 rounded-2xl bg-muted flex items-center justify-center">
                <CheckCircle size={20} className="text-muted-foreground/60" />
              </div>
              <p className="mt-4 text-sm font-bold text-foreground">No pending requests right now.</p>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mt-2">Students will appear here after booking.</p>
            </Card>
          ) : (
            pendingAppointments.map((appt) => (
              <Card key={appt.id} className="p-6 border-none shadow-sm bg-surface dark:bg-surface-elevated rounded-[2rem] flex flex-col md:flex-row md:items-center justify-between gap-5">
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 bg-muted dark:bg-muted rounded-2xl flex items-center justify-center text-campus-blue dark:text-campus-green">
                    <User size={20} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-bold text-foreground">{appt.student}</h4>
                      <span className="text-[8px] px-2 py-0.5 rounded-full font-black uppercase bg-campus-green/10 text-campus-green">
                        {appt.yearLevel || 'N/A'}
                      </span>
                      {appt.priority === 'High' && (
                        <span className="text-[8px] px-2 py-0.5 rounded-full font-black uppercase bg-rose-100 text-rose-600">
                          Priority
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">{appt.reason || appt.type || 'Counseling Request'}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-[10px] font-black text-foreground flex items-center gap-1">
                        <CalendarDays size={10} /> {new Date(appt.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                      <span className="text-[10px] font-black text-foreground flex items-center gap-1">
                        <Clock3 size={10} /> {appt.time}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2 md:justify-end">
                  <Button variant="primary" onClick={() => handleConfirm(appt)} className="px-4 py-3 rounded-2xl text-[10px]">
                    <CheckCircle size={16} /> Confirm
                  </Button>
                  <Button variant="outline" onClick={() => openReschedule(appt)} className="px-4 py-3 rounded-2xl text-[10px]">
                    <ArrowRightCircle size={16} /> Reschedule
                  </Button>
                  <button onClick={() => handleComplete(appt)} className="px-4 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest text-emerald-600 hover:bg-emerald-50/70 dark:hover:bg-emerald-500/10 border border-emerald-100/70 dark:border-emerald-500/20">
                    Completed
                  </button>
                </div>
              </Card>
            ))
          )}
        </div>

        <div className="space-y-6">
          <Card className="p-6 border-none shadow-sm bg-campus-blue text-primary-foreground rounded-[2.5rem]">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
              <CalendarDays size={16} /> Schedule Overview
            </h3>
            <div className="space-y-4">
              <div className="bg-primary-foreground/10 p-4 rounded-2xl border border-primary-foreground/10">
                <p className="text-[10px] font-black uppercase opacity-60">Confirmed</p>
                <p className="text-lg font-bold mt-1">{confirmedAppointments.length}</p>
              </div>
              <div className="bg-primary-foreground/10 p-4 rounded-2xl border border-primary-foreground/10">
                <p className="text-[10px] font-black uppercase opacity-60">Pending</p>
                <p className="text-lg font-bold mt-1">{pendingAppointments.length}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 border-none shadow-sm bg-surface dark:bg-surface-elevated rounded-[2rem]">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-4 flex items-center gap-2">
              <BadgeAlert size={14} className="text-campus-blue dark:text-campus-green" />
              Assistant Notes
            </h3>
            <p className="text-sm text-foreground leading-relaxed">
              Use the buttons on each request to confirm, reschedule to the next available slot, or mark the session as completed after the meeting ends.
            </p>
          </Card>
        </div>
      </div>

      <AnimatePresence>
        {rescheduleTarget && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
            <MotionDiv
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-background/60 backdrop-blur-sm"
              onClick={() => setRescheduleTarget(null)}
            />
            <MotionDiv
              initial={{ opacity: 0, y: 16, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.96 }}
              className="relative w-full max-w-4xl rounded-[2.5rem] bg-surface dark:bg-surface-elevated border border-border shadow-2xl overflow-hidden"
            >
              <div className="p-5 md:p-6 border-b border-border flex items-center justify-between bg-muted/30 dark:bg-muted/20">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-campus-blue dark:text-campus-green">Reschedule Counseling</p>
                  <h3 className="text-lg md:text-xl font-black uppercase italic tracking-tighter text-foreground mt-1">
                    {rescheduleTarget.student}
                  </h3>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mt-1">
                    {rescheduleTarget.yearLevel || 'N/A'}
                  </p>
                </div>
                <button onClick={() => setRescheduleTarget(null)} className="p-2 rounded-xl hover:bg-muted text-muted-foreground">
                  <X size={18} />
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-5 gap-0">
                <div className="lg:col-span-3 p-5 md:p-6 space-y-5">
                  <div className="flex items-center gap-2 text-campus-blue dark:text-campus-green">
                    <CalendarRange size={16} />
                    <p className="text-[10px] font-black uppercase tracking-[0.2em]">Pick a new date</p>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3">
                    {rescheduleDates.map((date) => (
                      <button
                        key={date.key}
                        type="button"
                        disabled={date.isFull}
                        onClick={() => {
                          setRescheduleDate(date.key);
                          const booked = getBookedSlots(date.key, rescheduleTarget.id);
                          setRescheduleTime(SLOT_OPTIONS.find((slot) => !booked.includes(slot)) || '');
                        }}
                        className={`rounded-[1.5rem] p-4 border text-left transition-all min-h-[6.5rem] ${
                          rescheduleDate === date.key
                            ? 'border-campus-blue bg-campus-blue/5 shadow-soft'
                            : date.isFull
                              ? 'border-border bg-muted/60 dark:bg-muted/30 text-muted-foreground opacity-60'
                              : 'border-border bg-surface dark:bg-surface-elevated hover:border-campus-blue'
                        }`}
                      >
                        <p className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground">{date.day}</p>
                        <p className="mt-2 text-lg font-black text-foreground">{date.label}</p>
                        <div className="mt-3 inline-flex items-center gap-2 text-[9px] font-black uppercase tracking-widest">
                          <span className={`${date.isFull ? 'text-rose-500' : 'text-campus-green'}`}>{date.isFull ? 'Full' : 'Open'}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="lg:col-span-2 p-5 md:p-6 border-t lg:border-t-0 lg:border-l border-border bg-muted/30 dark:bg-muted/20 space-y-5">
                  <div className="flex items-center gap-2 text-campus-blue dark:text-campus-green">
                    <Clock3 size={16} />
                    <p className="text-[10px] font-black uppercase tracking-[0.2em]">Pick a new time</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {selectedRescheduleSlots.map((slot) => (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setRescheduleTime(slot)}
                        className={`rounded-2xl border px-3 py-4 text-left transition-all ${
                          rescheduleTime === slot
                            ? 'border-campus-blue bg-campus-blue text-primary-foreground shadow-soft'
                            : 'border-border bg-surface dark:bg-surface-elevated text-foreground hover:border-campus-blue'
                        }`}
                      >
                        <span className="text-[10px] font-black uppercase tracking-widest">{slot}</span>
                        <p className="mt-2 text-[9px] font-bold uppercase tracking-widest opacity-70">60 min session</p>
                      </button>
                    ))}
                  </div>

                  <div className="rounded-[1.5rem] border border-border bg-surface dark:bg-surface-elevated p-4 text-sm">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Selected Move</p>
                    <p className="mt-2 font-bold text-foreground">
                      {rescheduleDate || 'Select a date'} // {rescheduleTime || 'Select a time'}
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button
                      variant="primary"
                      className="flex-1 rounded-2xl py-4"
                      disabled={!rescheduleDate || !rescheduleTime}
                      onClick={confirmReschedule}
                    >
                      Confirm Reschedule
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1 rounded-2xl py-4"
                      onClick={() => setRescheduleTarget(null)}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            </MotionDiv>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CounselorAppointments;
