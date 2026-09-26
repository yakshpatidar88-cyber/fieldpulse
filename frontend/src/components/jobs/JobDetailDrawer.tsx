import React, { useEffect, useState } from 'react';
import { Job, AuditEvent, JobStatus } from '../../types/job';
import { jobApi } from '../../api/jobs';
import { JobStatusBadge } from './JobStatusBadge';
import { JobPriorityBadge } from './JobPriorityBadge';
import { SlaCountdownChip } from './SlaCountdownChip';
import { CustomerTrackingModal } from './CustomerTrackingModal';
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
  ExternalLink,
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
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);

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
        className="absolute inset-0 bg-slate-900/60 dark:bg-[#0C1215]/75 backdrop-blur-sm transition-opacity duration-150"
      />

      {/* Slide-over Drawer Container (480px tactical inspector) */}
      <div className="fixed inset-y-0 right-0 max-w-full flex">
        <div className="w-screen max-w-[480px] bg-white dark:bg-[#131D21] border-l border-slate-200 dark:border-[#22353A] shadow-2xl flex flex-col justify-between overflow-hidden animate-in slide-in-from-right duration-150">
          {/* Drawer Top Header */}
          <div className="p-6 border-b border-slate-200 dark:border-[#22353A] shrink-0 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-[#0C1215] text-slate-800 dark:text-sage-300 border border-slate-200 dark:border-[#22353A]">
                  {job?.jobNumber || `JOB-${jobId}`}
                </span>
                {job && <JobPriorityBadge priority={job.priority} size="sm" />}
              </div>
              <button
                onClick={onClose}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#0C1215] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                {job?.title || 'Field Service Incident'}
              </h2>
              <div className="flex items-center gap-2.5 mt-2">
                {job && <JobStatusBadge status={job.status} size="sm" />}
                <span className="text-slate-300 dark:text-slate-600">&bull;</span>
                <SlaCountdownChip
                  deadline={job?.slaDeadline}
                  riskLevel={job?.slaRiskLevel}
                  isCompleted={job?.status === 'COMPLETED'}
                />
              </div>
            </div>

            {/* Quick Actions Bar */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
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
                  leftIcon={<Send className="w-3.5 h-3.5 text-emerald-600 dark:text-sage-300" />}
                  onClick={() => navigate(`/dispatch?jobId=${job.id}`)}
                >
                  Dispatch
                </Button>
              )}

              {/* Customer Live Portal Simulator */}
              {job && (
                <Button
                  size="sm"
                  variant="secondary"
                  leftIcon={<ExternalLink className="w-3.5 h-3.5 text-blue-500" />}
                  onClick={() => setIsCustomerModalOpen(true)}
                  title="Simulate customer mobile tracking and signature experience"
                >
                  Customer View
                </Button>
              )}
            </div>

            {/* Navigation Tabs */}
            <div className="flex border-b border-slate-200 dark:border-[#22353A] gap-5 pt-2 -mb-2">
              <button
                type="button"
                onClick={() => setActiveTab('overview')}
                className={`pb-3 text-xs font-mono uppercase tracking-wider font-semibold border-b-2 transition-all duration-80 ${
                  activeTab === 'overview'
                    ? 'border-emerald-600 dark:border-sage-300 text-emerald-800 dark:text-sage-300'
                    : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Overview
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('sla')}
                className={`pb-3 text-xs font-mono uppercase tracking-wider font-semibold border-b-2 transition-all duration-80 ${
                  activeTab === 'sla'
                    ? 'border-emerald-600 dark:border-sage-300 text-emerald-800 dark:text-sage-300'
                    : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                SLA &amp; Tech
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('parts')}
                className={`pb-3 text-xs font-mono uppercase tracking-wider font-semibold border-b-2 transition-all duration-80 ${
                  activeTab === 'parts'
                    ? 'border-emerald-600 dark:border-sage-300 text-emerald-800 dark:text-sage-300'
                    : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Parts ({job?.parts?.length || 0})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('audit')}
                className={`pb-3 text-xs font-mono uppercase tracking-wider font-semibold border-b-2 transition-all duration-80 ${
                  activeTab === 'audit'
                    ? 'border-emerald-600 dark:border-sage-300 text-emerald-800 dark:text-sage-300'
                    : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
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
                <div className="w-8 h-8 border-2 border-emerald-600/20 dark:border-sage-300/20 border-t-emerald-600 dark:border-t-sage-300 rounded-full animate-spin" />
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
                    <div className="bg-slate-50 dark:bg-[#0C1215] border border-slate-200 dark:border-[#22353A] rounded-xl p-4 space-y-3">
                      <span className="text-[10px] font-mono uppercase font-bold text-slate-500 dark:text-slate-400 tracking-wider block">
                        Customer &amp; Worksite
                      </span>
                      <div className="text-sm font-semibold text-slate-900 dark:text-white">
                        {job.customerName || 'Enterprise Facility Operations'}
                      </div>
                      <div className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-300">
                        <MapPin className="w-4 h-4 text-emerald-600 dark:text-sage-300 shrink-0 mt-0.5" />
                        <div>
                          <span>{job.address}</span>
                          <span className="block text-[11px] font-mono text-slate-400 dark:text-slate-500 mt-0.5">
                            Coords: {job.latitude.toFixed(4)}, {job.longitude.toFixed(4)}
                          </span>
                        </div>
                      </div>

                      {(job.customerPhone || job.customerEmail) && (
                        <div className="flex flex-wrap gap-4 pt-2 border-t border-slate-200 dark:border-[#22353A] text-xs text-slate-500 dark:text-slate-400">
                          {job.customerPhone && (
                            <div className="flex items-center gap-1.5">
                              <Phone className="w-3.5 h-3.5 text-slate-400" />
                              <span>{job.customerPhone}</span>
                            </div>
                          )}
                          {job.customerEmail && (
                            <div className="flex items-center gap-1.5">
                              <Mail className="w-3.5 h-3.5 text-slate-400" />
                              <span>{job.customerEmail}</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Operational Details */}
                    <div className="space-y-3">
                      <span className="text-[10px] font-mono uppercase font-bold text-slate-500 dark:text-slate-400 tracking-wider block">
                        Service Scope &amp; Schedule
                      </span>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#0C1215] border border-slate-200 dark:border-[#22353A]">
                          <span className="text-[11px] text-slate-500 dark:text-slate-400 block mb-1">
                            Estimated Duration
                          </span>
                          <div className="flex items-center gap-1.5 text-sm font-mono font-semibold text-slate-900 dark:text-white">
                            <Clock className="w-4 h-4 text-emerald-600 dark:text-sage-300" />
                            {job.estimatedDurationMinutes} mins
                          </div>
                        </div>

                        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#0C1215] border border-slate-200 dark:border-[#22353A]">
                          <span className="text-[11px] text-slate-500 dark:text-slate-400 block mb-1">
                            Ingested At
                          </span>
                          <div className="text-xs font-mono font-medium text-slate-700 dark:text-slate-300">
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
                        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#0C1215] border border-slate-200 dark:border-[#22353A] text-xs leading-relaxed text-slate-700 dark:text-slate-300">
                          <span className="font-semibold block mb-1 text-slate-900 dark:text-white">
                            Issue Description:
                          </span>
                          {job.description}
                        </div>
                      )}
                    </div>

                    {/* Required Skills */}
                    <div className="space-y-2">
                      <span className="text-[10px] font-mono uppercase font-bold text-slate-500 dark:text-slate-400 tracking-wider block">
                        Required Certifications &amp; Skills
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {job.requiredSkills && job.requiredSkills.length > 0 ? (
                          job.requiredSkills.map((sk) => (
                            <span
                              key={sk.id}
                              className="px-2.5 py-1 rounded-md text-xs font-mono font-medium bg-emerald-50 text-emerald-800 border border-emerald-200 dark:bg-sage-300/10 dark:text-sage-300 dark:border-sage-300/20"
                            >
                              {sk.name}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-slate-400 font-mono">
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
                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#0C1215] border border-slate-200 dark:border-[#22353A] space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                          <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-sage-300" />
                          SLA Breach Prevention Target
                        </span>
                        <SlaCountdownChip
                          deadline={job.slaDeadline}
                          riskLevel={job.slaRiskLevel}
                          isCompleted={job.status === 'COMPLETED'}
                        />
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                        Automatic warning threshold activates when 50% of the SLA window has elapsed.
                        Dispatches escalate to supervisors when SLA exceeds 75% without technician check-in.
                      </p>
                      {job.slaDeadline && (
                        <div className="text-[11px] font-mono text-slate-400 dark:text-slate-500 border-t border-slate-200 dark:border-[#22353A] pt-2">
                          Resolution Deadline: {new Date(job.slaDeadline).toLocaleString()}
                        </div>
                      )}
                    </div>

                    {/* Assigned Technician Card */}
                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#0C1215] border border-slate-200 dark:border-[#22353A] space-y-3">
                      <span className="text-[10px] font-mono uppercase font-bold text-slate-500 dark:text-slate-400 tracking-wider block">
                        Assigned Field Engineer
                      </span>
                      {job.assignedTechnician ? (
                        <div className="flex items-start space-x-3.5">
                          <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-sage-300/15 border border-emerald-200 dark:border-sage-300/30 flex items-center justify-center text-emerald-800 dark:text-sage-300 font-bold font-mono text-sm shrink-0">
                            {job.assignedTechnician.fullName
                              .split(' ')
                              .map((n) => n[0])
                              .join('')}
                          </div>
                          <div className="space-y-1">
                            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                              {job.assignedTechnician.fullName}
                            </h4>
                            <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                              Code: {job.assignedTechnician.employeeCode}
                            </p>
                            <div className="flex items-center gap-3 pt-1 text-xs text-slate-600 dark:text-slate-300">
                              <span className="flex items-center gap-1">
                                <Phone className="w-3.5 h-3.5 text-slate-400" />
                                {job.assignedTechnician.phone || '+1 (555) 234-8901'}
                              </span>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-6 space-y-3">
                          <User className="w-8 h-8 mx-auto text-slate-400 dark:text-slate-600" />
                          <p className="text-xs text-slate-500 dark:text-slate-400">
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
                    <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-mono">
                      <span>Pessimistic Lock Guarded</span>
                      <span>{job.parts?.length || 0} line items</span>
                    </div>

                    {!job.parts || job.parts.length === 0 ? (
                      <div className="p-8 text-center bg-slate-50 dark:bg-[#0C1215] rounded-xl border border-dashed border-slate-200 dark:border-[#22353A] text-xs text-slate-400 font-mono">
                        <Package className="w-8 h-8 mx-auto mb-2 text-slate-400 dark:text-slate-600" />
                        No specific replacement parts reserved for this service ticket.
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {job.parts.map((p) => (
                          <div
                            key={p.id}
                            className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#0C1215] border border-slate-200 dark:border-[#22353A] flex items-center justify-between"
                          >
                            <div className="space-y-0.5">
                              <span className="text-xs font-bold text-slate-900 dark:text-white block">
                                {p.partName || `Component #${p.partNumber || p.id}`}
                              </span>
                              <span className="text-[11px] font-mono text-slate-400 dark:text-slate-500">
                                SKU: {p.partNumber || 'PART-GENERIC'}
                              </span>
                            </div>

                            <div className="text-right space-y-1">
                              <span className="text-xs font-mono font-bold text-slate-900 dark:text-white block">
                                Qty: {p.quantityRequired}
                              </span>
                              <span className="inline-flex items-center text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 dark:bg-sage-300/10 dark:text-sage-300 dark:border-sage-300/20">
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
                    <span className="text-[10px] font-mono uppercase font-bold text-slate-500 dark:text-slate-400 tracking-wider block">
                      Chronological Immutable Audit Log
                    </span>

                    {auditTrail.length === 0 ? (
                      <div className="p-8 text-center bg-slate-50 dark:bg-[#0C1215] rounded-xl border border-dashed border-slate-200 dark:border-[#22353A] text-xs text-slate-400 font-mono">
                        <History className="w-8 h-8 mx-auto mb-2 text-slate-400 dark:text-slate-600" />
                        No lifecycle transition events recorded yet.
                      </div>
                    ) : (
                      <div className="relative pl-6 space-y-5 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-[#22353A]">
                        {auditTrail.map((ev) => (
                          <div key={ev.id} className="relative group">
                            {/* Dot on timeline */}
                            <div className="absolute -left-6 mt-1 w-2.5 h-2.5 rounded-full bg-emerald-600 dark:bg-sage-300 border-2 border-white dark:border-[#0C1215] group-hover:scale-125 transition-transform" />

                            <div className="bg-slate-50 dark:bg-[#0C1215] border border-slate-200 dark:border-[#22353A] p-3 rounded-xl space-y-1 text-xs">
                              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-[11px]">
                                <span className="font-semibold text-slate-900 dark:text-white">
                                  {ev.action}
                                </span>
                                <span className="font-mono text-slate-400 dark:text-slate-500">
                                  {new Date(ev.createdAt).toLocaleTimeString([], {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    second: '2-digit',
                                  })}
                                </span>
                              </div>

                              {ev.details && (
                                <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                                  {ev.details}
                                </p>
                              )}

                              <div className="text-[10px] font-mono text-slate-400 dark:text-slate-500 pt-1 flex items-center justify-between">
                                <span>Actor: {ev.performedBy || 'SYSTEM'}</span>
                                {ev.previousStatus && ev.newStatus && (
                                  <span>
                                    {ev.previousStatus} &rarr; {ev.newStatus}
                                  </span>
                                )}
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
        </div>
      </div>

      {/* Customer Mobile Tracking Simulator Modal */}
      <CustomerTrackingModal
        job={job}
        isOpen={isCustomerModalOpen}
        onClose={() => setIsCustomerModalOpen(false)}
      />
    </div>
  );
};

export default JobDetailDrawer;
