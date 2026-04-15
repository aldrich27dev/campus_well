import React from 'react';
import { CalendarDays, Clock, User, CheckCircle, XCircle, Search } from 'lucide-react';
import { Card, Button } from '../components/UI';

const CounselorAppointments = () => {
  // Mock data for counselor management
  const pendingAppointments = [
    { id: 1, student: "Juan Dela Cruz", type: "Initial Consultation", time: "10:30 AM", date: "Today", status: "Pending" },
    { id: 2, student: "Maria Clara", type: "Follow-up", time: "01:00 PM", date: "Today", status: "Pending" },
  ];

  return (
    <div className="p-8 lg:p-12 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-[#1e3a8a] dark:text-white tracking-tighter uppercase italic">
            Appointment Manager
          </h1>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-2">
            Counselor Access • Schedule Oversight
          </p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input 
            type="text" 
            placeholder="Search Student..." 
            className="pl-10 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl text-xs outline-none focus:ring-2 focus:ring-[#1e3a8a]/10 transition-all"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Appointments List */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Pending Requests</h3>
          {pendingAppointments.map((appt) => (
            <Card key={appt.id} className="p-6 border-none shadow-sm bg-white dark:bg-slate-900 rounded-[2rem] flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-[#1e3a8a]">
                  <User size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 dark:text-white">{appt.student}</h4>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{appt.type}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-8">
                <div className="text-right">
                  <p className="text-xs font-black text-slate-700 dark:text-slate-200">{appt.time}</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">{appt.date}</p>
                </div>
                <div className="flex gap-2">
                  <button className="p-2 text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 rounded-xl transition-colors">
                    <CheckCircle size={20} />
                  </button>
                  <button className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-xl transition-colors">
                    <XCircle size={20} />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Calendar Sidebar Mini-View */}
        <Card className="p-8 border-none shadow-sm bg-[#1e3a8a] text-white rounded-[2.5rem]">
          <h3 className="text-xs font-black uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
            <CalendarDays size={16} /> Schedule Overview
          </h3>
          <div className="space-y-6">
             <div className="bg-white/10 p-4 rounded-2xl border border-white/10">
                <p className="text-[10px] font-black uppercase opacity-60">Next Session</p>
                <p className="text-sm font-bold mt-1">10:30 AM with Juan</p>
             </div>
             <Button className="w-full bg-white text-[#1e3a8a] hover:bg-slate-100 font-black text-[10px] uppercase tracking-widest py-4 rounded-xl transition-all">
                Open Full Calendar
             </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default CounselorAppointments;