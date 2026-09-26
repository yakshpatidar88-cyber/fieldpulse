import React from 'react';
import { JobPriority } from '../../types/job';
import { Flame, AlertTriangle, Clock, ArrowDown } from 'lucide-react';

interface JobPriorityBadgeProps {
  priority: JobPriority;
  size?: 'sm' | 'md';
}

export const JobPriorityBadge: React.FC<JobPriorityBadgeProps> = ({ priority, size = 'md' }) => {
  const sizeClasses = size === 'sm' ? 'text-[10px] px-2 py-0.5' : 'text-xs px-2.5 py-0.5';

  switch (priority) {
    case 'CRITICAL':
      return (
        <span
          className={`inline-flex items-center font-bold font-mono rounded-full border bg-rose-50 dark:bg-crimson-500/15 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-crimson-500/40 shadow-xs dark:shadow-[0_0_8px_rgba(244,63,94,0.25)] ${sizeClasses}`}
        >
          <Flame className="w-3 h-3 mr-1 text-rose-500 dark:text-rose-400 animate-pulse" />
          CRITICAL
        </span>
      );
    case 'HIGH':
      return (
        <span
          className={`inline-flex items-center font-semibold font-mono rounded-full border bg-amber-50 dark:bg-amber-500/15 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-500/30 ${sizeClasses}`}
        >
          <AlertTriangle className="w-3 h-3 mr-1 text-amber-500 dark:text-amber-400" />
          HIGH
        </span>
      );
    case 'MEDIUM':
      return (
        <span
          className={`inline-flex items-center font-medium font-mono rounded-full border bg-sky-50 dark:bg-cyan-500/15 text-sky-800 dark:text-cyan-300 border-sky-200 dark:border-cyan-500/30 ${sizeClasses}`}
        >
          <Clock className="w-3 h-3 mr-1 text-sky-500 dark:text-cyan-400" />
          MEDIUM
        </span>
      );
    case 'LOW':
      return (
        <span
          className={`inline-flex items-center font-medium font-mono rounded-full border bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 ${sizeClasses}`}
        >
          <ArrowDown className="w-3 h-3 mr-1 text-slate-400" />
          LOW
        </span>
      );
    default:
      return (
        <span className={`inline-flex items-center font-medium font-mono rounded-full border ${sizeClasses}`}>
          {priority}
        </span>
      );
  }
};
