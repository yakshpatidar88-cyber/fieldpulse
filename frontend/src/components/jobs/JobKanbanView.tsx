import React from 'react';
import { JobSummary, JobStatus } from '../../types/job';
import { JobPriorityBadge } from './JobPriorityBadge';
import { SlaCountdownChip } from './SlaCountdownChip';
import { Button } from '../ui/Button';
import {
  Clock,
  MapPin,
  UserCheck,
  UserX,
  ArrowRight,
  Send,
  CheckCircle2,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface JobKanbanViewProps {
  jobs: JobSummary[];
  onSelectJob: (jobId: number) => void;
  onOpenTransitionModalById: (jobId: number) => void;
}

interface ColumnConfig {
  id: string;
  title: string;
  statuses: JobStatus[];
  colorBadge: string;
  accentBorder: string;
}

export const JobKanbanView: React.FC<JobKanbanViewProps> = ({
  jobs,
  onSelectJob,
  onOpenTransitionModalById,
}) => {
  const navigate = useNavigate();

  const columns: ColumnConfig[] = [
    {
      id: 'pending',
      title: 'Triage & Pending',
      statuses: ['CREATED', 'TRIAGED'],
      colorBadge: 'bg-sky-50 text-sky-800 border-sky-200 dark:bg-cyan-500/15 dark:text-cyan-300 dark:border-cyan-500/30',
      accentBorder: 'border-t-sky-500',
    },
    {
      id: 'assigned',
      title: 'Assigned / Dispatched',
      statuses: ['ASSIGNED', 'ACCEPTED'],
      colorBadge: 'bg-purple-50 text-purple-800 border-purple-200 dark:bg-purple-500/15 dark:text-purple-300 dark:border-purple-500/30',
      accentBorder: 'border-t-purple-500',
    },
    {
      id: 'in_progress',
      title: 'Work In Progress',
      statuses: ['IN_PROGRESS'],
      colorBadge: 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-500/15 dark:text-amber-300 dark:border-amber-500/30',
      accentBorder: 'border-t-amber-500',
    },
    {
      id: 'completed',
      title: 'Completed & Closed',
      statuses: ['COMPLETED'],
      colorBadge: 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-sage-300/15 dark:text-sage-300 dark:border-sage-300/30',
      accentBorder: 'border-t-emerald-600 dark:border-t-sage-300',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 items-start">
      {columns.map((col) => {
        const columnJobs = jobs.filter((j) => col.statuses.includes(j.status));

        return (
          <div
            key={col.id}
            className={`bg-white dark:bg-[#131D21] border border-slate-200 dark:border-[#22353A] rounded-2xl p-4 flex flex-col min-h-[520px] border-t-4 ${col.accentBorder} shadow-xs transition-all duration-80`}
          >
            {/* Column Header */}
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200 dark:border-[#22353A]">
              <span className="text-xs font-bold text-slate-900 dark:text-white tracking-wide uppercase font-mono">
                {col.title}
              </span>
              <span
                className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded-full border ${col.colorBadge}`}
              >
                {columnJobs.length}
              </span>
            </div>

            {/* Column Job Cards List */}
            <div className="space-y-3 flex-1 overflow-y-auto pr-1">
              {columnJobs.length === 0 ? (
                <div className="h-40 flex items-center justify-center text-xs text-slate-400 dark:text-slate-500 border border-dashed border-slate-200 dark:border-[#22353A] rounded-xl font-mono">
                  No tickets in this state
                </div>
              ) : (
                columnJobs.map((job) => (
                  <div
                    key={job.id}
                    onClick={() => onSelectJob(job.id)}
                    className="bg-slate-50 dark:bg-[#0C1215] border border-slate-200 dark:border-[#22353A] hover:border-slate-300 dark:hover:border-sage-300/40 rounded-xl p-4 shadow-2xs hover:shadow-xs hover:bg-slate-100/70 dark:hover:bg-[#152024] transition-all duration-80 cursor-pointer group space-y-3"
                  >
                    {/* Top Row: Job# and Priority */}
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-emerald-800 dark:text-sage-300 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                        {job.jobNumber}
                      </span>
                      <JobPriorityBadge priority={job.priority} size="sm" />
                    </div>

                    {/* Title & Customer */}
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1 group-hover:text-emerald-700 dark:group-hover:text-sage-300 transition-colors">
                        {job.title || job.customerName || 'Service Ticket'}
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-1 line-clamp-1">
                        <MapPin className="w-3 h-3 shrink-0 text-slate-400" />
                        <span>{job.address}</span>
                      </p>
                    </div>

                    {/* SLA countdown chip */}
                    <div className="pt-1">
                      <SlaCountdownChip
                        deadline={job.resolutionDeadline}
                        riskLevel={job.slaRiskLevel}
                        isCompleted={job.status === 'COMPLETED'}
                      />
                    </div>

                    {/* Technician info & Quick Advance action */}
                    <div className="pt-2 border-t border-slate-200 dark:border-[#22353A] flex items-center justify-between text-xs">
                      {job.assignedTechnicianName ? (
                        <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-700 dark:text-slate-300">
                          <UserCheck className="w-3 h-3 text-emerald-600 dark:text-sage-300" />
                          <span className="truncate max-w-[100px]">
                            {job.assignedTechnicianName}
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-[11px] text-slate-400 italic">
                          <UserX className="w-3 h-3 text-slate-400" />
                          <span>Unassigned</span>
                        </div>
                      )}

                      {/* Quick Action Button */}
                      <div onClick={(e) => e.stopPropagation()}>
                        {(job.status === 'CREATED' || job.status === 'TRIAGED') ? (
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => navigate(`/dispatch?jobId=${job.id}`)}
                            className="text-[10px] px-2 py-0.5"
                          >
                            <Send className="w-3 h-3 mr-1 text-emerald-600 dark:text-sage-300" />
                            Dispatch
                          </Button>
                        ) : job.status !== 'COMPLETED' && job.status !== 'CANCELLED' ? (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onOpenTransitionModalById(job.id)}
                            className="text-[10px] px-2 py-0.5"
                          >
                            <span>Next</span>
                            <ArrowRight className="w-3 h-3 ml-1" />
                          </Button>
                        ) : (
                          <span className="text-[10px] font-mono text-emerald-700 dark:text-sage-300 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> Done
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default JobKanbanView;
