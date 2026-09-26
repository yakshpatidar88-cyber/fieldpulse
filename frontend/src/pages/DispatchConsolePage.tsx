import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Send,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  Sliders,
  Filter,
  UserCheck,
  ChevronRight,
  ChevronLeft,
  Minimize2,
  Maximize2,
} from 'lucide-react';
import { dispatchApi } from '../api/dispatch';
import { jobApi } from '../api/jobs';
import {
  DispatchRecommendationResponse,
  ScoredCandidate,
} from '../types/dispatch';
import { JobSummary } from '../types/job';
import { DispatchMap } from '../components/dispatch/DispatchMap';
import { CandidateCard } from '../components/dispatch/CandidateCard';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { JobPriorityBadge } from '../components/jobs/JobPriorityBadge';

export const DispatchConsolePage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialJobId = searchParams.get('jobId');

  const [triagedJobs, setTriagedJobs] = useState<JobSummary[]>([]);
  const [selectedJobId, setSelectedJobId] = useState<number | null>(
    initialJobId ? Number(initialJobId) : null
  );
  const [maxDistanceKm, setMaxDistanceKm] = useState<number>(50);
  const [recommendations, setRecommendations] =
    useState<DispatchRecommendationResponse | null>(null);
  const [selectedCandidate, setSelectedCandidate] =
    useState<ScoredCandidate | null>(null);

  const [isLoadingJobs, setIsLoadingJobs] = useState(false);
  const [isLoadingRecommendations, setIsLoadingRecommendations] = useState(false);
  const [isAssigning, setIsAssigning] = useState(false);
  const [assignmentSuccess, setAssignmentSuccess] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isDrawerCollapsed, setIsDrawerCollapsed] = useState(false);

  // Load unassigned/triaged jobs on initial render
  useEffect(() => {
    loadTriagedJobs();
  }, []);

  // When selectedJobId or maxDistanceKm changes, fetch ranked recommendations
  useEffect(() => {
    if (selectedJobId) {
      loadRecommendations(selectedJobId, maxDistanceKm);
    }
  }, [selectedJobId, maxDistanceKm]);

  const loadTriagedJobs = async () => {
    try {
      setIsLoadingJobs(true);
      const res = await jobApi.getJobs({
        page: 0,
        size: 50,
      });

      // Filter for jobs that need dispatch (CREATED or TRIAGED)
      const dispatchable = res.content.filter(
        (j) => j.status === 'CREATED' || j.status === 'TRIAGED'
      );
      setTriagedJobs(dispatchable);

      // Auto-select first job if none selected
      if (!selectedJobId && dispatchable.length > 0) {
        setSelectedJobId(dispatchable[0].id);
      }
    } catch (err) {
      console.error('Failed to load dispatchable jobs', err);
    } finally {
      setIsLoadingJobs(false);
    }
  };

  const loadRecommendations = async (jobId: number, radius: number) => {
    try {
      setIsLoadingRecommendations(true);
      setErrorMessage(null);
      setAssignmentSuccess(null);
      const data = await dispatchApi.getRecommendations(jobId, radius);
      setRecommendations(data);

      // Auto-select #1 ranked candidate if available
      if (data.recommendations.length > 0) {
        const topEligible = data.recommendations.find((c) => c.eligible);
        setSelectedCandidate(topEligible || data.recommendations[0]);
      } else {
        setSelectedCandidate(null);
      }
    } catch (err) {
      console.error('Failed to load dispatch recommendations', err);
      setErrorMessage('Failed to load recommendations. Please retry.');
    } finally {
      setIsLoadingRecommendations(false);
    }
  };

  const handleConfirmAssignment = async (candidate: ScoredCandidate) => {
    if (!selectedJobId) return;

    try {
      setIsAssigning(true);
      setErrorMessage(null);
      await dispatchApi.confirmAssignment({
        jobId: selectedJobId,
        technicianId: candidate.technicianId,
        notes: `Assigned via automated multi-factor recommendation engine (Score: ${candidate.totalScore.toFixed(
          1
        )}/100)`,
      });

      setAssignmentSuccess(
        `Successfully dispatched ${candidate.fullName} to ${recommendations?.jobNumber}!`
      );

      await loadTriagedJobs();
    } catch (err: unknown) {
      const errObj = err as { response?: { data?: { message?: string } } };
      setErrorMessage(
        errObj?.response?.data?.message ||
          'Assignment failed. Technician or inventory constraints may have changed.'
      );
    } finally {
      setIsAssigning(false);
    }
  };

  const selectedJob = triagedJobs.find((j) => j.id === selectedJobId);

  return (
    <div className="space-y-4 max-w-7xl mx-auto">
      {/* Top Compact Tactical HUD Toolbar */}
      <div className="bg-white dark:bg-[#131D21] border border-slate-200 dark:border-[#22353A] rounded-xl p-3.5 shadow-md flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Ticket Selector */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="p-2 rounded-lg bg-emerald-50 dark:bg-sage-300/10 text-emerald-800 dark:text-sage-300 border border-emerald-200 dark:border-sage-300/20 shrink-0">
            <Send className="w-4 h-4" />
          </div>
          <div className="flex-1 min-w-0">
            <label className="text-[10px] font-mono uppercase text-slate-500 dark:text-slate-400 block mb-0.5 font-semibold">
              Service Queue Ticket
            </label>
            <select
              value={selectedJobId || ''}
              onChange={(e) => setSelectedJobId(Number(e.target.value))}
              className="w-full bg-slate-50 dark:bg-[#0C1215] border border-slate-200 dark:border-[#22353A] rounded-lg px-2.5 py-1 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:focus:ring-sage-300 transition-all duration-80 font-mono truncate"
            >
              {triagedJobs.length === 0 ? (
                <option value="">No unassigned tickets in queue</option>
              ) : (
                triagedJobs.map((job) => (
                  <option key={job.id} value={job.id}>
                    {job.jobNumber} &bull; {job.priority} &bull; {job.address}
                  </option>
                ))
              )}
            </select>
          </div>
        </div>

        {/* Distance Slider */}
        <div className="w-full md:w-56 shrink-0 space-y-1">
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1">
              <Sliders className="w-3 h-3 text-sky-600 dark:text-cyan-400" />
              Radius
            </span>
            <span className="font-bold text-emerald-700 dark:text-sage-300">{maxDistanceKm} km</span>
          </div>
          <input
            type="range"
            min={10}
            max={150}
            step={5}
            value={maxDistanceKm}
            onChange={(e) => setMaxDistanceKm(Number(e.target.value))}
            className="w-full accent-emerald-700 dark:accent-sage-300 h-1.5 bg-slate-200 dark:bg-[#0C1215] rounded-lg appearance-none cursor-pointer"
          />
        </div>

        {/* Tactical Counters */}
        <div className="flex items-center gap-4 border-t md:border-t-0 md:border-l border-slate-200 dark:border-[#22353A] pt-2 md:pt-0 md:pl-4 text-center shrink-0">
          <div>
            <span className="text-[10px] font-mono uppercase text-slate-500 block">Evaluated</span>
            <span className="text-sm font-mono font-bold text-slate-900 dark:text-white">
              {recommendations?.totalCandidatesEvaluated || 0}
            </span>
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase text-slate-500 block">Eligible</span>
            <span className="text-sm font-mono font-bold text-emerald-700 dark:text-sage-300">
              {recommendations?.eligibleCandidatesCount || 0}
            </span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              loadTriagedJobs();
              if (selectedJobId) loadRecommendations(selectedJobId, maxDistanceKm);
            }}
            isLoading={isLoadingRecommendations || isLoadingJobs}
            title="Refresh"
            className="px-2"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>

      {/* Alert Banners */}
      {assignmentSuccess && (
        <div className="bg-emerald-50 dark:bg-[#131D21] border border-emerald-200 dark:border-sage-300/40 rounded-xl p-3 flex items-center space-x-2.5 text-emerald-800 dark:text-sage-300 text-xs shadow-md">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-sage-300 shrink-0" />
          <span>{assignmentSuccess}</span>
        </div>
      )}

      {errorMessage && (
        <div className="bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/30 rounded-xl p-3 flex items-center space-x-2.5 text-rose-800 dark:text-rose-300 text-xs shadow-md">
          <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Main Tactical Map Viewport with Floating Glass Candidate Ranking Dock */}
      <div className="relative w-full h-[620px] rounded-2xl overflow-hidden border border-slate-200 dark:border-[#22353A] shadow-xl">
        {recommendations ? (
          <DispatchMap
            jobLatitude={recommendations.latitude}
            jobLongitude={recommendations.longitude}
            jobAddress={recommendations.address}
            jobNumber={recommendations.jobNumber}
            candidates={recommendations.recommendations}
            selectedCandidate={selectedCandidate}
            onSelectCandidate={(c) => setSelectedCandidate(c)}
            className="w-full h-full"
          />
        ) : (
          <div className="w-full h-full bg-slate-100 dark:bg-[#0C1215] flex items-center justify-center text-center">
            {isLoadingRecommendations ? (
              <LoadingSpinner size="lg" label="Computing multi-factor Haversine candidate rankings..." />
            ) : (
              <div className="text-slate-500 space-y-2 font-mono text-xs">
                <Send className="w-10 h-10 mx-auto text-slate-400 dark:text-slate-600" />
                <p>Select a service ticket above to compute candidate dispatch rankings.</p>
              </div>
            )}
          </div>
        )}

        {/* Floating Collapsible Frosted Glass Candidate Drawer */}
        {recommendations && (
          <div
            className={`absolute top-3 right-3 z-[1000] transition-all duration-80 ${
              isDrawerCollapsed
                ? 'w-12 h-12 rounded-xl bg-white/95 dark:bg-[#131D21]/90 backdrop-blur-xl border border-slate-200 dark:border-[#22353A] shadow-2xl flex items-center justify-center cursor-pointer hover:border-emerald-500/50'
                : 'w-80 sm:w-96 max-h-[580px] bg-white/95 dark:bg-[#131D21]/90 backdrop-blur-xl border border-slate-200 dark:border-[#22353A] shadow-2xl rounded-2xl p-4 flex flex-col'
            }`}
          >
            {isDrawerCollapsed ? (
              <button
                type="button"
                onClick={() => setIsDrawerCollapsed(false)}
                title="Expand Candidate Ranking Dock"
                className="w-full h-full flex items-center justify-center text-emerald-700 dark:text-sage-300"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            ) : (
              <>
                {/* Drawer Header */}
                <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-slate-200 dark:border-[#22353A] shrink-0">
                  <div className="flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-emerald-700 dark:text-sage-300" />
                    <h3 className="text-xs font-bold text-slate-900 dark:text-white font-mono uppercase tracking-wider">
                      Ranked Candidates ({recommendations.recommendations.length})
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsDrawerCollapsed(true)}
                    title="Minimize Dock"
                    className="p-1 rounded-md text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#0C1215] transition-colors"
                  >
                    <Minimize2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Candidate List (Scrollable) */}
                <div className="space-y-2.5 flex-1 overflow-y-auto pr-1">
                  {recommendations.recommendations.length === 0 ? (
                    <div className="p-6 text-center text-slate-500 dark:text-slate-400 text-xs font-mono">
                      No technicians within {maxDistanceKm} km. Expand proximity radius above.
                    </div>
                  ) : (
                    recommendations.recommendations.map((candidate, idx) => (
                      <CandidateCard
                        key={candidate.technicianId}
                        candidate={candidate}
                        rank={idx + 1}
                        isSelected={selectedCandidate?.technicianId === candidate.technicianId}
                        onSelect={() => setSelectedCandidate(candidate)}
                        onConfirmAssign={() => handleConfirmAssignment(candidate)}
                        isAssigning={isAssigning && selectedCandidate?.technicianId === candidate.technicianId}
                      />
                    ))
                  )}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DispatchConsolePage;
