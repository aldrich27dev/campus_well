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
    { label: 'Total Campus Users', value: '1,240', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'System-Wide Alerts', value: '42', icon: AlertCircle, color: 'text-rose-600', bg: 'bg-rose-50' },
    { label: 'Active Counselors', value: '8', icon: Shield, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Campus Sentiment', value: '8.2', icon: TrendingUp, color: 'text-amber-600', bg: 'bg-amber-50' },
  ] : [
    { label: 'My Managed Cases', value: '124', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'High Stress Alerts', value: '12', icon: AlertCircle, color: 'text-rose-600', bg: 'bg-rose-50' },
    { label: 'Resolved Sessions', value: '85', icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Avg. Wellness Score', value: '7.8', icon: TrendingUp, color: 'text-amber-600', bg: 'bg-amber-50' },
  ];

  return (
    // Mobile: p-4 | Desktop: p-8 lg:p-12
    <div className="p-4 md:p-8 lg:p-12 max-w-7xl mx-auto space-y-6 md:space-y-10">
      
      {/* Header - Stacks on mobile */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-[#1e3a8a] dark:text-white tracking-tighter uppercase italic">
            {userRole === 'admin' ? 'System Analytics' : 'Case Analytics'}
          </h1>
          <p className="text-slate-400 text-[10px] md:text-xs font-bold uppercase tracking-widest mt-2">
            {userRole === 'admin' 
              ? 'Campus-Wide Oversight • Process 3.3' 
              : 'Assigned Metrics • Process 2.2'}
          </p>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <Button variant="outline" size="sm" className="flex-1 md:flex-none text-[9px] md:text-[10px] font-black uppercase tracking-widest py-3">
            Export
          </Button>
          <Button className="flex-1 md:flex-none bg-[#1e3a8a] text-white text-[9px] md:text-[10px] font-black uppercase tracking-widest px-6 py-3">
            Sync
          </Button>
        </div>
      </div>

      {/* Stats Grid - 1 col on mobile, 2 on tablet, 4 on desktop */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {stats.map((stat) => (
          <Card key={stat.label} className="p-5 md:p-6 border-none shadow-sm bg-white dark:bg-slate-900 rounded-[1.5rem] md:rounded-[2rem]">
            <div className="flex items-start justify-between">
              <div className={`p-2.5 md:p-3 rounded-xl md:rounded-2xl ${stat.bg} ${stat.color}`}>
                <stat.icon size={20} />
              </div>
              <span className="text-[9px] md:text-[10px] font-black text-emerald-500 flex items-center gap-1">
                +12% <ArrowUpRight size={10} />
              </span>
            </div>
            <div className="mt-3 md:mt-4">
              <h3 className="text-2xl md:text-3xl font-black text-slate-800 dark:text-white">{stat.value}</h3>
              <p className="text-slate-400 text-[9px] md:text-[10px] font-bold uppercase tracking-widest mt-1">
                {stat.label}
              </p>
            </div>
          </Card>
        ))}
      </div>

      {/* Main Charts Area - Stacks on mobile */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        <Card className="lg:col-span-2 p-6 md:p-8 border-none shadow-sm bg-white dark:bg-slate-900 rounded-[2rem] md:rounded-[2.5rem] min-h-[300px] md:min-h-[400px] flex flex-col">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 md:mb-8 gap-4">
            <h3 className="text-[11px] md:text-sm font-black text-[#1e3a8a] dark:text-white uppercase tracking-widest flex items-center gap-2">
              <BarChart3 size={16} /> Trends
            </h3>
            <select className="w-full sm:w-auto bg-slate-50 dark:bg-slate-800 text-[9px] font-black uppercase p-2.5 rounded-xl outline-none border-none">
              <option>Last 30 Days</option>
              <option>Last 6 Months</option>
            </select>
          </div>
          <div className="flex-1 bg-slate-50 dark:bg-slate-800/50 rounded-[1.5rem] md:rounded-[2rem] border-2 border-dashed border-slate-200 dark:border-slate-700 flex items-center justify-center p-4 text-center">
             <p className="text-slate-300 font-black uppercase tracking-[0.2em] text-[9px]">
               {userRole === 'admin' ? 'D5: System Log Viz' : 'D2: Student Data Viz'}
             </p>
          </div>
        </Card>

        <Card className="p-6 md:p-8 border-none shadow-sm bg-white dark:bg-slate-900 rounded-[2rem] md:rounded-[2.5rem] flex flex-col">
          <h3 className="text-[11px] md:text-sm font-black text-[#1e3a8a] dark:text-white uppercase tracking-widest flex items-center gap-2 mb-6 md:mb-8">
            <PieChart size={16} /> Distribution
          </h3>
          <div className="flex-1 flex flex-col justify-center gap-5 md:gap-6">
            {['Great', 'Okay', 'Down', 'Stressed'].map((mood, i) => (
              <div key={mood} className="space-y-2">
                <div className="flex justify-between text-[9px] md:text-[10px] font-black uppercase tracking-widest">
                  <span className="text-slate-500">{mood}</span>
                  <span className="text-slate-800 dark:text-white">{[45, 25, 15, 15][i]}%</span>
                </div>
                <div className="h-1.5 md:h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${['bg-emerald-400', 'bg-blue-400', 'bg-amber-400', 'bg-rose-400'][i]}`} 
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