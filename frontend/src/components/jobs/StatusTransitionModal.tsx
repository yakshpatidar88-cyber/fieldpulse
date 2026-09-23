import React, { useState } from 'react';
import { Job, JobStatus } from '../../types/job';
import { Button } from '../ui/Button';
import { JobStatusBadge } from './JobStatusBadge';
import { ArrowRight, AlertTriangle, X } from 'lucide-react';

interface StatusTransitionModalProps {
  job: Job | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (jobId: number, targetStatus: JobStatus, notes?: string) => Promise<void>;
}

export const StatusTransitionModal: React.FC<StatusTransitionModalProps> = ({
  job,
  isOpen,
  onClose,
  onConfirm,
}) => {
  if (!isOpen || !job) return null;

  const getValidNextStatuses = (current: JobStatus): JobStatus[] => {
    switch (current) {
      case 'CREATED':
        return ['TRIAGED', 'CANCELLED'];
      case 'TRIAGED':
        return ['ASSIGNED', 'CANCELLED'];
      case 'ASSIGNED':
        return ['ACCEPTED', 'TRIAGED', 'CANCELLED'];
      case 'ACCEPTED':
        return ['IN_PROGRESS', 'CANCELLED'];
      case 'IN_PROGRESS':
        return ['COMPLETED', 'CANCELLED'];
      default:
        return [];
    }
  };

  const validStatuses = getValidNextStatuses(job.status);
  const [selectedStatus, setSelectedStatus] = useState<JobStatus>(validStatuses[0] || 'COMPLETED');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      setError(null);
      await onConfirm(job.id, selectedStatus, notes);
      onClose();
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || 'Failed to transition job status');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Advance Job Lifecycle State
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Job #{job.jobNumber} &bull; {job.title || job.address}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 text-rose-700 dark:text-rose-400 p-3 rounded-lg text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 text-rose-500" />
              <span>{error}</span>
            </div>
          )}

          {/* Current State to Target State Visual */}
          <div className="bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl p-4 flex items-center justify-between">
            <div className="text-center sm:text-left">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1">
                Current Status
              </span>
              <JobStatusBadge status={job.status} />
            </div>

            <div className="flex items-center justify-center px-3 text-slate-400">
              <ArrowRight className="w-5 h-5" />
            </div>

            <div className="text-center sm:text-right">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1">
                Target Status
              </span>
              <JobStatusBadge status={selectedStatus} />
            </div>
          </div>

          {/* Target Status Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Select Next State (SLA Guardrail Enforced)
            </label>
            <div className="grid grid-cols-2 gap-2">
              {validStatuses.map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setSelectedStatus(st)}
                  className={`p-3 rounded-xl border text-left text-xs font-medium transition-all flex items-center justify-between ${
                    selectedStatus === st
                      ? 'bg-teal-500/15 border-teal-500 text-teal-700 dark:text-teal-300 shadow-sm'
                      : 'bg-white dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600'
                  }`}
                >
                  <span>{st.replace('_', ' ')}</span>
                  {selectedStatus === st && (
                    <span className="w-2 h-2 rounded-full bg-teal-500" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Operator Transition Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Operational Transition Notes (Logged to Audit Trail)
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Technician arrived on site, diagnostics confirmed compressor coil burned out."
              className="w-full rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 p-3 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
            />
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
            <Button type="button" variant="outline" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              isLoading={isSubmitting}
            >
              Confirm State Transition
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
