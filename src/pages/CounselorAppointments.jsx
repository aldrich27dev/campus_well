import React, { useMemo } from 'react';
import { CalendarDays, User, CheckCircle, XCircle, Search, ArrowRightCircle, Clock3, BadgeAlert } from 'lucide-react';
import { Card, Button } from '../components/UI';
import { useSystem } from '../context/SystemContext';

const SLOT_OPTIONS = ['9:00 AM', '10:30 AM', '1:30 PM', '3:00 PM', '4:00 PM'];
const DAYS_AHEAD = 14;

const formatDateKey = (date) => date.toISOString().slice(0, 10);

const CounselorAppointments = () => {
  const { appointments, updateAppointment, addNotification } = useSystem();

  const allAppointments = useMemo(() => appointments || [], [appointments]);
  const pendingAppointments = allAppointments.filter((appt) => String(appt.status).toLowerCase() === 'pending');
  const confirmedAppointments = allAppointments.filter((appt) => String(appt.status).toLowerCase() === 'confirmed');

  const getBookedSlots = (date, ignoreId = null) =>
    allAppointments
      .filter((appt) => appt.date === date && appt.id !== ignoreId && String(appt.status).toLowerCase() !== 'cancelled')
      .map((appt) => appt.time);

  const findNextAvailable = (fromDate = new Date(), ignoreId = null) => {
    for (let i = 0; i < DAYS_AHEAD; i += 1) {
      const d = new Date(fromDate);
      d.setDate(fromDate.getDate() + i);
      const key = formatDateKey(d);
      const slots = getBookedSlots(key, ignoreId);
      const openSlot = SLOT_OPTIONS.find((slot) => !slots.includes(slot));
      if (openSlot) return { date: key, time: openSlot };
    }
    return null;
  };

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

  const handleReschedule = (appt) => {
    const nextSlot = findNextAvailable(new Date(appt.date), appt.id);
    if (!nextSlot) return;
    updateAppointment(appt.id, {
      date: nextSlot.date,
      time: nextSlot.time,
      status: 'pending',
      assistantState: 'Rescheduled',
    });

    addNotification(
      { name: appt.student, yearLevel: appt.yearLevel },
      'Appointment Rescheduled',
      {
        type: 'appointment',
        category: 'appointment',
        roles: ['student'],
        message: `Your counseling appointment has been moved to ${nextSlot.date} at ${nextSlot.time}.`,
      }
    );
  };

  return (
    <div className="p-4 md:p-8 lg:p-12 max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-campus-blue dark:text-campus-green tracking-tighter uppercase italic">
            Appointment Manager
          </h1>
          <p className="text-muted-foreground text-xs font-bold uppercase tracking-widest mt-2">
            Assistant approval desk
          </p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
          <input
            type="text"
            placeholder="Search Student..."
            className="pl-10 pr-4 py-2 bg-surface dark:bg-surface-elevated border border-border rounded-xl text-xs outline-none focus:ring-2 focus:ring-campus-blue/10 transition-all text-foreground"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
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
                  <Button variant="outline" onClick={() => handleReschedule(appt)} className="px-4 py-3 rounded-2xl text-[10px]">
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
    </div>
  );
};

export default CounselorAppointments;
