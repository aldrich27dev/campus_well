import React from 'react';
import { ShieldCheck, Download, Terminal, Database } from 'lucide-react';

// Module 8.0: System Maintenance & Security Audit
const AuditLogs = () => {
  const logs = [
    { id: 101, user: "Admin_Aldrich", action: "Updated Security Policy", module: "System", status: "Critical", time: "10 mins ago" },
    { id: 102, user: "Counselor_Jane", action: "Accessed Student Record #2024-001", module: "Records", status: "Info", time: "25 mins ago" },
    { id: 103, user: "System_Bot", action: "Daily Database Backup Completed", module: "Database", status: "Success", time: "1 hour ago" },
    { id: 104, user: "Admin_Aldrich", action: "Authorized New Counselor Account", module: "Users", status: "Warning", time: "3 hours ago" },
    { id: 105, user: "Student_2024-08", action: "Failed Login Attempt (IP: 192.168.1.1)", module: "Auth", status: "Danger", time: "5 hours ago" },
  ];

  const getStatusStyle = (status) => {
    const themes = {
      Critical: "bg-rose-500/10 text-rose-600 border-rose-500/20",
      Success: "bg-[#92c37c]/10 text-[#92c37c] border-[#92c37c]/20", // Campus Green
      Warning: "bg-amber-500/10 text-amber-600 border-amber-500/20",
      Danger: "bg-rose-500/10 text-rose-600 border-rose-500/20",
      Info: "bg-[#1e3a8a]/10 text-[#1e3a8a] dark:text-blue-400 border-[#1e3a8a]/20", // Campus Blue
    };
    return themes[status] || "bg-slate-500/10 text-slate-500";
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border border-slate-100 dark:border-slate-800 shadow-sm transition-all duration-300">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div className="flex items-center gap-4">
          {/* Brand Themed Icon Box */}
          <div className="h-12 w-12 bg-[#1e3a8a] rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-900/20">
            <Database size={22} />
          </div>
          <div>
            <h3 className="font-black text-slate-800 dark:text-white uppercase tracking-tighter italic flex items-center gap-2">
              System Audit Trail <span className="text-[#1e3a8a] dark:text-[#92c37c]">P-1.7</span>
            </h3>
            <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-1">
              GRC IT Department // CampusWell Security
            </p>
          </div>
        </div>
        
        {/* Campus Blue Button */}
        <button className="flex items-center gap-2 text-[10px] font-black text-[#1e3a8a] dark:text-blue-400 border border-[#1e3a8a]/20 px-5 py-2.5 rounded-xl hover:bg-[#1e3a8a] hover:text-white transition-all uppercase tracking-widest">
          <Download size={14} /> Export_Log.CSV
        </button>
      </div>

      <div className="overflow-x-auto scrollbar-hide">
        <table className="w-full text-left border-separate border-spacing-y-3">
          <thead>
            <tr className="text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-[0.2em]">
              <th className="pb-4 pl-6">Initiator</th>
              <th className="pb-4">Action Taken</th>
              <th className="pb-4">Target Module</th>
              <th className="pb-4">Level</th>
              <th className="pb-4 text-right pr-6">Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log.id} className="group">
                <td className="py-5 pl-6 rounded-l-[1.5rem] bg-slate-50/50 dark:bg-slate-800/30 border-y border-l border-slate-100 dark:border-slate-800 group-hover:bg-[#1e3a8a]/5 transition-colors">
                  <span className="text-xs font-black text-[#1e3a8a] dark:text-blue-400 italic">@{log.user}</span>
                </td>
                
                <td className="py-5 bg-slate-50/50 dark:bg-slate-800/30 border-y border-slate-100 dark:border-slate-800 group-hover:bg-[#1e3a8a]/5">
                  <span className="text-xs text-slate-600 dark:text-slate-300 font-bold tracking-tight">{log.action}</span>
                </td>
                
                <td className="py-5 bg-slate-50/50 dark:bg-slate-800/30 border-y border-slate-100 dark:border-slate-800 group-hover:bg-[#1e3a8a]/5">
                  <span className="text-[9px] font-black text-slate-500 dark:text-slate-400 uppercase px-2 py-1 bg-white dark:bg-slate-900 rounded-lg border border-slate-100 dark:border-slate-700">
                    {log.module}
                  </span>
                </td>
                
                <td className="py-5 bg-slate-50/50 dark:bg-slate-800/30 border-y border-slate-100 dark:border-slate-800 group-hover:bg-[#1e3a8a]/5">
                  <span className={`px-3 py-1 rounded-full text-[9px] font-black border uppercase tracking-widest ${getStatusStyle(log.status)}`}>
                    {log.status}
                  </span>
                </td>
                
                <td className="py-5 pr-6 rounded-r-[1.5rem] bg-slate-50/50 dark:bg-slate-800/30 border-y border-r border-slate-100 dark:border-slate-800 text-right group-hover:bg-[#1e3a8a]/5 transition-colors">
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono italic font-bold">
                    {log.time}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-8 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldCheck size={14} className="text-[#92c37c]" />
          <span className="text-[9px] font-black text-[#92c37c] uppercase tracking-[0.2em]">P-8.1 Maintenance Complete</span>
        </div>
        <span className="text-[9px] font-mono text-[#1e3a8a] dark:text-blue-500 font-bold opacity-50 uppercase">Secured by GRC_IT_V2</span>
      </div>
    </div>
  );
};

export default AuditLogs;