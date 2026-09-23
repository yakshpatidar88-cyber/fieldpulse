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
          className={`inline-flex items-center font-bold rounded-md border bg-rose-50 dark:bg-rose-500/15 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-500/30 ${sizeClasses}`}
        >
          <Flame className="w-3 h-3 mr-1 text-rose-500 animate-pulse" />
          CRITICAL
        </span>
      );
    case 'HIGH':
      return (
        <span
          className={`inline-flex items-center font-semibold rounded-md border bg-amber-50 dark:bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-500/30 ${sizeClasses}`}
        >
          <AlertTriangle className="w-3 h-3 mr-1 text-amber-500" />
          HIGH
        </span>
      );
    case 'MEDIUM':
      return (
        <span
          className={`inline-flex items-center font-medium rounded-md border bg-blue-50 dark:bg-blue-500/15 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-500/30 ${sizeClasses}`}
        >
          <Clock className="w-3 h-3 mr-1 text-blue-500" />
          MEDIUM
        </span>
      );
    case 'LOW':
      return (
        <span
          className={`inline-flex items-center font-medium rounded-md border bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 ${sizeClasses}`}
        >
          <ArrowDown className="w-3 h-3 mr-1 text-slate-400" />
          LOW
        </span>
      );
    default:
      return (
        <span className={`inline-flex items-center font-medium rounded-md border ${sizeClasses}`}>
          {priority}
        </span>
      );
  }
};
