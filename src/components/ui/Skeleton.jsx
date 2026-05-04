import React from 'react';
import { motion } from 'framer-motion';
import { LayoutGrid, Heart, TrendingUp, CalendarDays, Sparkles } from 'lucide-react';

const SkeletonBlock = ({ className = '' }) => (
  <div className={`animate-pulse rounded-2xl bg-muted/60 dark:bg-muted/30 ${className}`} />
);

const MotionSection = motion.section;

const DashboardSkeleton = ({ title = 'Loading Dashboard', subtitle = 'Fetching your campus wellness data...' }) => {
  return (
    <div className="min-h-[100dvh] w-full bg-background px-4 py-6 md:px-6 md:py-10">
      <div className="mx-auto w-full max-w-7xl space-y-6 md:space-y-8">
        <div className="flex items-center justify-between gap-4">
          <div className="space-y-3">
            <SkeletonBlock className="h-4 w-28 rounded-full" />
            <div className="space-y-2">
              <SkeletonBlock className="h-8 w-56 max-w-[80vw]" />
              <SkeletonBlock className="h-3 w-40" />
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-2 rounded-2xl border border-border bg-surface dark:bg-surface-elevated px-4 py-3">
            <LayoutGrid size={16} className="text-campus-blue dark:text-campus-green" />
            <SkeletonBlock className="h-3 w-24" />
          </div>
        </div>

        <div className="rounded-[2rem] border border-border bg-surface dark:bg-surface-elevated p-5 md:p-6 shadow-xl">
          <div className="flex flex-col gap-2">
            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-campus-blue dark:text-campus-green">{title}</p>
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6">
          <MotionSection
            initial={{ opacity: 0.5 }}
            animate={{ opacity: 1 }}
            transition={{ repeat: Infinity, repeatType: 'reverse', duration: 1.4 }}
            className="lg:col-span-12 rounded-[2.5rem] border border-border bg-surface dark:bg-surface-elevated p-5 md:p-8 shadow-2xl"
          >
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-campus-blue dark:text-campus-green">
                  <Heart size={16} />
                  <SkeletonBlock className="h-3 w-40" />
                </div>
                <SkeletonBlock className="h-6 w-56 max-w-[80vw]" />
                <SkeletonBlock className="h-3 w-72 max-w-[90vw]" />
              </div>
              <div className="flex flex-wrap gap-2">
                <SkeletonBlock className="h-9 w-28 rounded-full" />
                <SkeletonBlock className="h-9 w-28 rounded-full" />
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="rounded-[1.75rem] border border-border bg-muted/30 dark:bg-muted/20 p-4 md:p-5">
                  <SkeletonBlock className="h-4 w-16" />
                  <SkeletonBlock className="mt-4 h-12 w-full rounded-[1.25rem]" />
                  <SkeletonBlock className="mt-4 h-3 w-20" />
                </div>
              ))}
            </div>
          </MotionSection>

          <section className="lg:col-span-8 rounded-[2.5rem] border border-border bg-surface dark:bg-surface-elevated p-5 md:p-8 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-campus-green">
                  <TrendingUp size={16} />
                  <SkeletonBlock className="h-3 w-36" />
                </div>
                <SkeletonBlock className="h-6 w-64 max-w-[85vw]" />
              </div>
              <SkeletonBlock className="hidden sm:block h-9 w-28 rounded-full" />
            </div>

            <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-3 md:gap-4">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="rounded-[1.5rem] border border-border bg-muted/30 dark:bg-muted/20 p-4">
                  <SkeletonBlock className="h-3 w-14" />
                  <SkeletonBlock className="mt-4 h-24 w-full rounded-[1.25rem]" />
                </div>
              ))}
            </div>
          </section>

          <aside className="lg:col-span-4 rounded-[2.5rem] border border-border bg-surface dark:bg-surface-elevated p-5 md:p-8 shadow-2xl">
            <div className="flex items-center gap-2 text-campus-blue dark:text-campus-green">
              <CalendarDays size={16} />
              <SkeletonBlock className="h-3 w-28" />
            </div>
            <SkeletonBlock className="mt-3 h-6 w-40" />

            <div className="mt-6 space-y-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="rounded-[1.5rem] border border-border bg-muted/30 dark:bg-muted/20 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="space-y-2">
                      <SkeletonBlock className="h-3 w-20" />
                      <SkeletonBlock className="h-4 w-32 max-w-[70vw]" />
                    </div>
                    <Sparkles size={16} className="text-campus-green" />
                  </div>
                  <SkeletonBlock className="mt-4 h-3 w-full" />
                </div>
              ))}
            </div>
          </aside>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {Array.from({ length: 2 }).map((_, index) => (
            <div key={index} className="rounded-[2rem] border border-border bg-surface dark:bg-surface-elevated p-5 md:p-6 shadow-xl">
              <SkeletonBlock className="h-4 w-24" />
              <SkeletonBlock className="mt-4 h-24 w-full rounded-[1.5rem]" />
              <SkeletonBlock className="mt-4 h-3 w-40" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardSkeleton;
