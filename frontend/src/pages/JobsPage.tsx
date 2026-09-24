import React, { useEffect, useState } from 'react';
import {
  Job,
  JobSummary,
  JobStatus,
  ServiceRequest,
  CreateServiceRequestRequest,
  TriageServiceRequestRequest,
} from '../types/job';
import { jobApi } from '../api/jobs';
import { JobTableView } from '../components/jobs/JobTableView';
import { JobKanbanView } from '../components/jobs/JobKanbanView';
import { JobDetailDrawer } from '../components/jobs/JobDetailDrawer';
import { StatusTransitionModal } from '../components/jobs/StatusTransitionModal';
import { CreateRequestModal } from '../components/jobs/CreateRequestModal';
import { TriageModal } from '../components/jobs/TriageModal';
import { Button } from '../components/ui/Button';
import {
  Briefcase,
  LayoutGrid,
  Table as TableIcon,
  Plus,
  RefreshCw,
  Wrench,
  CheckCircle2,
  Clock,
  Flame,
} from 'lucide-react';
import { useWebSocket } from '../context/WebSocketContext';

export const JobsPage: React.FC = () => {
  const { latestAlert } = useWebSocket();
  const [jobs, setJobs] = useState<JobSummary[]>([]);
  const [pendingRequests, setPendingRequests] = useState<ServiceRequest[]>([]);
  const [viewMode, setViewMode] = useState<'table' | 'kanban'>('table');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Drawer & Modal States
  const [selectedJobId, setSelectedJobId] = useState<number | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);

  const [transitioningJob, setTransitioningJob] = useState<Job | null>(null);
  const [isTransitionModalOpen, setIsTransitionModalOpen] = useState<boolean>(false);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);

  const [selectedTriageRequest, setSelectedTriageRequest] = useState<ServiceRequest | null>(null);
  const [isTriageModalOpen, setIsTriageModalOpen] = useState<boolean>(false);

  // Load all jobs and pending service requests
  useEffect(() => {
    loadData();
  }, []);

  // Reload when a WebSocket alert arrives
  useEffect(() => {
    if (latestAlert) {
      loadData(false);
    }
  }, [latestAlert]);

  const loadData = async (showLoadingSpinner: boolean = true) => {
    try {
      if (showLoadingSpinner) setIsLoading(true);
      const [jobsData, reqsData] = await Promise.all([
        jobApi.getAllJobs().catch(() => []),
        jobApi.getAllRequests('RECEIVED').catch(() => []),
      ]);
      setJobs(jobsData);
      setPendingRequests(reqsData);
    } catch (err) {
      console.error('Failed to load jobs data:', err);
    } finally {
      if (showLoadingSpinner) setIsLoading(false);
    }
  };

  // Open Inspector Drawer for a job
  const handleSelectJob = (jobId: number) => {
    setSelectedJobId(jobId);
    setIsDrawerOpen(true);
  };

  // Open Transition Modal by fetching job details first
  const handleOpenTransitionModalById = async (jobId: number) => {
    try {
      const fullJob = await jobApi.getJobById(jobId);
      setTransitioningJob(fullJob);
      setIsTransitionModalOpen(true);
    } catch (err) {
      console.error('Failed to fetch job for transition:', err);
    }
  };

  const handleOpenTransitionModalFromDrawer = (job: Job) => {
    setTransitioningJob(job);
    setIsTransitionModalOpen(true);
  };

  // Execute State Transition
  const handleConfirmTransition = async (
    jobId: number,
    targetStatus: JobStatus,
    notes?: string
  ) => {
    await jobApi.transitionJobStatus(jobId, { status: targetStatus, notes });
    await loadData(false);
  };

  // Submit New Service Request
  const handleCreateRequest = async (dto: CreateServiceRequestRequest) => {
    await jobApi.createServiceRequest(dto);
    await loadData(false);
  };

  // Triage Service Request
  const handleTriageRequest = async (
    requestId: number,
    dto: TriageServiceRequestRequest
  ) => {
    await jobApi.triageRequest(requestId, dto);
    await loadData(false);
  };

  // Metrics KPI calculations
  const totalJobs = jobs.length;
  const inProgressJobs = jobs.filter((j) => j.status === 'IN_PROGRESS' || j.status === 'ACCEPTED').length;
  const criticalSlaJobs = jobs.filter((j) => j.priority === 'CRITICAL' && j.status !== 'COMPLETED').length;
  const completedJobs = jobs.filter((j) => j.status === 'COMPLETED').length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <Briefcase className="w-6 h-6 text-sage-300" />
            Field Jobs &amp; Lifecycle Management
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            End-to-end SLA tracked operational state machine: Created &rarr; Triaged &rarr; Dispatched &rarr; In Progress &rarr; Completed.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Triage Queue Trigger */}
          {pendingRequests.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              leftIcon={<Wrench className="w-3.5 h-3.5 text-amber-400" />}
              onClick={() => {
                setSelectedTriageRequest(pendingRequests[0]);
                setIsTriageModalOpen(true);
              }}
              className="border-amber-400/30 text-amber-300 bg-amber-500/10"
            >
              Triage Queue ({pendingRequests.length})
            </Button>
          )}

          {/* New Request Modal Trigger */}
          <Button
            variant="primary"
            size="sm"
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={() => setIsCreateModalOpen(true)}
          >
            New Service Ticket
          </Button>

          {/* Refresh Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => loadData(true)}
            title="Refresh jobs data"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>

          {/* View Switcher Toggle: Table vs Kanban */}
          <div className="bg-[#131D21] p-1 rounded-lg border border-[#22353A] flex items-center gap-1">
            <button
              type="button"
              onClick={() => setViewMode('table')}
              title="Table View"
              className={`px-2.5 py-1 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all duration-80 ${
                viewMode === 'table'
                  ? 'bg-sage-300 text-[#0C1215] shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <TableIcon className="w-3.5 h-3.5" />
              <span className="hidden md:inline font-mono">Table</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('kanban')}
              title="Kanban Board View"
              className={`px-2.5 py-1 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all duration-80 ${
                viewMode === 'kanban'
                  ? 'bg-sage-300 text-[#0C1215] shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span className="hidden md:inline font-mono">Kanban</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="bg-[#131D21] border border-[#22353A] border-t-2 border-t-sage-300/40 rounded-xl p-4 space-y-1 shadow-md hover:border-[#2f4950] transition-all duration-80">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono uppercase">
            <span>Total Tickets</span>
            <Briefcase className="w-4 h-4 text-sage-300" />
          </div>
          <div className="text-2xl font-mono font-bold text-white">
            {totalJobs}
          </div>
          <div className="text-[11px] text-slate-500">Tracked in lifecycle</div>
        </div>

        <div className="bg-[#131D21] border border-[#22353A] border-t-2 border-t-crimson-500/50 rounded-xl p-4 space-y-1 shadow-md hover:border-[#2f4950] transition-all duration-80">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono uppercase">
            <span>Critical SLA Risk</span>
            <Flame className="w-4 h-4 text-rose-400 animate-pulse" />
          </div>
          <div className="text-2xl font-mono font-bold text-rose-400">
            {criticalSlaJobs}
          </div>
          <div className="text-[11px] text-slate-500">Immediate attention</div>
        </div>

        <div className="bg-[#131D21] border border-[#22353A] border-t-2 border-t-amber-500/50 rounded-xl p-4 space-y-1 shadow-md hover:border-[#2f4950] transition-all duration-80">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono uppercase">
            <span>In-Progress Jobs</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-mono font-bold text-amber-400">
            {inProgressJobs}
          </div>
          <div className="text-[11px] text-slate-500">Active fieldwork</div>
        </div>

        <div className="bg-[#131D21] border border-[#22353A] border-t-2 border-t-sage-300/50 rounded-xl p-4 space-y-1 shadow-md hover:border-[#2f4950] transition-all duration-80">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono uppercase">
            <span>Completed</span>
            <CheckCircle2 className="w-4 h-4 text-sage-300" />
          </div>
          <div className="text-2xl font-mono font-bold text-sage-300">
            {completedJobs}
          </div>
          <div className="text-[11px] text-slate-500">SLA fulfilled</div>
        </div>
      </div>

      {/* Main View: Table vs Kanban */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-24 space-y-3 bg-[#131D21] rounded-2xl border border-[#22353A]">
          <div className="w-8 h-8 border-3 border-sage-300/20 border-t-sage-300 rounded-full animate-spin" />
          <p className="text-xs font-mono text-slate-400">
            Loading field jobs and SLA states...
          </p>
        </div>
      ) : viewMode === 'table' ? (
        <JobTableView
          jobs={jobs}
          onSelectJob={handleSelectJob}
          onOpenTransitionModalById={handleOpenTransitionModalById}
        />
      ) : (
        <JobKanbanView
          jobs={jobs}
          onSelectJob={handleSelectJob}
          onOpenTransitionModalById={handleOpenTransitionModalById}
        />
      )}

      {/* Slide-Over Job Inspector Drawer (480px Frosted Glass) */}
      <JobDetailDrawer
        jobId={selectedJobId}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onOpenTransitionModal={handleOpenTransitionModalFromDrawer}
      />

      {/* Status Transition Modal */}
      <StatusTransitionModal
        job={transitioningJob}
        isOpen={isTransitionModalOpen}
        onClose={() => setIsTransitionModalOpen(false)}
        onConfirm={handleConfirmTransition}
      />

      {/* Create Service Request Modal */}
      <CreateRequestModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateRequest}
      />

      {/* Triage Request Modal */}
      <TriageModal
        request={selectedTriageRequest}
        isOpen={isTriageModalOpen}
        onClose={() => setIsTriageModalOpen(false)}
        onTriage={handleTriageRequest}
      />
    </div>
  );
};
