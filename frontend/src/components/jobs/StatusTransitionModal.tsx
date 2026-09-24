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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0C1215]/80 backdrop-blur-md animate-in fade-in duration-150">
      <div className="bg-[#131D21] border border-[#22353A] rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#22353A]">
          <div>
            <h3 className="text-base font-bold text-white">
              Advance Job Lifecycle State
            </h3>
            <p className="text-xs text-slate-400 mt-0.5 font-mono">
              Job #{job.jobNumber} &bull; {job.title || job.address}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-[#0C1215] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="bg-rose-500/10 border border-rose-500/30 text-rose-300 p-3 rounded-lg text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          {/* Current State to Target State Visual */}
          <div className="bg-[#0C1215] border border-[#22353A] rounded-xl p-4 flex items-center justify-between">
            <div className="text-center sm:text-left">
              <span className="text-[10px] font-mono uppercase font-bold text-slate-400 tracking-wider block mb-1">
                Current Status
              </span>
              <JobStatusBadge status={job.status} />
            </div>

            <div className="flex items-center justify-center px-3 text-slate-500">
              <ArrowRight className="w-5 h-5 text-sage-300" />
            </div>

            <div className="text-center sm:text-right">
              <span className="text-[10px] font-mono uppercase font-bold text-slate-400 tracking-wider block mb-1">
                Target Status
              </span>
              <JobStatusBadge status={selectedStatus} />
            </div>
          </div>

          {/* Target Status Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2 font-mono">
              Select Next State (SLA Guardrail Enforced)
            </label>
            <div className="grid grid-cols-2 gap-2">
              {validStatuses.map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setSelectedStatus(st)}
                  className={`p-3 rounded-xl border text-left text-xs font-medium transition-all duration-80 flex items-center justify-between ${
                    selectedStatus === st
                      ? 'bg-sage-300/15 border-sage-300 text-sage-300 shadow-sm'
                      : 'bg-[#0C1215] border-[#22353A] text-slate-400 hover:border-slate-600'
                  }`}
                >
                  <span>{st.replace('_', ' ')}</span>
                  {selectedStatus === st && (
                    <span className="w-2 h-2 rounded-full bg-sage-300" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Operator Transition Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 font-mono">
              Operational Transition Notes (Logged to Audit Trail)
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Technician arrived on site, diagnostics confirmed compressor coil burned out."
              className="w-full rounded-xl bg-[#0C1215] border border-[#22353A] p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-sage-300 focus:border-sage-300 transition-all duration-80"
            />
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#22353A]">
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
