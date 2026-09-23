import React from 'react';
import { JobStatus } from '../../types/job';

interface JobStatusBadgeProps {
  status: JobStatus;
  size?: 'sm' | 'md';
}

export const JobStatusBadge: React.FC<JobStatusBadgeProps> = ({ status, size = 'md' }) => {
  const sizeClasses = size === 'sm' ? 'text-[10px] px-2 py-0.5' : 'text-xs px-2.5 py-1';

  switch (status) {
    case 'CREATED':
      return (
        <span
          className={`inline-flex items-center font-medium rounded-full border bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700 ${sizeClasses}`}
        >
          <span className="w-1.5 h-1.5 rounded-full mr-1.5 bg-slate-400" />
          Created
        </span>
      );
    case 'TRIAGED':
      return (
        <span
          className={`inline-flex items-center font-medium rounded-full border bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-500/20 ${sizeClasses}`}
        >
          <span className="w-1.5 h-1.5 rounded-full mr-1.5 bg-blue-500" />
          Triaged
        </span>
      );
    case 'ASSIGNED':
      return (
        <span
          className={`inline-flex items-center font-medium rounded-full border bg-purple-50 dark:bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-500/20 ${sizeClasses}`}
        >
          <span className="w-1.5 h-1.5 rounded-full mr-1.5 bg-purple-500" />
          Assigned
        </span>
      );
    case 'ACCEPTED':
      return (
        <span
          className={`inline-flex items-center font-medium rounded-full border bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border-indigo-200 dark:border-indigo-500/20 ${sizeClasses}`}
        >
          <span className="w-1.5 h-1.5 rounded-full mr-1.5 bg-indigo-500" />
          Accepted
        </span>
      );
    case 'IN_PROGRESS':
      return (
        <span
          className={`inline-flex items-center font-medium rounded-full border bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-500/20 ${sizeClasses}`}
        >
          <span className="w-1.5 h-1.5 rounded-full mr-1.5 bg-amber-500 animate-pulse" />
          In Progress
        </span>
      );
    case 'COMPLETED':
      return (
        <span
          className={`inline-flex items-center font-medium rounded-full border bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20 ${sizeClasses}`}
        >
          <span className="w-1.5 h-1.5 rounded-full mr-1.5 bg-emerald-500" />
          Completed
        </span>
      );
    case 'CANCELLED':
      return (
        <span
          className={`inline-flex items-center font-medium rounded-full border bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-500/20 ${sizeClasses}`}
        >
          <span className="w-1.5 h-1.5 rounded-full mr-1.5 bg-rose-500" />
          Cancelled
        </span>
      );
    default:
      return (
        <span
          className={`inline-flex items-center font-medium rounded-full border bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700 ${sizeClasses}`}
        >
          {status}
        </span>
      );
  }
};
