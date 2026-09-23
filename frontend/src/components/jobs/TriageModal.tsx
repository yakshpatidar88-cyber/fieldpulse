import React, { useState } from 'react';
import { ServiceRequest, TriageServiceRequestRequest, JobPriority } from '../../types/job';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { X, Wrench, CheckCircle2, AlertTriangle } from 'lucide-react';

interface TriageModalProps {
  request: ServiceRequest | null;
  isOpen: boolean;
  onClose: () => void;
  onTriage: (requestId: number, dto: TriageServiceRequestRequest) => Promise<void>;
}

export const TriageModal: React.FC<TriageModalProps> = ({
  request,
  isOpen,
  onClose,
  onTriage,
}) => {
  if (!isOpen || !request) return null;

  const [priority, setPriority] = useState<JobPriority>(request.priority || 'MEDIUM');
  const [estimatedDurationMinutes, setEstimatedDurationMinutes] = useState<number>(60);
  const [selectedSkills, setSelectedSkills] = useState<number[]>([1]); // default skill ID 1
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Available skills list in demo
  const availableSkills = [
    { id: 1, name: 'HVAC EPA Universal', code: 'HVAC_EPA' },
    { id: 2, name: 'Commercial Refrigeration', code: 'COMM_REFRIG' },
    { id: 3, name: 'High Voltage Electrical', code: 'ELEC_HV' },
    { id: 4, name: 'Master Plumbing', code: 'PLUMB_MASTER' },
  ];

  const toggleSkill = (id: number) => {
    setSelectedSkills((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedSkills.length === 0) {
      setError('Please select at least one required certification/skill');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      await onTriage(request.id, {
        priority,
        estimatedDurationMinutes,
        requiredSkillIds: selectedSkills,
      });
      onClose();
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || 'Failed to triage request');
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
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Wrench className="w-5 h-5 text-teal-500" />
              Triage Service Ticket to Operational Job
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Request #{request.id} &bull; {request.customerName}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 text-rose-700 dark:text-rose-400 p-3 rounded-lg text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 text-rose-500" />
              <span>{error}</span>
            </div>
          )}

          {/* Request summary context */}
          <div className="p-3.5 bg-slate-50 dark:bg-slate-950/60 rounded-xl border border-slate-200 dark:border-slate-800 text-xs space-y-1">
            <span className="font-semibold text-slate-900 dark:text-white block">
              Reported Problem:
            </span>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              {request.description}
            </p>
            <div className="text-[11px] font-mono text-slate-500 pt-1">
              Location: {request.address}
            </div>
          </div>

          {/* Priority & Duration */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Priority Tier
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as JobPriority)}
                className="w-full rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 px-3 py-2 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="CRITICAL">CRITICAL (2h SLA)</option>
                <option value="HIGH">HIGH (4h SLA)</option>
                <option value="MEDIUM">MEDIUM (8h SLA)</option>
                <option value="LOW">LOW (24h SLA)</option>
              </select>
            </div>

            <Input
              label="Estimated Duration (Minutes)"
              type="number"
              min={15}
              step={15}
              value={estimatedDurationMinutes}
              onChange={(e) => setEstimatedDurationMinutes(parseInt(e.target.value) || 60)}
              required
            />
          </div>

          {/* Required Skills selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Required Technician Certifications
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {availableSkills.map((sk) => {
                const isSelected = selectedSkills.includes(sk.id);
                return (
                  <button
                    key={sk.id}
                    type="button"
                    onClick={() => toggleSkill(sk.id)}
                    className={`p-2.5 rounded-xl border text-left text-xs font-medium transition-all flex items-center justify-between ${
                      isSelected
                        ? 'bg-teal-500/15 border-teal-500 text-teal-700 dark:text-teal-300'
                        : 'bg-white dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600'
                    }`}
                  >
                    <span>{sk.name}</span>
                    {isSelected && <CheckCircle2 className="w-4 h-4 text-teal-500" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
            <Button type="button" variant="outline" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" isLoading={isSubmitting}>
              Convert to Operational Job
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
