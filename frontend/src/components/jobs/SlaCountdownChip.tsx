import React, { useEffect, useState } from 'react';
import { Timer, AlertOctagon, CheckCircle2 } from 'lucide-react';

interface SlaCountdownChipProps {
  deadline?: string;
  riskLevel?: 'HEALTHY' | 'WARNING' | 'BREACHED';
  isCompleted?: boolean;
}

export const SlaCountdownChip: React.FC<SlaCountdownChipProps> = ({
  deadline,
  riskLevel = 'HEALTHY',
  isCompleted = false,
}) => {
  const [timeLeft, setTimeLeft] = useState<string>('');
  const [isBreached, setIsBreached] = useState<boolean>(false);

  useEffect(() => {
    if (!deadline || isCompleted) return;

    const calculateTime = () => {
      const target = new Date(deadline).getTime();
      const now = Date.now();
      const diff = target - now;

      if (diff <= 0) {
        setIsBreached(true);
        const overMinutes = Math.floor(Math.abs(diff) / (1000 * 60));
        const hours = Math.floor(overMinutes / 60);
        const mins = overMinutes % 60;
        setTimeLeft(hours > 0 ? `+${hours}h ${mins}m breached` : `+${mins}m breached`);
        return;
      }

      setIsBreached(false);
      const totalMinutes = Math.floor(diff / (1000 * 60));
      const hours = Math.floor(totalMinutes / 60);
      const mins = totalMinutes % 60;

      if (hours > 24) {
        const days = Math.floor(hours / 24);
        setTimeLeft(`${days}d ${hours % 24}h`);
      } else if (hours > 0) {
        setTimeLeft(`${hours}h ${mins}m`);
      } else {
        setTimeLeft(`${mins}m`);
      }
    };

    calculateTime();
    const interval = setInterval(calculateTime, 30000); // refresh every 30s
    return () => clearInterval(interval);
  }, [deadline, isCompleted]);

  if (isCompleted) {
    return (
      <span className="inline-flex items-center text-[11px] font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-500/20">
        <CheckCircle2 className="w-3 h-3 mr-1" />
        SLA Met
      </span>
    );
  }

  if (!deadline) {
    return (
      <span className="text-[11px] font-mono text-slate-400 dark:text-slate-500">
        &mdash;
      </span>
    );
  }

  if (isBreached || riskLevel === 'BREACHED') {
    return (
      <span className="inline-flex items-center text-[11px] font-mono font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/15 px-2 py-0.5 rounded border border-rose-200 dark:border-rose-500/30 animate-pulse">
        <AlertOctagon className="w-3 h-3 mr-1 text-rose-500" />
        {timeLeft || 'BREACHED'}
      </span>
    );
  }

  if (riskLevel === 'WARNING') {
    return (
      <span className="inline-flex items-center text-[11px] font-mono font-medium text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/15 px-2 py-0.5 rounded border border-amber-200 dark:border-amber-500/30">
        <Timer className="w-3 h-3 mr-1 text-amber-500 animate-spin" />
        {timeLeft} left
      </span>
    );
  }

  return (
    <span className="inline-flex items-center text-[11px] font-mono font-medium text-teal-700 dark:text-teal-400 bg-teal-50 dark:bg-teal-500/10 px-2 py-0.5 rounded border border-teal-200 dark:border-teal-500/20">
      <Timer className="w-3 h-3 mr-1 text-teal-500" />
      {timeLeft} left
    </span>
  );
};
