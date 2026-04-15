import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, ShieldCheck, Search, Edit, Trash2, 
  UserPlus, Terminal, Server, Activity, Database 
} from 'lucide-react';

const AdminDashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");

  // Mock Data: Represents Data Store D1 (UserDB)
  const users = [
    { id: '2022-0001', name: 'Aldrich Naag', role: 'Student', status: 'Active' },
    { id: 'C-9901', name: 'Dr. Santos', role: 'Counselor', status: 'Active' },
    { id: '2022-0052', name: 'Juan Dela Cruz', role: 'Student', status: 'Pending' },
  ];

  // Mock Data: Represents Data Store D5 (AuditLogs)
  const logs = [
    { id: 1, event: "Process 0.0: Login Success", user: "Aldrich", time: "2 mins ago", status: "Secure" },
    { id: 2, event: "D2: WellnessDB Write", user: "System", time: "15 mins ago", status: "Success" },
    { id: 3, event: "Unauthorized Access Attempt", user: "Unknown IP", time: "1 hour ago", status: "Blocked" },
  ];

  return (
    <main className="p-8 bg-slate-50 dark:bg-slate-950 min-h-screen">
      {/* HEADER SECTION */}
      <header className="mb-10 flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black text-slate-800 dark:text-white uppercase italic tracking-tighter">
            System Control
          </h1>
          <p className="text-slate-500 font-medium">CampusWell Administrative Hub // Process 3.0</p>
        </div>
        
        <button className="flex items-center gap-2 bg-[#1e3a8a] text-white px-6 py-3 rounded-2xl font-bold text-xs uppercase tracking-widest shadow-lg hover:scale-105 transition-transform">
          <UserPlus size={16} /> Add New Account
        </button>
      </header>

      {/* SECTION 1: USER MANAGEMENT (Process 3.1) */}
      <section className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-xl border border-slate-100 dark:border-slate-800 overflow-hidden">
        <div className="p-8 border-b border-slate-50 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h2 className="text-lg font-black uppercase tracking-tight text-slate-800 dark:text-white">User Registry (D1)</h2>
          
          <div className="relative w-full md:w-72">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search ID or Name..." 
              className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm font-bold focus:ring-2 ring-[#1e3a8a] outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 dark:bg-slate-800/50">
              <tr>
                <th className="px-8 py-4 text-[10px] font-black uppercase text-slate-400 tracking-widest">User ID</th>
                <th className="px-8 py-4 text-[10px] font-black uppercase text-slate-400 tracking-widest">Full Name</th>
                <th className="px-8 py-4 text-[10px] font-black uppercase text-slate-400 tracking-widest">Role</th>
                <th className="px-8 py-4 text-[10px] font-black uppercase text-slate-400 tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
                  <td className="px-8 py-5 font-mono text-xs text-slate-500">{user.id}</td>
                  <td className="px-8 py-5 font-bold text-slate-800 dark:text-slate-200">{user.name}</td>
                  <td className="px-8 py-5">
                    <span className={`text-[10px] px-3 py-1 rounded-full font-black uppercase ${
                      user.role === 'Counselor' ? 'bg-indigo-100 text-indigo-600' : 'bg-blue-100 text-blue-600'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex justify-end gap-2">
                      <button className="p-2 text-slate-400 hover:text-[#1e3a8a] transition-colors"><Edit size={18} /></button>
                      <button className="p-2 text-slate-400 hover:text-red-500 transition-colors"><Trash2 size={18} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* SECTION 2: SYSTEM HEALTH (Process 3.2) */}
      <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Vitals Cards */}
        <div className="lg:col-span-1 space-y-4">
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-4 ml-2">System Vitals</h3>
          
          <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm flex items-center gap-4">
            <div className="h-12 w-12 bg-green-100 dark:bg-green-900/20 text-green-500 rounded-2xl flex items-center justify-center">
              <Server size={20} />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase text-slate-400">Server Status</p>
              <p className="text-lg font-bold text-slate-800 dark:text-white">D1, D2, D5 ONLINE</p>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm flex items-center gap-4">
            <div className="h-12 w-12 bg-blue-100 dark:bg-blue-900/20 text-[#1e3a8a] rounded-2xl flex items-center justify-center">
              <ShieldCheck size={20} />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase text-slate-400">Security Layer</p>
              <p className="text-lg font-bold text-slate-800 dark:text-white">Firewall Active</p>
            </div>
          </div>
        </div>

        {/* Live Audit Log Terminal */}
        <div className="lg:col-span-2 bg-slate-900 rounded-[2.5rem] p-8 shadow-2xl border border-slate-800 overflow-hidden relative">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Terminal className="text-[#92c37c]" size={20} />
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Live Audit Logs (D5)</h3>
            </div>
            <div className="flex gap-1.5">
              <div className="h-2 w-2 rounded-full bg-red-500/50" />
              <div className="h-2 w-2 rounded-full bg-amber-500/50" />
              <div className="h-2 w-2 rounded-full bg-green-500/50" />
            </div>
          </div>

          <div className="space-y-4 font-mono text-[11px]">
            {logs.map((log) => (
              <div key={log.id} className="flex items-start gap-4 border-b border-slate-800 pb-3 last:border-0">
                <span className="text-slate-600">[{log.time}]</span>
                <span className={log.status === 'Blocked' ? 'text-red-400' : 'text-[#92c37c]'}>
                  {log.event}
                </span>
                <span className="text-slate-500 ml-auto">{log.user}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
};

export default AdminDashboard;