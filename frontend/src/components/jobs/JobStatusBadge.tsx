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
          className={`inline-flex items-center font-medium rounded-full border bg-slate-500/10 text-slate-300 border-slate-500/20 backdrop-blur-xs ${sizeClasses}`}
        >
          <span className="w-1.5 h-1.5 rounded-full mr-1.5 bg-slate-400" />
          Created
        </span>
      );
    case 'TRIAGED':
      return (
        <span
          className={`inline-flex items-center font-medium rounded-full border bg-cyan-500/10 text-cyan-300 border-cyan-500/30 backdrop-blur-xs ${sizeClasses}`}
        >
          <span className="w-1.5 h-1.5 rounded-full mr-1.5 bg-cyan-400 animate-pulse" />
          Triaged
        </span>
      );
    case 'ASSIGNED':
      return (
        <span
          className={`inline-flex items-center font-medium rounded-full border bg-purple-500/15 text-purple-300 border-purple-500/30 backdrop-blur-xs ${sizeClasses}`}
        >
          <span className="w-1.5 h-1.5 rounded-full mr-1.5 bg-purple-400" />
          Assigned
        </span>
      );
    case 'ACCEPTED':
      return (
        <span
          className={`inline-flex items-center font-medium rounded-full border bg-blue-500/15 text-blue-300 border-blue-500/30 backdrop-blur-xs ${sizeClasses}`}
        >
          <span className="w-1.5 h-1.5 rounded-full mr-1.5 bg-blue-400" />
          Accepted
        </span>
      );
    case 'IN_PROGRESS':
      return (
        <span
          className={`inline-flex items-center font-medium rounded-full border bg-amber-500/15 text-amber-300 border-amber-500/30 backdrop-blur-xs ${sizeClasses}`}
        >
          <span className="w-1.5 h-1.5 rounded-full mr-1.5 bg-amber-400 animate-pulse" />
          In Progress
        </span>
      );
    case 'COMPLETED':
      return (
        <span
          className={`inline-flex items-center font-medium rounded-full border bg-sage-300/15 text-sage-300 border-sage-300/30 backdrop-blur-xs shadow-[0_0_10px_rgba(175,209,155,0.15)] ${sizeClasses}`}
        >
          <span className="w-1.5 h-1.5 rounded-full mr-1.5 bg-sage-300" />
          Completed
        </span>
      );
    case 'CANCELLED':
      return (
        <span
          className={`inline-flex items-center font-medium rounded-full border bg-rose-500/15 text-rose-300 border-rose-500/30 backdrop-blur-xs ${sizeClasses}`}
        >
          <span className="w-1.5 h-1.5 rounded-full mr-1.5 bg-rose-500" />
          Cancelled
        </span>
      );
    default:
      return (
        <span
          className={`inline-flex items-center font-medium rounded-full border bg-slate-800 text-slate-300 border-slate-700 ${sizeClasses}`}
        >
          {status}
        </span>
      );
  }
};
