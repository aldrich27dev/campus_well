import React, { useEffect, useState } from 'react';
import { Users, ShieldCheck, Search, Edit, Trash2, UserPlus, Terminal, Server } from 'lucide-react';
import DashboardSkeleton from '../components/ui/Skeleton';

const AdminDashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const users = [
    { id: '2022-0001', name: 'Aldrich Naag', role: 'Student', yearLevel: '2nd Year', status: 'Active' },
    { id: 'C-9901', name: 'Dr. Santos', role: 'Counselor', status: 'Active' },
    { id: '2022-0052', name: 'Juan Dela Cruz', role: 'Student', yearLevel: '3rd Year', status: 'Pending' },
  ];

  const logs = [
    { id: 1, event: "Process 0.0: Login Success", user: "Aldrich", time: "2 mins ago", status: "Secure" },
    { id: 2, event: "D2: WellnessDB Write", user: "System", time: "15 mins ago", status: "Success" },
    { id: 3, event: "Unauthorized Access Attempt", user: "Unknown IP", time: "1 hour ago", status: "Blocked" },
  ];

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 900);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <DashboardSkeleton title="Loading Admin Dashboard" subtitle="Synchronizing registry and audit data..." />;
  }

  return (
    <main className="min-h-screen bg-background px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <div className="mx-auto max-w-7xl">
      <header className="mb-8 md:mb-10 flex flex-col md:flex-row justify-between gap-4 md:items-end">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-foreground uppercase italic tracking-tighter">
            System Control
          </h1>
          <p className="text-muted-foreground font-medium">CampusWell Administrative Hub // Process 3.0</p>
        </div>

        <button className="flex items-center gap-2 bg-campus-blue text-primary-foreground px-6 py-3 rounded-2xl font-bold text-xs uppercase tracking-widest shadow-soft hover:scale-105 transition-transform">
          <UserPlus size={16} /> Add New Account
        </button>
      </header>

      <section className="bg-surface dark:bg-surface-elevated rounded-[2.5rem] shadow-xl border border-border overflow-hidden">
        <div className="p-5 sm:p-8 border-b border-border flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h2 className="text-lg font-black uppercase tracking-tight text-foreground">User Registry (D1)</h2>

          <div className="relative w-full md:w-72">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <input
              type="text"
              placeholder="Search ID or Name..."
              className="w-full pl-12 pr-4 py-3 bg-muted/30 dark:bg-muted/20 border border-border rounded-xl text-sm font-bold focus:ring-2 ring-campus-blue outline-none text-foreground"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-muted/30 dark:bg-muted/15">
              <tr>
                <th className="px-5 sm:px-8 py-4 text-[10px] font-black uppercase text-muted-foreground tracking-widest">User ID</th>
                <th className="px-5 sm:px-8 py-4 text-[10px] font-black uppercase text-muted-foreground tracking-widest">Full Name</th>
                <th className="px-5 sm:px-8 py-4 text-[10px] font-black uppercase text-muted-foreground tracking-widest">Year Level</th>
                <th className="px-5 sm:px-8 py-4 text-[10px] font-black uppercase text-muted-foreground tracking-widest">Role</th>
                <th className="px-5 sm:px-8 py-4 text-[10px] font-black uppercase text-muted-foreground tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-muted/30 dark:hover:bg-muted/15 transition-colors">
                  <td className="px-5 sm:px-8 py-5 font-mono text-xs text-muted-foreground">{user.id}</td>
                  <td className="px-5 sm:px-8 py-5 font-bold text-foreground">{user.name}</td>
                  <td className="px-5 sm:px-8 py-5">
                    <span className="text-[10px] px-3 py-1 rounded-full font-black uppercase bg-campus-green/10 text-campus-green">
                      {user.yearLevel || 'N/A'}
                    </span>
                  </td>
                  <td className="px-5 sm:px-8 py-5">
                    <span className={`text-[10px] px-3 py-1 rounded-full font-black uppercase ${
                      user.role === 'Counselor' ? 'bg-campus-green/10 text-campus-green' : 'bg-campus-blue/10 text-campus-blue'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-5 sm:px-8 py-5 text-right">
                    <div className="flex justify-end gap-2">
                      <button className="p-2 text-muted-foreground hover:text-campus-blue transition-colors"><Edit size={18} /></button>
                      <button className="p-2 text-muted-foreground hover:text-rose-500 transition-colors"><Trash2 size={18} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <div className="mt-10 md:mt-12 grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        <div className="lg:col-span-1 space-y-4">
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground mb-4 ml-2">System Vitals</h3>

          <div className="bg-surface dark:bg-surface-elevated p-6 rounded-[2rem] border border-border shadow-sm flex items-center gap-4">
            <div className="h-12 w-12 bg-campus-green/10 text-campus-green rounded-2xl flex items-center justify-center">
              <Server size={20} />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase text-muted-foreground">Server Status</p>
              <p className="text-lg font-bold text-foreground">D1, D2, D5 ONLINE</p>
            </div>
          </div>

          <div className="bg-surface dark:bg-surface-elevated p-6 rounded-[2rem] border border-border shadow-sm flex items-center gap-4">
            <div className="h-12 w-12 bg-campus-blue/10 text-campus-blue rounded-2xl flex items-center justify-center">
              <ShieldCheck size={20} />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase text-muted-foreground">Security Layer</p>
              <p className="text-lg font-bold text-foreground">Firewall Active</p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 bg-surface dark:bg-surface-elevated rounded-[2.5rem] p-8 shadow-2xl border border-border overflow-hidden relative">
          <div className="flex items-center justify-between mb-8 border-b border-border pb-4">
            <div className="flex items-center gap-3">
              <Terminal className="text-campus-green" size={20} />
              <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground">Live Audit Logs (D5)</h3>
            </div>
            <div className="flex gap-1.5">
              <div className="h-2 w-2 rounded-full bg-red-500/50" />
              <div className="h-2 w-2 rounded-full bg-amber-500/50" />
              <div className="h-2 w-2 rounded-full bg-green-500/50" />
            </div>
          </div>

          <div className="space-y-4 font-mono text-[11px]">
            {logs.map((log) => (
              <div key={log.id} className="flex items-start gap-4 border-b border-border pb-3 last:border-0">
                <span className="text-muted-foreground">[{log.time}]</span>
                <span className={log.status === 'Blocked' ? 'text-rose-400' : 'text-campus-green'}>
                  {log.event}
                </span>
                <span className="text-muted-foreground ml-auto">{log.user}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      </div>
    </main>
  );
};

export default AdminDashboard;
