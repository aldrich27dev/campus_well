import React from 'react';
import { motion } from 'framer-motion';
import { Download, BarChart3, CalendarCheck2, MessageSquareText, PieChart, FileDown } from 'lucide-react';
import { Card, Button } from '../components/UI';

const scheduleData = [
  { label: 'Scheduled', value: 18, color: 'bg-campus-blue' },
  { label: 'Completed', value: 13, color: 'bg-campus-green' },
  { label: 'Pending', value: 4, color: 'bg-amber-400' },
  { label: 'Cancelled', value: 2, color: 'bg-rose-400' },
];

const trendData = [
  { label: 'Academic Stress', value: 42 },
  { label: 'Anxiety', value: 33 },
  { label: 'Sleep Issues', value: 18 },
  { label: 'Low Mood', value: 27 },
];

const commonConcerns = [
  { label: 'Exams & Deadlines', count: 14 },
  { label: 'Sleep Quality', count: 10 },
  { label: 'Family Pressure', count: 8 },
  { label: 'Social Anxiety', count: 6 },
];

const Reports = () => {
  const exportCSV = () => {
    const rows = [
      ['Type', 'Label', 'Value'],
      ...scheduleData.map(item => ['Schedule', item.label, item.value]),
      ...trendData.map(item => ['Trend', item.label, item.value]),
    ];
    const csv = rows.map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'campuswell-reports.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-4 md:p-8 lg:p-12 max-w-7xl mx-auto space-y-6 md:space-y-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-campus-blue dark:text-campus-green tracking-tighter uppercase italic">
            Reports
          </h1>
          <p className="text-muted-foreground text-[10px] md:text-xs font-bold uppercase tracking-widest mt-2">
            Schedule performance and counseling trends
          </p>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <Button variant="outline" className="flex-1 md:flex-none text-[9px] md:text-[10px] font-black uppercase tracking-widest py-3" onClick={exportCSV}>
            <FileDown size={14} /> Export CSV
          </Button>
          <Button className="flex-1 md:flex-none bg-campus-blue text-primary-foreground text-[9px] md:text-[10px] font-black uppercase tracking-widest px-6 py-3" onClick={exportCSV}>
            <Download size={14} /> Export Data
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 rounded-[2.5rem] p-6 md:p-8 bg-surface dark:bg-surface-elevated border border-border">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg md:text-xl font-black uppercase italic tracking-tighter text-foreground flex items-center gap-2">
                <CalendarCheck2 size={18} className="text-campus-blue dark:text-campus-green" />
                Schedules Overview
              </h2>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mt-1">
                Total appointments vs completed
              </p>
            </div>
            <Button variant="outline" className="hidden sm:flex text-[9px] uppercase tracking-widest py-2 px-4">
              Print
            </Button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4">
            {scheduleData.map((item) => (
              <div key={item.label} className="rounded-[1.5rem] bg-muted/30 dark:bg-muted/20 border border-border p-4">
                <div className={`h-2 w-14 rounded-full ${item.color} mb-4`} />
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">{item.label}</p>
                <p className="mt-2 text-3xl font-black text-foreground">{item.value}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 h-56 rounded-[2rem] border border-dashed border-border bg-muted/20 dark:bg-muted/15 p-4 flex items-end gap-3">
            {scheduleData.map((item) => (
              <motion.div
                key={item.label}
                initial={{ height: 0 }}
                animate={{ height: `${Math.max(item.value * 4, 18)}%` }}
                className={`flex-1 rounded-t-2xl ${item.color}`}
                style={{ height: `${Math.max(item.value * 4, 18)}%` }}
              />
            ))}
          </div>
        </Card>

        <Card className="rounded-[2.5rem] p-6 md:p-8 bg-surface dark:bg-surface-elevated border border-border">
          <h2 className="text-lg md:text-xl font-black uppercase italic tracking-tighter text-foreground flex items-center gap-2">
            <MessageSquareText size={18} className="text-campus-blue dark:text-campus-green" />
            Counseling Trends
          </h2>
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mt-1 mb-6">
            Common concerns and mood patterns
          </p>

          <div className="space-y-4">
            {trendData.map((trend) => (
              <div key={trend.label}>
                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                  <span className="text-muted-foreground">{trend.label}</span>
                  <span className="text-foreground">{trend.value}%</span>
                </div>
                <div className="mt-2 h-2 rounded-full bg-muted overflow-hidden">
                  <div className="h-full rounded-full bg-campus-green" style={{ width: `${trend.value}%` }} />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-[1.5rem] border border-border bg-muted/30 dark:bg-muted/20 p-4">
            <div className="flex items-center gap-2 mb-4">
              <PieChart size={16} className="text-campus-green" />
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Top Concerns</p>
            </div>
            <div className="space-y-3">
              {commonConcerns.map((item) => (
                <div key={item.label} className="flex items-center justify-between">
                  <span className="text-sm font-bold text-foreground">{item.label}</span>
                  <span className="text-xs font-black text-campus-blue dark:text-campus-green">{item.count}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Reports;
