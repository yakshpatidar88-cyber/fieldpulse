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
  AlertCircle,
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
      colorBadge: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
      accentBorder: 'border-t-blue-500',
    },
    {
      id: 'assigned',
      title: 'Assigned / Dispatched',
      statuses: ['ASSIGNED', 'ACCEPTED'],
      colorBadge: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
      accentBorder: 'border-t-purple-500',
    },
    {
      id: 'in_progress',
      title: 'Work In Progress',
      statuses: ['IN_PROGRESS'],
      colorBadge: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
      accentBorder: 'border-t-amber-500',
    },
    {
      id: 'completed',
      title: 'Completed & Closed',
      statuses: ['COMPLETED'],
      colorBadge: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
      accentBorder: 'border-t-emerald-500',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 items-start">
      {columns.map((col) => {
        const columnJobs = jobs.filter((j) => col.statuses.includes(j.status));

        return (
          <div
            key={col.id}
            className={`bg-slate-100/60 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-3.5 flex flex-col min-h-[500px] border-t-4 ${col.accentBorder} transition-colors`}
          >
            {/* Column Header */}
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200 dark:border-slate-800">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
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
                <div className="h-40 flex items-center justify-center text-xs text-slate-400 dark:text-slate-500 border border-dashed border-slate-300 dark:border-slate-800 rounded-xl">
                  No tickets in this state
                </div>
              ) : (
                columnJobs.map((job) => (
                  <div
                    key={job.id}
                    onClick={() => onSelectJob(job.id)}
                    className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-xs hover:border-teal-500/50 dark:hover:border-teal-500/40 hover:shadow-md transition-all cursor-pointer group space-y-3"
                  >
                    {/* Top Row: Job# and Priority */}
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-teal-600 dark:text-teal-400">
                        {job.jobNumber}
                      </span>
                      <JobPriorityBadge priority={job.priority} size="sm" />
                    </div>

                    {/* Title & Customer */}
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
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
                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
                      {job.assignedTechnicianName ? (
                        <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-700 dark:text-slate-300">
                          <UserCheck className="w-3 h-3 text-emerald-500" />
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
                            title="Open Dispatch Matrix"
                            className="text-[10px] py-1 px-2"
                          >
                            <Send className="w-3 h-3 mr-1 text-teal-600 dark:text-teal-400" />
                            Dispatch
                          </Button>
                        ) : job.status !== 'COMPLETED' && job.status !== 'CANCELLED' ? (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onOpenTransitionModalById(job.id)}
                            title="Advance State"
                            className="text-[10px] py-1 px-2"
                          >
                            Next <ArrowRight className="w-3 h-3 ml-1" />
                          </Button>
                        ) : (
                          <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> Closed
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
