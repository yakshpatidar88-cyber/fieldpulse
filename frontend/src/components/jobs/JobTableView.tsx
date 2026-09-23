import React, { useState, useMemo } from 'react';
import { JobSummary, JobStatus, JobPriority } from '../../types/job';
import { JobStatusBadge } from './JobStatusBadge';
import { JobPriorityBadge } from './JobPriorityBadge';
import { SlaCountdownChip } from './SlaCountdownChip';
import { Button } from '../ui/Button';
import {
  Search,
  Filter,
  SlidersHorizontal,
  Eye,
  Send,
  ArrowRight,
  UserCheck,
  UserX,
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
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white dark:bg-slate-900/60 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 transition-colors">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by job #, customer, address, or issue..."
            className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2">
          {/* Status Dropdown */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 px-3 py-1.5 text-xs text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
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
            className="rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 px-3 py-1.5 text-xs text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="ALL">All Priorities</option>
            <option value="CRITICAL">Critical</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm transition-colors">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/50 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-4">Job #</th>
                <th className="py-3 px-4">Service Scope &amp; Address</th>
                <th className="py-3 px-4">Priority</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">SLA Deadline</th>
                <th className="py-3 px-4">Assigned Engineer</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800/80 text-xs">
              {filteredJobs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500 dark:text-slate-400">
                    No jobs match the specified search or filter criteria.
                  </td>
                </tr>
              ) : (
                filteredJobs.map((job) => (
                  <tr
                    key={job.id}
                    onClick={() => onSelectJob(job.id)}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors cursor-pointer group"
                  >
                    {/* Job # */}
                    <td className="py-3.5 px-4 font-mono font-bold text-teal-600 dark:text-teal-400">
                      {job.jobNumber}
                    </td>

                    {/* Scope & Address */}
                    <td className="py-3.5 px-4 max-w-xs">
                      <div className="font-semibold text-slate-900 dark:text-white truncate">
                        {job.title || job.customerName || 'Service Ticket'}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                        {job.address}
                      </div>
                    </td>

                    {/* Priority */}
                    <td className="py-3.5 px-4">
                      <JobPriorityBadge priority={job.priority} size="sm" />
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      <JobStatusBadge status={job.status} size="sm" />
                    </td>

                    {/* SLA Deadline */}
                    <td className="py-3.5 px-4">
                      <SlaCountdownChip
                        deadline={job.resolutionDeadline}
                        riskLevel={job.slaRiskLevel}
                        isCompleted={job.status === 'COMPLETED'}
                      />
                    </td>

                    {/* Technician */}
                    <td className="py-3.5 px-4">
                      {job.assignedTechnicianName ? (
                        <div className="flex items-center space-x-1.5 font-medium text-slate-800 dark:text-slate-200">
                          <UserCheck className="w-3.5 h-3.5 text-emerald-500" />
                          <span>{job.assignedTechnicianName}</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-1.5 text-slate-400 italic">
                          <UserX className="w-3.5 h-3.5 text-slate-400" />
                          <span>Unassigned</span>
                        </div>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div
                        className="flex items-center justify-end gap-1.5"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Button
                          size="sm"
                          variant="ghost"
                          title="Inspect Details"
                          onClick={() => onSelectJob(job.id)}
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </Button>

                        {(job.status === 'CREATED' || job.status === 'TRIAGED') && (
                          <Button
                            size="sm"
                            variant="secondary"
                            title="Dispatch Candidate Matrix"
                            onClick={() => navigate(`/dispatch?jobId=${job.id}`)}
                          >
                            <Send className="w-3 h-3 text-teal-600 dark:text-teal-400" />
                          </Button>
                        )}

                        {job.status !== 'COMPLETED' && job.status !== 'CANCELLED' && (
                          <Button
                            size="sm"
                            variant="outline"
                            title="Advance Lifecycle State"
                            onClick={() => onOpenTransitionModalById(job.id)}
                          >
                            <ArrowRight className="w-3 h-3" />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer Count */}
        <div className="px-4 py-3 bg-slate-50/60 dark:bg-slate-950/40 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <span>
            Showing <strong className="text-slate-800 dark:text-slate-200">{filteredJobs.length}</strong> of{' '}
            {jobs.length} jobs
          </span>
          <span className="font-mono text-[11px]">SLA Proximity Engine</span>
        </div>
      </div>
    </div>
  );
};
