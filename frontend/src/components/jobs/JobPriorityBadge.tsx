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
          className={`inline-flex items-center font-bold font-mono rounded-full border bg-crimson-500/15 text-rose-300 border-crimson-500/40 shadow-[0_0_8px_rgba(244,63,94,0.25)] ${sizeClasses}`}
        >
          <Flame className="w-3 h-3 mr-1 text-rose-400 animate-pulse" />
          CRITICAL
        </span>
      );
    case 'HIGH':
      return (
        <span
          className={`inline-flex items-center font-semibold font-mono rounded-full border bg-amber-500/15 text-amber-300 border-amber-500/30 ${sizeClasses}`}
        >
          <AlertTriangle className="w-3 h-3 mr-1 text-amber-400" />
          HIGH
        </span>
      );
    case 'MEDIUM':
      return (
        <span
          className={`inline-flex items-center font-medium font-mono rounded-full border bg-cyan-500/15 text-cyan-300 border-cyan-500/30 ${sizeClasses}`}
        >
          <Clock className="w-3 h-3 mr-1 text-cyan-400" />
          MEDIUM
        </span>
      );
    case 'LOW':
      return (
        <span
          className={`inline-flex items-center font-medium font-mono rounded-full border bg-slate-800/80 text-slate-400 border-slate-700 ${sizeClasses}`}
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
