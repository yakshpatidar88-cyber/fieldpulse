import React from 'react';
import { JobStatus } from '../../types/job';

interface JobStatusBadgeProps {
  status: JobStatus;
  size?: 'sm' | 'md';
}

export const JobStatusBadge: React.FC<JobStatusBadgeProps> = ({ status, size = 'md' }) => {
  const sizeClasses = size === 'sm' ? 'text-[10px] px-2 py-0.5' : 'text-xs px-2.5 py-0.5';

  switch (status) {
    case 'CREATED':
      return (
        <span
          className={`inline-flex items-center font-medium font-mono rounded-full border bg-slate-100 dark:bg-slate-500/10 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-500/20 ${sizeClasses}`}
        >
          <span className="w-1.5 h-1.5 rounded-full mr-1.5 bg-slate-400" />
          Created
        </span>
      );
    case 'TRIAGED':
      return (
        <span
          className={`inline-flex items-center font-medium font-mono rounded-full border bg-sky-50 dark:bg-cyan-500/10 text-sky-800 dark:text-cyan-300 border-sky-200 dark:border-cyan-500/30 ${sizeClasses}`}
        >
          <span className="w-1.5 h-1.5 rounded-full mr-1.5 bg-sky-500 dark:bg-cyan-400 animate-pulse" />
          Triaged
        </span>
      );
    case 'ASSIGNED':
      return (
        <span
          className={`inline-flex items-center font-medium font-mono rounded-full border bg-purple-50 dark:bg-purple-500/15 text-purple-800 dark:text-purple-300 border-purple-200 dark:border-purple-500/30 ${sizeClasses}`}
        >
          <span className="w-1.5 h-1.5 rounded-full mr-1.5 bg-purple-500 dark:bg-purple-400" />
          Assigned
        </span>
      );
    case 'ACCEPTED':
      return (
        <span
          className={`inline-flex items-center font-medium font-mono rounded-full border bg-blue-50 dark:bg-blue-500/15 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-500/30 ${sizeClasses}`}
        >
          <span className="w-1.5 h-1.5 rounded-full mr-1.5 bg-blue-500 dark:bg-blue-400" />
          Accepted
        </span>
      );
    case 'IN_PROGRESS':
      return (
        <span
          className={`inline-flex items-center font-medium font-mono rounded-full border bg-amber-50 dark:bg-amber-500/15 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-500/30 ${sizeClasses}`}
        >
          <span className="w-1.5 h-1.5 rounded-full mr-1.5 bg-amber-500 dark:bg-amber-400 animate-pulse" />
          In Progress
        </span>
      );
    case 'COMPLETED':
      return (
        <span
          className={`inline-flex items-center font-medium font-mono rounded-full border bg-emerald-50 dark:bg-sage-300/15 text-emerald-800 dark:text-sage-300 border-emerald-200 dark:border-sage-300/30 shadow-xs dark:shadow-[0_0_10px_rgba(175,209,155,0.15)] ${sizeClasses}`}
        >
          <span className="w-1.5 h-1.5 rounded-full mr-1.5 bg-emerald-600 dark:bg-sage-300" />
          Completed
        </span>
      );
    case 'CANCELLED':
      return (
        <span
          className={`inline-flex items-center font-medium font-mono rounded-full border bg-rose-50 dark:bg-rose-500/15 text-rose-800 dark:text-rose-300 border-rose-200 dark:border-rose-500/30 ${sizeClasses}`}
        >
          <span className="w-1.5 h-1.5 rounded-full mr-1.5 bg-rose-500" />
          Cancelled
        </span>
      );
    default:
      return (
        <span
          className={`inline-flex items-center font-medium font-mono rounded-full border bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 ${sizeClasses}`}
        >
          {status}
        </span>
      );
  }
};
