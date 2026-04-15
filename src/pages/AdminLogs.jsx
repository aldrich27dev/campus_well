import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Terminal, ShieldCheck, Database, Server, RefreshCw, Trash2 } from 'lucide-react';

const AdminLogs = () => {
  // Mock logs representing Data Store D5
  const [logs] = useState([
    { id: 1, time: "10:45:22", event: "User Auth Success", detail: "UID: 2022-0001 (Aldrich)", status: "Secure" },
    { id: 2, time: "10:46:05", event: "D2 Write Operation", detail: "New Assessment Entry #882", status: "Success" },
    { id: 3, time: "10:48:12", event: "API Request: /analytics", detail: "Request Origin: Counselor-IP", status: "Success" },
    { id: 4, time: "11:02:45", event: "Firewall Block", detail: "Unauthorized Attempt from 192.168.1.50", status: "Blocked" },
  ]);

  return (
    <main className="p-8 bg-slate-50 dark:bg-slate-950 min-h-screen">
      <header className="mb-10 flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-black text-slate-800 dark:text-white uppercase italic tracking-tighter">
            System Monitoring
          </h1>
          <p className="text-slate-500 font-medium">Process 3.2 // Data Store D5: Audit Trail</p>
        </div>
        <button className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-400 hover:text-[#1e3a8a] transition-all shadow-sm">
          <RefreshCw size={20} />
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* System Vitals Column */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800">
            <Server className="text-emerald-500 mb-2" size={24} />
            <p className="text-[10px] font-black uppercase text-slate-400">Database Status</p>
            <p className="text-xl font-bold text-slate-800 dark:text-white uppercase">D1, D2, D5 Active</p>
          </div>
          
          <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800">
            <ShieldCheck className="text-blue-500 mb-2" size={24} />
            <p className="text-[10px] font-black uppercase text-slate-400">Security Layer</p>
            <p className="text-xl font-bold text-slate-800 dark:text-white uppercase">AES-256 Active</p>
          </div>
        </div>

        {/* Live Terminal Column */}
        <div className="lg:col-span-3 bg-slate-900 rounded-[2.5rem] p-8 shadow-2xl border border-slate-800">
          <div className="flex items-center justify-between mb-8 border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <Terminal className="text-[#92c37c]" size={20} />
              <h2 className="text-xs font-black uppercase tracking-widest text-slate-400">Security Audit Logs</h2>
            </div>
            <button className="text-slate-600 hover:text-red-400 transition-colors">
              <Trash2 size={16} />
            </button>
          </div>

          <div className="space-y-4 font-mono text-[11px]">
            {logs.map((log) => (
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                key={log.id} 
                className="flex items-start gap-4 border-b border-slate-800/50 pb-3 last:border-0"
              >
                <span className="text-slate-600">[{log.time}]</span>
                <span className="text-blue-400 font-bold">{log.event}</span>
                <span className="text-slate-400">{log.detail}</span>
                <span className={`ml-auto px-2 py-0.5 rounded text-[9px] font-black uppercase ${
                  log.status === 'Blocked' ? 'bg-red-500/10 text-red-500' : 'bg-emerald-500/10 text-emerald-500'
                }`}>
                  {log.status}
                </span>
              </motion.div>
            ))}
            <div className="pt-4 text-slate-700 animate-pulse">
              _ Root: System listening for events...
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default AdminLogs;