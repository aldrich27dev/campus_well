import React from 'react';
import {
  TrendingUp, Users, AlertCircle, CheckCircle2,
  BarChart3, PieChart, ArrowUpRight, Shield
} from 'lucide-react';
import { Card, Button } from '../components/UI';
import { useSystem } from '../context/SystemContext';

const Analytics = () => {
  const { userRole = 'student' } = useSystem();

  const stats = userRole === 'admin' ? [
    { label: 'Total Campus Users', value: '1,240', icon: Users, color: 'text-campus-blue', bg: 'bg-campus-blue/10 dark:bg-campus-blue/15' },
    { label: 'System-Wide Alerts', value: '42', icon: AlertCircle, color: 'text-rose-600', bg: 'bg-rose-50/70 dark:bg-rose-500/10' },
    { label: 'Active Counselors', value: '8', icon: Shield, color: 'text-campus-green', bg: 'bg-emerald-50/70 dark:bg-emerald-500/10' },
    { label: 'Campus Sentiment', value: '8.2', icon: TrendingUp, color: 'text-amber-600', bg: 'bg-amber-50/70 dark:bg-amber-500/10' },
  ] : [
    { label: 'My Managed Cases', value: '124', icon: Users, color: 'text-campus-blue', bg: 'bg-campus-blue/10 dark:bg-campus-blue/15' },
    { label: 'High Stress Alerts', value: '12', icon: AlertCircle, color: 'text-rose-600', bg: 'bg-rose-50/70 dark:bg-rose-500/10' },
    { label: 'Resolved Sessions', value: '85', icon: CheckCircle2, color: 'text-campus-green', bg: 'bg-emerald-50/70 dark:bg-emerald-500/10' },
    { label: 'Avg. Wellness Score', value: '7.8', icon: TrendingUp, color: 'text-amber-600', bg: 'bg-amber-50/70 dark:bg-amber-500/10' },
  ];

  return (
    <div className="p-4 md:p-8 lg:p-12 max-w-7xl mx-auto space-y-6 md:space-y-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-campus-blue dark:text-campus-green tracking-tighter uppercase italic">
            {userRole === 'admin' ? 'System Analytics' : 'Case Analytics'}
          </h1>
          <p className="text-muted-foreground text-[10px] md:text-xs font-bold uppercase tracking-widest mt-2">
            {userRole === 'admin' ? 'Campus-Wide Oversight • Process 3.3' : 'Assigned Metrics • Process 2.2'}
          </p>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <Button variant="outline" size="sm" className="flex-1 md:flex-none text-[9px] md:text-[10px] font-black uppercase tracking-widest py-3">
            Export
          </Button>
          <Button className="flex-1 md:flex-none bg-campus-blue text-primary-foreground text-[9px] md:text-[10px] font-black uppercase tracking-widest px-6 py-3">
            Sync
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {stats.map((stat) => (
          <Card key={stat.label} className="p-5 md:p-6 border-none shadow-sm bg-surface dark:bg-surface-elevated rounded-[1.5rem] md:rounded-[2rem]">
            <div className="flex items-start justify-between">
              <div className={`p-2.5 md:p-3 rounded-xl md:rounded-2xl ${stat.bg} ${stat.color}`}>
                <stat.icon size={20} />
              </div>
              <span className="text-[9px] md:text-[10px] font-black text-emerald-500 flex items-center gap-1">
                +12% <ArrowUpRight size={10} />
              </span>
            </div>
            <div className="mt-3 md:mt-4">
              <h3 className="text-2xl md:text-3xl font-black text-foreground">{stat.value}</h3>
              <p className="text-muted-foreground text-[9px] md:text-[10px] font-bold uppercase tracking-widest mt-1">
                {stat.label}
              </p>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        <Card className="lg:col-span-2 p-6 md:p-8 border-none shadow-sm bg-surface dark:bg-surface-elevated rounded-[2rem] md:rounded-[2.5rem] min-h-[300px] md:min-h-[400px] flex flex-col">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 md:mb-8 gap-4">
            <h3 className="text-[11px] md:text-sm font-black text-campus-blue dark:text-campus-green uppercase tracking-widest flex items-center gap-2">
              <BarChart3 size={16} /> Trends
            </h3>
            <select className="w-full sm:w-auto bg-muted/40 dark:bg-muted/20 text-[9px] font-black uppercase p-2.5 rounded-xl outline-none border border-border text-foreground">
              <option>Last 30 Days</option>
              <option>Last 6 Months</option>
            </select>
          </div>
          <div className="flex-1 bg-muted/30 dark:bg-muted/20 rounded-[1.5rem] md:rounded-[2rem] border-2 border-dashed border-border flex items-center justify-center p-4 text-center">
             <p className="text-muted-foreground font-black uppercase tracking-[0.2em] text-[9px]">
               {userRole === 'admin' ? 'D5: System Log Viz' : 'D2: Student Data Viz'}
             </p>
          </div>
        </Card>

        <Card className="p-6 md:p-8 border-none shadow-sm bg-surface dark:bg-surface-elevated rounded-[2rem] md:rounded-[2.5rem] flex flex-col">
          <h3 className="text-[11px] md:text-sm font-black text-campus-blue dark:text-campus-green uppercase tracking-widest flex items-center gap-2 mb-6 md:mb-8">
            <PieChart size={16} /> Distribution
          </h3>
          <div className="flex-1 flex flex-col justify-center gap-5 md:gap-6">
            {['Great', 'Okay', 'Down', 'Stressed'].map((mood, i) => (
              <div key={mood} className="space-y-2">
                <div className="flex justify-between text-[9px] md:text-[10px] font-black uppercase tracking-widest">
                  <span className="text-muted-foreground">{mood}</span>
                  <span className="text-foreground">{[45, 25, 15, 15][i]}%</span>
                </div>
                <div className="h-1.5 md:h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${['bg-campus-green', 'bg-campus-blue', 'bg-amber-400', 'bg-rose-400'][i]}`}
                    style={{ width: `${[45, 25, 15, 15][i]}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;
