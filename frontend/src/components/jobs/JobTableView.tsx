import React, { useState, useMemo } from 'react';
import { JobSummary, JobStatus, JobPriority } from '../../types/job';
import { JobStatusBadge } from './JobStatusBadge';
import { JobPriorityBadge } from './JobPriorityBadge';
import { SlaCountdownChip } from './SlaCountdownChip';
import { Button } from '../ui/Button';
import {
  Search,
  Filter,
  Eye,
  Send,
  ArrowRight,
  UserCheck,
  UserX,
  ChevronRight,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface JobTableViewProps {
  jobs: JobSummary[];
  onSelectJob: (jobId: number) => void;
  onOpenTransitionModalById: (jobId: number) => void;
}

export const JobTableView: React.FC<JobTableViewProps> = ({
  jobs,
  onSelectJob,
  onOpenTransitionModalById,
}) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [priorityFilter, setPriorityFilter] = useState<string>('ALL');

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const matchSearch =
        searchTerm === '' ||
        job.jobNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (job.title && job.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (job.customerName && job.customerName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        job.address.toLowerCase().includes(searchTerm.toLowerCase());

      const matchStatus = statusFilter === 'ALL' || job.status === statusFilter;
      const matchPriority = priorityFilter === 'ALL' || job.priority === priorityFilter;

      return matchSearch && matchStatus && matchPriority;
    });
  }, [jobs, searchTerm, statusFilter, priorityFilter]);

  return (
    <div className="space-y-4">
      {/* Search and Filters Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white dark:bg-[#131D21] p-3.5 rounded-xl border border-slate-200 dark:border-[#22353A] shadow-xs">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by job #, customer, address, or issue..."
            className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-slate-50 dark:bg-[#0C1215] border border-slate-200 dark:border-[#22353A] text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:focus:ring-sage-300 focus:border-emerald-500 dark:focus:border-sage-300 transition-all duration-80"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2">
          {/* Status Dropdown */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-lg bg-slate-50 dark:bg-[#0C1215] border border-slate-200 dark:border-[#22353A] px-3 py-1.5 text-xs text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:focus:ring-sage-300 transition-all duration-80"
          >
            <option value="ALL">All Statuses</option>
            <option value="CREATED">Created</option>
            <option value="TRIAGED">Triaged</option>
            <option value="ASSIGNED">Assigned</option>
            <option value="ACCEPTED">Accepted</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>

          {/* Priority Dropdown */}
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="rounded-lg bg-slate-50 dark:bg-[#0C1215] border border-slate-200 dark:border-[#22353A] px-3 py-1.5 text-xs text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:focus:ring-sage-300 transition-all duration-80"
          >
            <option value="ALL">All Priorities</option>
            <option value="CRITICAL">Critical</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>
        </div>
      </div>

      {/* Floating Tactical Strips Header (Visible on Desktop) */}
      <div className="hidden lg:grid grid-cols-12 gap-4 px-4 py-2 text-[11px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold">
        <div className="col-span-2">Job Number</div>
        <div className="col-span-3">Service Scope &amp; Address</div>
        <div className="col-span-1">Priority</div>
        <div className="col-span-2">Status</div>
        <div className="col-span-2">SLA Window</div>
        <div className="col-span-2 text-right">Actions</div>
      </div>

      {/* Floating Tactical Card Strips */}
      <div className="space-y-2">
        {filteredJobs.length === 0 ? (
          <div className="bg-white dark:bg-[#131D21] border border-slate-200 dark:border-[#22353A] rounded-xl p-12 text-center text-slate-500 dark:text-slate-400 text-xs font-mono">
            No field service jobs match the specified search or filter criteria.
          </div>
        ) : (
          filteredJobs.map((job) => (
            <div
              key={job.id}
              onClick={() => onSelectJob(job.id)}
              className="bg-white dark:bg-[#131D21] border border-slate-200 dark:border-[#22353A] hover:border-slate-300 dark:hover:border-sage-300/40 hover:bg-slate-50/50 dark:hover:bg-[#162227] rounded-xl p-4 transition-all duration-80 cursor-pointer shadow-xs hover:shadow-md group"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 lg:gap-4 items-center">
                {/* Column 1: Job # & Tech */}
                <div className="lg:col-span-2 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-emerald-800 dark:text-sage-300 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                      {job.jobNumber}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5 truncate">
                    {job.assignedTechnicianName ? (
                      <>
                        <UserCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-sage-300 shrink-0" />
                        <span className="text-slate-700 dark:text-slate-300 truncate">{job.assignedTechnicianName}</span>
                      </>
                    ) : (
                      <>
                        <UserX className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="italic text-slate-400">Unassigned</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Column 2: Scope & Address */}
                <div className="lg:col-span-3 space-y-0.5">
                  <h4 className="text-xs font-semibold text-slate-900 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-sage-300 transition-colors truncate">
                    {job.title || job.customerName || 'Service Incident'}
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                    {job.address}
                  </p>
                </div>

                {/* Column 3: Priority */}
                <div className="lg:col-span-1">
                  <JobPriorityBadge priority={job.priority} size="sm" />
                </div>

                {/* Column 4: Status */}
                <div className="lg:col-span-2">
                  <JobStatusBadge status={job.status} size="sm" />
                </div>

                {/* Column 5: SLA Countdown */}
                <div className="lg:col-span-2">
                  <SlaCountdownChip
                    deadline={job.resolutionDeadline}
                    riskLevel={job.slaRiskLevel}
                    isCompleted={job.status === 'COMPLETED'}
                  />
                </div>

                {/* Column 6: Actions */}
                <div className="lg:col-span-2 flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
                  <Button
                    size="sm"
                    variant="ghost"
                    title="Inspect Details"
                    onClick={() => onSelectJob(job.id)}
                    className="text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </Button>

                  {(job.status === 'CREATED' || job.status === 'TRIAGED') && (
                    <Button
                      size="sm"
                      variant="secondary"
                      title="Dispatch Candidate Matrix"
                      onClick={() => navigate(`/dispatch?jobId=${job.id}`)}
                      className="px-2"
                    >
                      <Send className="w-3 h-3 text-emerald-600 dark:text-sage-300 mr-1" />
                      <span className="text-[10px]">Dispatch</span>
                    </Button>
                  )}

                  {job.status !== 'COMPLETED' && job.status !== 'CANCELLED' && (
                    <Button
                      size="sm"
                      variant="outline"
                      title="Advance Lifecycle State"
                      onClick={() => onOpenTransitionModalById(job.id)}
                      className="px-2"
                    >
                      <span className="text-[10px] mr-1">Next</span>
                      <ArrowRight className="w-3 h-3" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Floating Strip Footer */}
      <div className="px-4 py-3 bg-white dark:bg-[#131D21] border border-slate-200 dark:border-[#22353A] rounded-xl flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 shadow-2xs">
        <span>
          Showing <strong className="text-slate-900 dark:text-white">{filteredJobs.length}</strong> of{' '}
          {jobs.length} jobs
        </span>
        <span className="font-mono text-[11px] text-emerald-700 dark:text-sage-300 font-semibold">
          SLA Proximity Engine &bull; Tactical Fleet
        </span>
      </div>
    </div>
  );
};

export default JobTableView;
