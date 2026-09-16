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
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';

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
      // Filter jobs that need dispatch (TRIAGED or CREATED)
      const dispatchQueue = jobs.filter(
        (j) => j.status === 'TRIAGED' || j.status === 'CREATED'
      );
      setTriagedJobs(dispatchQueue);

      if (dispatchQueue.length > 0 && !selectedJobId) {
        setSelectedJobId(dispatchQueue[0].id);
      }
    } catch (err) {
      console.error('Error fetching jobs queue', err);
      // Fallback demo job if local backend database is empty
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

      // Auto-select #1 ranked eligible candidate if available
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

      // Refresh jobs queue to remove dispatched job
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
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Send className="w-6 h-6 text-teal-400" />
            Operations Dispatch Console
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Multi-factor candidate ranking powered by certified skills, Haversine distance, workload balance, and SLA priority weight.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              loadTriagedJobs();
              if (selectedJobId) loadRecommendations(selectedJobId, maxDistanceKm);
            }}
            isLoading={isLoadingRecommendations || isLoadingJobs}
            leftIcon={<RefreshCw className="w-4 h-4" />}
          >
            Refresh Recommendations
          </Button>
        </div>
      </div>

      {/* Alert Banners */}
      {assignmentSuccess && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 flex items-center space-x-3 text-emerald-300 text-sm">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{assignmentSuccess}</span>
        </div>
      )}

      {errorMessage && (
        <div className="bg-rose-500/10 border border-rose-500/30 rounded-xl p-4 flex items-center space-x-3 text-rose-300 text-sm">
          <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Filter and Job Selection Bar */}
      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          {/* Active Job Selector */}
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5 flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-teal-400" />
              Service Queue Ticket
            </label>
            <select
              value={selectedJobId || ''}
              onChange={(e) => setSelectedJobId(Number(e.target.value))}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              {triagedJobs.length === 0 ? (
                <option value="">No unassigned tickets in queue</option>
              ) : (
                triagedJobs.map((job) => (
                  <option key={job.id} value={job.id}>
                    {job.jobNumber} — {job.priority} — {job.address}
                  </option>
                ))
              )}
            </select>
          </div>

          {/* Max Distance Slider */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-medium text-slate-400 flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-indigo-400" />
                Max Proximity Radius
              </label>
              <span className="text-xs font-mono font-semibold text-teal-300">
                {maxDistanceKm} km
              </span>
            </div>
            <input
              type="range"
              min={10}
              max={150}
              step={5}
              value={maxDistanceKm}
              onChange={(e) => setMaxDistanceKm(Number(e.target.value))}
              className="w-full accent-teal-500 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center justify-around border-t md:border-t-0 md:border-l border-slate-800 pt-3 md:pt-0 md:pl-4">
            <div className="text-center">
              <span className="text-xs text-slate-400 block">Evaluated</span>
              <span className="text-base font-bold text-white">
                {recommendations?.totalCandidatesEvaluated || 0}
              </span>
            </div>
            <div className="text-center">
              <span className="text-xs text-slate-400 block">Eligible</span>
              <span className="text-base font-bold text-teal-400">
                {recommendations?.eligibleCandidatesCount || 0}
              </span>
            </div>
            <div className="text-center">
              <span className="text-xs text-slate-400 block">Required Skills</span>
              <span className="text-base font-bold text-indigo-400">
                {recommendations?.requiredSkills.length || 0}
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* Main 2-Column Board: Left (Leaflet Map), Right (Ranked Candidates) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Map Column (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {recommendations ? (
            <DispatchMap
              jobLatitude={recommendations.latitude}
              jobLongitude={recommendations.longitude}
              jobAddress={recommendations.address}
              jobNumber={recommendations.jobNumber}
              candidates={recommendations.recommendations}
              selectedCandidate={selectedCandidate}
              onSelectCandidate={(c) => setSelectedCandidate(c)}
            />
          ) : (
            <Card className="min-h-[420px] flex items-center justify-center text-center">
              {isLoadingRecommendations ? (
                <LoadingSpinner size="lg" label="Calculating Haversine distances &amp; skill matrices..." />
              ) : (
                <div className="text-slate-500 space-y-2">
                  <Send className="w-12 h-12 mx-auto text-slate-600" />
                  <p>Select a service ticket above to compute candidate dispatch rankings.</p>
                </div>
              )}
            </Card>
          )}

          {/* Job Details Card */}
          {selectedJob && (
            <Card title={`Target: ${selectedJob.jobNumber}`} subtitle={selectedJob.address}>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div>
                  <span className="text-slate-500 block">Priority:</span>
                  <Badge
                    variant={
                      selectedJob.priority === 'CRITICAL'
                        ? 'danger'
                        : selectedJob.priority === 'HIGH'
                        ? 'warning'
                        : 'info'
                    }
                    size="sm"
                  >
                    {selectedJob.priority}
                  </Badge>
                </div>
                <div>
                  <span className="text-slate-500 block">Status:</span>
                  <span className="text-slate-300 font-mono">{selectedJob.status}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Est. Duration:</span>
                  <span className="text-slate-300 font-medium">
                    {selectedJob.estimatedDurationMinutes} mins
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block">Coordinates:</span>
                  <span className="text-slate-300 font-mono">
                    {Number(selectedJob.latitude).toFixed(3)}, {Number(selectedJob.longitude).toFixed(3)}
                  </span>
                </div>
              </div>
            </Card>
          )}
        </div>

        {/* Candidates Column (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-base font-semibold text-white flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-teal-400" />
              Ranked Candidates ({recommendations?.recommendations.length || 0})
            </h3>
            <span className="text-xs text-slate-400">Sorted by match score</span>
          </div>

          {isLoadingRecommendations ? (
            <Card className="p-12 text-center">
              <LoadingSpinner size="md" label="Scoring candidate pool..." />
            </Card>
          ) : !recommendations || recommendations.recommendations.length === 0 ? (
            <Card className="p-8 text-center text-slate-400 text-sm">
              No technician candidates found within {maxDistanceKm} km. Try expanding the proximity radius slider.
            </Card>
          ) : (
            <div className="space-y-3 max-h-[720px] overflow-y-auto pr-1">
              {recommendations.recommendations.map((candidate, idx) => (
                <CandidateCard
                  key={candidate.technicianId}
                  candidate={candidate}
                  rank={idx + 1}
                  isSelected={selectedCandidate?.technicianId === candidate.technicianId}
                  onSelect={() => setSelectedCandidate(candidate)}
                  onConfirmAssign={() => handleConfirmAssignment(candidate)}
                  isAssigning={isAssigning && selectedCandidate?.technicianId === candidate.technicianId}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
