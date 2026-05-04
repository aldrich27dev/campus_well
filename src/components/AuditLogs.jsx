import React from 'react';
import { ShieldCheck, Download, Database } from 'lucide-react';

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
      Success: "bg-campus-green/10 text-campus-green border-campus-green/20",
      Warning: "bg-amber-500/10 text-amber-600 border-amber-500/20",
      Danger: "bg-rose-500/10 text-rose-600 border-rose-500/20",
      Info: "bg-campus-blue/10 text-campus-blue border-campus-blue/20",
    };
    return themes[status] || "bg-muted/20 text-muted-foreground border-border";
  };

  return (
    <div className="bg-surface dark:bg-surface-elevated rounded-[2.5rem] p-8 border border-border shadow-surface transition-all duration-300">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 bg-campus-blue rounded-2xl flex items-center justify-center text-primary-foreground shadow-soft">
            <Database size={22} />
          </div>
          <div>
            <h3 className="font-black text-foreground uppercase tracking-tighter italic flex items-center gap-2">
              System Audit Trail <span className="text-campus-blue dark:text-campus-green">P-1.7</span>
            </h3>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">
              GRC IT Department // CampusWell Security
            </p>
          </div>
        </div>

        <button className="flex items-center gap-2 text-[10px] font-black text-campus-blue dark:text-campus-green border border-campus-blue/20 px-5 py-2.5 rounded-xl hover:bg-campus-blue hover:text-primary-foreground transition-all uppercase tracking-widest">
          <Download size={14} /> Export_Log.CSV
        </button>
      </div>

      <div className="overflow-x-auto scrollbar-hide">
        <table className="w-full text-left border-separate border-spacing-y-3">
          <thead>
            <tr className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">
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
                <td className="py-5 pl-6 rounded-l-[1.5rem] bg-muted/40 dark:bg-muted/25 border-y border-l border-border group-hover:bg-campus-blue/5 transition-colors">
                  <span className="text-xs font-black text-campus-blue dark:text-campus-green italic">@{log.user}</span>
                </td>

                <td className="py-5 bg-muted/40 dark:bg-muted/25 border-y border-border group-hover:bg-campus-blue/5">
                  <span className="text-xs text-foreground font-bold tracking-tight">{log.action}</span>
                </td>

                <td className="py-5 bg-muted/40 dark:bg-muted/25 border-y border-border group-hover:bg-campus-blue/5">
                  <span className="text-[9px] font-black text-muted-foreground uppercase px-2 py-1 bg-surface dark:bg-surface-elevated rounded-lg border border-border">
                    {log.module}
                  </span>
                </td>

                <td className="py-5 bg-muted/40 dark:bg-muted/25 border-y border-border group-hover:bg-campus-blue/5">
                  <span className={`px-3 py-1 rounded-full text-[9px] font-black border uppercase tracking-widest ${getStatusStyle(log.status)}`}>
                    {log.status}
                  </span>
                </td>

                <td className="py-5 pr-6 rounded-r-[1.5rem] bg-muted/40 dark:bg-muted/25 border-y border-r border-border text-right group-hover:bg-campus-blue/5 transition-colors">
                  <span className="text-[10px] text-muted-foreground font-mono italic font-bold">
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
          <ShieldCheck size={14} className="text-campus-green" />
          <span className="text-[9px] font-black text-campus-green uppercase tracking-[0.2em]">P-8.1 Maintenance Complete</span>
        </div>
        <span className="text-[9px] font-mono text-campus-blue dark:text-campus-green font-bold opacity-50 uppercase">Secured by GRC_IT_V2</span>
      </div>
    </div>
  );
};

export default AuditLogs;
