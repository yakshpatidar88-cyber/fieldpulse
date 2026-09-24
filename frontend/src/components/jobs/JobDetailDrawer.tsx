import React, { useEffect, useState } from 'react';
import { Job, AuditEvent, JobStatus } from '../../types/job';
import { jobApi } from '../../api/jobs';
import { JobStatusBadge } from './JobStatusBadge';
import { JobPriorityBadge } from './JobPriorityBadge';
import { SlaCountdownChip } from './SlaCountdownChip';
import { Button } from '../ui/Button';
import {
  X,
  MapPin,
  Clock,
  User,
  Package,
  History,
  ShieldCheck,
  Send,
  Phone,
  Mail,
  ArrowRight,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface JobDetailDrawerProps {
  jobId: number | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenTransitionModal: (job: Job) => void;
}

export const JobDetailDrawer: React.FC<JobDetailDrawerProps> = ({
  jobId,
  isOpen,
  onClose,
  onOpenTransitionModal,
}) => {
  const navigate = useNavigate();
  const [job, setJob] = useState<Job | null>(null);
  const [auditTrail, setAuditTrail] = useState<AuditEvent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'sla' | 'parts' | 'audit'>('overview');

  useEffect(() => {
    if (!isOpen || !jobId) return;

    const fetchDetails = async () => {
      try {
        setIsLoading(true);
        const [jobData, trailData] = await Promise.all([
          jobApi.getJobById(jobId),
          jobApi.getJobAuditTrail(jobId).catch(() => []),
        ]);
        setJob(jobData);
        setAuditTrail(trailData);
      } catch (err) {
        console.error('Failed to load job details', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDetails();
  }, [isOpen, jobId]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Dimmed Frosted Glass Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-[#0C1215]/75 backdrop-blur-sm transition-opacity duration-150"
      />

      {/* Slide-over Drawer Container (480px tactical inspector) */}
      <div className="fixed inset-y-0 right-0 max-w-full flex">
        <div className="w-screen max-w-[480px] bg-[#131D21] border-l border-[#22353A] shadow-2xl flex flex-col justify-between overflow-hidden animate-in slide-in-from-right duration-150">
          {/* Drawer Top Header */}
          <div className="p-6 border-b border-[#22353A] shrink-0 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-[#0C1215] text-sage-300 border border-[#22353A]">
                  {job?.jobNumber || `JOB-${jobId}`}
                </span>
                {job && <JobPriorityBadge priority={job.priority} size="sm" />}
              </div>
              <button
                onClick={onClose}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-[#0C1215] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">
                {job?.title || 'Field Service Incident'}
              </h2>
              <div className="flex items-center gap-2.5 mt-2">
                {job && <JobStatusBadge status={job.status} size="sm" />}
                <span className="text-slate-600">&bull;</span>
                <SlaCountdownChip
                  deadline={job?.slaDeadline}
                  riskLevel={job?.slaRiskLevel}
                  isCompleted={job?.status === 'COMPLETED'}
                />
              </div>
            </div>

            {/* Quick Actions Bar */}
            <div className="flex items-center gap-2 pt-1">
              {job && job.status !== 'COMPLETED' && job.status !== 'CANCELLED' && (
                <Button
                  size="sm"
                  variant="primary"
                  onClick={() => onOpenTransitionModal(job)}
                  rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                >
                  Advance Lifecycle
                </Button>
              )}

              {(job?.status === 'CREATED' || job?.status === 'TRIAGED') && (
                <Button
                  size="sm"
                  variant="outline"
                  leftIcon={<Send className="w-3.5 h-3.5 text-sage-300" />}
                  onClick={() => navigate(`/dispatch?jobId=${job.id}`)}
                >
                  Dispatch
                </Button>
              )}
            </div>

            {/* Navigation Tabs */}
            <div className="flex border-b border-[#22353A] gap-5 pt-2 -mb-2">
              <button
                type="button"
                onClick={() => setActiveTab('overview')}
                className={`pb-3 text-xs font-mono uppercase tracking-wider font-semibold border-b-2 transition-all duration-80 ${
                  activeTab === 'overview'
                    ? 'border-sage-300 text-sage-300'
                    : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                Overview
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('sla')}
                className={`pb-3 text-xs font-mono uppercase tracking-wider font-semibold border-b-2 transition-all duration-80 ${
                  activeTab === 'sla'
                    ? 'border-sage-300 text-sage-300'
                    : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                SLA &amp; Tech
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('parts')}
                className={`pb-3 text-xs font-mono uppercase tracking-wider font-semibold border-b-2 transition-all duration-80 ${
                  activeTab === 'parts'
                    ? 'border-sage-300 text-sage-300'
                    : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                Parts ({job?.parts?.length || 0})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('audit')}
                className={`pb-3 text-xs font-mono uppercase tracking-wider font-semibold border-b-2 transition-all duration-80 ${
                  activeTab === 'audit'
                    ? 'border-sage-300 text-sage-300'
                    : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                Audit ({auditTrail.length})
              </button>
            </div>
          </div>

          {/* Drawer Body Scroll Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-5">
            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <div className="w-8 h-8 border-2 border-sage-300/20 border-t-sage-300 rounded-full animate-spin" />
              </div>
            ) : !job ? (
              <div className="text-center py-12 text-slate-400 text-xs font-mono">
                Job record could not be loaded.
              </div>
            ) : (
              <>
                {/* TAB 1: OVERVIEW */}
                {activeTab === 'overview' && (
                  <div className="space-y-4">
                    {/* Customer & Location */}
                    <div className="bg-[#0C1215] border border-[#22353A] rounded-xl p-4 space-y-3">
                      <span className="text-[10px] font-mono uppercase font-bold text-slate-400 tracking-wider block">
                        Customer &amp; Worksite
                      </span>
                      <div className="text-sm font-semibold text-white">
                        {job.customerName || 'Enterprise Facility Operations'}
                      </div>
                      <div className="flex items-start gap-2 text-xs text-slate-300">
                        <MapPin className="w-4 h-4 text-sage-300 shrink-0 mt-0.5" />
                        <div>
                          <span>{job.address}</span>
                          <span className="block text-[11px] font-mono text-slate-500 mt-0.5">
                            Coords: {job.latitude.toFixed(4)}, {job.longitude.toFixed(4)}
                          </span>
                        </div>
                      </div>

                      {(job.customerPhone || job.customerEmail) && (
                        <div className="flex flex-wrap gap-4 pt-2 border-t border-[#22353A] text-xs text-slate-400">
                          {job.customerPhone && (
                            <div className="flex items-center gap-1.5">
                              <Phone className="w-3.5 h-3.5 text-slate-500" />
                              <span>{job.customerPhone}</span>
                            </div>
                          )}
                          {job.customerEmail && (
                            <div className="flex items-center gap-1.5">
                              <Mail className="w-3.5 h-3.5 text-slate-500" />
                              <span>{job.customerEmail}</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Operational Details */}
                    <div className="space-y-3">
                      <span className="text-[10px] font-mono uppercase font-bold text-slate-400 tracking-wider block">
                        Service Scope &amp; Schedule
                      </span>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="p-3.5 rounded-xl bg-[#0C1215] border border-[#22353A]">
                          <span className="text-[11px] text-slate-400 block mb-1">
                            Estimated Duration
                          </span>
                          <div className="flex items-center gap-1.5 text-sm font-mono font-semibold text-white">
                            <Clock className="w-4 h-4 text-sage-300" />
                            {job.estimatedDurationMinutes} mins
                          </div>
                        </div>

                        <div className="p-3.5 rounded-xl bg-[#0C1215] border border-[#22353A]">
                          <span className="text-[11px] text-slate-400 block mb-1">
                            Ingested At
                          </span>
                          <div className="text-xs font-mono font-medium text-slate-300">
                            {new Date(job.createdAt).toLocaleString([], {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </div>
                        </div>
                      </div>

                      {job.description && (
                        <div className="p-3.5 rounded-xl bg-[#0C1215] border border-[#22353A] text-xs leading-relaxed text-slate-300">
                          <span className="font-semibold block mb-1 text-white">
                            Issue Description:
                          </span>
                          {job.description}
                        </div>
                      )}
                    </div>

                    {/* Required Skills */}
                    <div className="space-y-2">
                      <span className="text-[10px] font-mono uppercase font-bold text-slate-400 tracking-wider block">
                        Required Certifications &amp; Skills
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {job.requiredSkills && job.requiredSkills.length > 0 ? (
                          job.requiredSkills.map((sk) => (
                            <span
                              key={sk.id}
                              className="px-2.5 py-1 rounded-md text-xs font-mono font-medium bg-sage-300/10 text-sage-300 border border-sage-300/20"
                            >
                              {sk.name}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-slate-500 font-mono">
                            General Maintenance Technician
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 2: SLA & TECHNICIAN */}
                {activeTab === 'sla' && (
                  <div className="space-y-4">
                    {/* SLA Status Card */}
                    <div className="p-4 rounded-xl bg-[#0C1215] border border-[#22353A] space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white flex items-center gap-1.5">
                          <ShieldCheck className="w-4 h-4 text-sage-300" />
                          SLA Breach Prevention Target
                        </span>
                        <SlaCountdownChip
                          deadline={job.slaDeadline}
                          riskLevel={job.slaRiskLevel}
                          isCompleted={job.status === 'COMPLETED'}
                        />
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        Automatic warning threshold activates when 50% of the SLA window has elapsed.
                        Dispatches escalate to supervisors when SLA exceeds 75% without technician check-in.
                      </p>
                      {job.slaDeadline && (
                        <div className="text-[11px] font-mono text-slate-500 border-t border-[#22353A] pt-2">
                          Resolution Deadline: {new Date(job.slaDeadline).toLocaleString()}
                        </div>
                      )}
                    </div>

                    {/* Assigned Technician Card */}
                    <div className="p-4 rounded-xl bg-[#0C1215] border border-[#22353A] space-y-3">
                      <span className="text-[10px] font-mono uppercase font-bold text-slate-400 tracking-wider block">
                        Assigned Field Engineer
                      </span>
                      {job.assignedTechnician ? (
                        <div className="flex items-start space-x-3.5">
                          <div className="w-10 h-10 rounded-xl bg-sage-300/15 border border-sage-300/30 flex items-center justify-center text-sage-300 font-bold font-mono text-sm shrink-0">
                            {job.assignedTechnician.fullName
                              .split(' ')
                              .map((n) => n[0])
                              .join('')}
                          </div>
                          <div className="space-y-1">
                            <h4 className="text-sm font-bold text-white">
                              {job.assignedTechnician.fullName}
                            </h4>
                            <p className="text-xs text-slate-400 font-mono">
                              Code: {job.assignedTechnician.employeeCode}
                            </p>
                            <div className="flex items-center gap-3 pt-1 text-xs text-slate-300">
                              <span className="flex items-center gap-1">
                                <Phone className="w-3.5 h-3.5 text-slate-500" />
                                {job.assignedTechnician.phone || '+1 (555) 234-8901'}
                              </span>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-6 space-y-3">
                          <User className="w-8 h-8 mx-auto text-slate-600" />
                          <p className="text-xs text-slate-400">
                            No field engineer assigned yet.
                          </p>
                          <Button
                            size="sm"
                            variant="primary"
                            onClick={() => navigate(`/dispatch?jobId=${job.id}`)}
                          >
                            Assign via Dispatch Matrix
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* TAB 3: PARTS & INVENTORY */}
                {activeTab === 'parts' && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                      <span>Pessimistic Lock Guarded</span>
                      <span>{job.parts?.length || 0} line items</span>
                    </div>

                    {!job.parts || job.parts.length === 0 ? (
                      <div className="p-8 text-center bg-[#0C1215] rounded-xl border border-dashed border-[#22353A] text-xs text-slate-500 font-mono">
                        <Package className="w-8 h-8 mx-auto mb-2 text-slate-600" />
                        No specific replacement parts reserved for this service ticket.
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {job.parts.map((p) => (
                          <div
                            key={p.id}
                            className="p-3.5 rounded-xl bg-[#0C1215] border border-[#22353A] flex items-center justify-between"
                          >
                            <div className="space-y-0.5">
                              <span className="text-xs font-bold text-white block">
                                {p.partName || `Component #${p.partNumber || p.id}`}
                              </span>
                              <span className="text-[11px] font-mono text-slate-400">
                                SKU: {p.partNumber || 'PART-GENERIC'}
                              </span>
                            </div>

                            <div className="text-right space-y-1">
                              <span className="text-xs font-mono font-bold text-white block">
                                Qty: {p.quantityRequired}
                              </span>
                              <span className="inline-flex items-center text-[10px] font-mono px-2 py-0.5 rounded bg-sage-300/10 text-sage-300 border border-sage-300/20">
                                {p.status || 'RESERVED'}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* TAB 4: AUDIT TRAIL TIMELINE */}
                {activeTab === 'audit' && (
                  <div className="space-y-4">
                    <span className="text-[10px] font-mono uppercase font-bold text-slate-400 tracking-wider block">
                      Chronological Immutable Audit Log
                    </span>

                    {auditTrail.length === 0 ? (
                      <div className="p-8 text-center bg-[#0C1215] rounded-xl border border-dashed border-[#22353A] text-xs text-slate-500 font-mono">
                        <History className="w-8 h-8 mx-auto mb-2 text-slate-600" />
                        No lifecycle transition events recorded yet.
                      </div>
                    ) : (
                      <div className="relative pl-6 space-y-5 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#22353A]">
                        {auditTrail.map((ev) => (
                          <div key={ev.id} className="relative group">
                            {/* Dot on timeline */}
                            <div className="absolute -left-6 mt-1 w-2.5 h-2.5 rounded-full bg-sage-300 border-2 border-[#0C1215] group-hover:scale-125 transition-transform" />

                            <div className="bg-[#0C1215] border border-[#22353A] p-3 rounded-xl space-y-1 text-xs">
                              <div className="flex items-center justify-between text-slate-400 text-[11px]">
                                <span className="font-semibold text-white">
                                  {ev.action}
                                </span>
                                <span className="font-mono text-slate-500">
                                  {new Date(ev.createdAt).toLocaleTimeString([], {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    second: '2-digit',
                                  })}
                                </span>
                              </div>

                              {(ev.previousState || ev.newState) && (
                                <div className="text-[11px] font-mono text-sage-300">
                                  {ev.previousState || 'NONE'} &rarr; {ev.newState}
                                </div>
                              )}

                              {ev.metadata && (
                                <p className="text-[11px] text-slate-400 italic">
                                  &ldquo;{ev.metadata}&rdquo;
                                </p>
                              )}

                              <div className="text-[10px] text-slate-500 font-mono pt-1">
                                By: {ev.performedByEmail || 'system.dispatcher@fieldpulse.io'}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>

          {/* Drawer Footer */}
          <div className="p-4 border-t border-[#22353A] shrink-0 flex items-center justify-between bg-[#0C1215]">
            <span className="text-[11px] text-slate-500 font-mono">
              FieldPulse State Machine &bull; Day 14
            </span>
            <Button size="sm" variant="outline" onClick={onClose}>
              Close Inspector
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
