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
      const jobs = await jobApi.getAllJobs();
      const dispatchQueue = jobs.filter(
        (j) => j.status === 'TRIAGED' || j.status === 'CREATED'
      );
      setTriagedJobs(dispatchQueue);

      if (dispatchQueue.length > 0 && !selectedJobId) {
        setSelectedJobId(dispatchQueue[0].id);
      }
    } catch (err) {
      console.error('Error fetching jobs queue', err);
      const demoFallback: JobSummary = {
        id: 1,
        jobNumber: 'JOB-2026-0001',
        priority: 'CRITICAL',
        status: 'TRIAGED',
        address: '1000 Main St, Dallas, TX 75202',
        latitude: 32.7767,
        longitude: -96.797,
        estimatedDurationMinutes: 120,
        createdAt: new Date().toISOString(),
      };
      setTriagedJobs([demoFallback]);
      if (!selectedJobId) setSelectedJobId(1);
    } finally {
      setIsLoadingJobs(false);
    }
  };

  const loadRecommendations = async (jobId: number, distanceLimit: number) => {
    try {
      setIsLoadingRecommendations(true);
      setErrorMessage(null);
      setAssignmentSuccess(null);
      setSelectedCandidate(null);

      const data = await dispatchApi.getRecommendations(jobId, distanceLimit);
      setRecommendations(data);

      const bestEligible = data.recommendations.find((c) => c.eligible);
      if (bestEligible) {
        setSelectedCandidate(bestEligible);
      } else if (data.recommendations.length > 0) {
        setSelectedCandidate(data.recommendations[0]);
      }
    } catch (err: unknown) {
      console.error('Failed to load dispatch recommendations', err);
      const errObj = err as { response?: { data?: { message?: string } } };
      setErrorMessage(
        errObj?.response?.data?.message ||
          'Failed to calculate dispatch recommendations for this job.'
      );
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
      <div className="bg-[#131D21] border border-[#22353A] rounded-xl p-3.5 shadow-xl flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Ticket Selector */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="p-2 rounded-lg bg-sage-300/10 text-sage-300 border border-sage-300/20 shrink-0">
            <Send className="w-4 h-4" />
          </div>
          <div className="flex-1 min-w-0">
            <label className="text-[10px] font-mono uppercase text-slate-400 block mb-0.5">
              Service Queue Ticket
            </label>
            <select
              value={selectedJobId || ''}
              onChange={(e) => setSelectedJobId(Number(e.target.value))}
              className="w-full bg-[#0C1215] border border-[#22353A] rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none focus:ring-1 focus:ring-sage-300 transition-all duration-80 font-mono truncate"
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
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
            <span className="flex items-center gap-1">
              <Sliders className="w-3 h-3 text-cyan-400" />
              Radius
            </span>
            <span className="font-bold text-sage-300">{maxDistanceKm} km</span>
          </div>
          <input
            type="range"
            min={10}
            max={150}
            step={5}
            value={maxDistanceKm}
            onChange={(e) => setMaxDistanceKm(Number(e.target.value))}
            className="w-full accent-sage-300 h-1 bg-[#0C1215] rounded-lg appearance-none cursor-pointer"
          />
        </div>

        {/* Tactical Counters */}
        <div className="flex items-center gap-4 border-t md:border-t-0 md:border-l border-[#22353A] pt-2 md:pt-0 md:pl-4 text-center shrink-0">
          <div>
            <span className="text-[10px] font-mono uppercase text-slate-500 block">Evaluated</span>
            <span className="text-sm font-mono font-bold text-white">
              {recommendations?.totalCandidatesEvaluated || 0}
            </span>
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase text-slate-500 block">Eligible</span>
            <span className="text-sm font-mono font-bold text-sage-300">
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
            className="px-2 text-slate-300"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>

      {/* Alert Banners */}
      {assignmentSuccess && (
        <div className="bg-[#131D21] border border-sage-300/40 rounded-xl p-3 flex items-center space-x-2.5 text-sage-300 text-xs shadow-lg">
          <CheckCircle2 className="w-4 h-4 text-sage-300 shrink-0" />
          <span>{assignmentSuccess}</span>
        </div>
      )}

      {errorMessage && (
        <div className="bg-rose-500/10 border border-rose-500/30 rounded-xl p-3 flex items-center space-x-2.5 text-rose-300 text-xs shadow-lg">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Main Tactical Map Viewport with Floating Glass Candidate Ranking Dock (Option B) */}
      <div className="relative w-full h-[620px] rounded-2xl overflow-hidden border border-[#22353A] shadow-2xl">
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
          <div className="w-full h-full bg-[#0C1215] flex items-center justify-center text-center">
            {isLoadingRecommendations ? (
              <LoadingSpinner size="lg" label="Computing multi-factor Haversine candidate rankings..." />
            ) : (
              <div className="text-slate-500 space-y-2 font-mono text-xs">
                <Send className="w-10 h-10 mx-auto text-slate-600" />
                <p>Select a service ticket above to compute candidate dispatch rankings.</p>
              </div>
            )}
          </div>
        )}

        {/* Floating Collapsible Frosted Glass Candidate Drawer (Option B) */}
        {recommendations && (
          <div
            className={`absolute top-3 right-3 z-[1000] transition-all duration-80 ${
              isDrawerCollapsed
                ? 'w-12 h-12 rounded-xl bg-[#131D21]/90 backdrop-blur-xl border border-[#22353A] shadow-2xl flex items-center justify-center cursor-pointer hover:border-sage-300/50'
                : 'w-80 sm:w-96 max-h-[580px] bg-[#131D21]/90 backdrop-blur-xl border border-[#22353A] shadow-2xl rounded-2xl p-4 flex flex-col'
            }`}
          >
            {isDrawerCollapsed ? (
              <button
                type="button"
                onClick={() => setIsDrawerCollapsed(false)}
                title="Expand Candidate Ranking Dock"
                className="w-full h-full flex items-center justify-center text-sage-300"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            ) : (
              <>
                {/* Drawer Header */}
                <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-[#22353A] shrink-0">
                  <div className="flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-sage-300" />
                    <h3 className="text-xs font-bold text-white font-mono uppercase tracking-wider">
                      Ranked Candidates ({recommendations.recommendations.length})
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsDrawerCollapsed(true)}
                    title="Minimize Dock"
                    className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-[#0C1215] transition-colors"
                  >
                    <Minimize2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Candidate List (Scrollable) */}
                <div className="space-y-2.5 flex-1 overflow-y-auto pr-1">
                  {recommendations.recommendations.length === 0 ? (
                    <div className="p-6 text-center text-slate-400 text-xs font-mono">
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

        {/* Selected Target Job Site Card (Bottom-Left Overlay) */}
        {selectedJob && (
          <div className="absolute bottom-3 left-3 z-[1000] max-w-sm bg-[#131D21]/90 backdrop-blur-xl border border-[#22353A] rounded-xl p-3 shadow-2xl text-xs space-y-1.5 hidden sm:block">
            <div className="flex items-center justify-between gap-2">
              <span className="font-mono font-bold text-sage-300">
                {selectedJob.jobNumber}
              </span>
              <JobPriorityBadge priority={selectedJob.priority} size="sm" />
            </div>
            <p className="text-[11px] text-slate-300 truncate font-medium">
              {selectedJob.address}
            </p>
            <div className="flex items-center gap-3 text-[10px] font-mono text-slate-400 border-t border-[#22353A] pt-1">
              <span>Est: {selectedJob.estimatedDurationMinutes}m</span>
              <span>&bull;</span>
              <span>Coords: {Number(selectedJob.latitude).toFixed(3)}, {Number(selectedJob.longitude).toFixed(3)}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
