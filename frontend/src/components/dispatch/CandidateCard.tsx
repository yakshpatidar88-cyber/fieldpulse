import React from 'react';
import { ScoredCandidate } from '../../types/dispatch';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import {
  MapPin,
  CheckCircle2,
  XCircle,
  Award,
  Layers,
  Star,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface CandidateCardProps {
  candidate: ScoredCandidate;
  rank: number;
  isSelected: boolean;
  onSelect: () => void;
  onConfirmAssign: () => void;
  isAssigning?: boolean;
}

export const CandidateCard: React.FC<CandidateCardProps> = ({
  candidate,
  rank,
  isSelected,
  onSelect,
  onConfirmAssign,
  isAssigning = false,
}) => {
  const [showBreakdown, setShowBreakdown] = React.useState(false);

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
    if (score >= 60) return 'text-teal-400 bg-teal-500/10 border-teal-500/30';
    if (score >= 40) return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
    return 'text-rose-400 bg-rose-500/10 border-rose-500/30';
  };

  const isDisqualified = !candidate.eligible;

  return (
    <div
      onClick={onSelect}
      className={`rounded-xl p-4 transition-all cursor-pointer border ${
        isSelected
          ? 'bg-slate-900 border-teal-500 ring-1 ring-teal-500/50 shadow-lg shadow-teal-950/30'
          : isDisqualified
          ? 'bg-slate-950/40 border-slate-800/60 opacity-60 hover:opacity-80'
          : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900/90'
      }`}
    >
      {/* Top row: Rank, Name, Employee Code, Score Badge */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center space-x-3">
          <div
            className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold font-mono ${
              rank === 1 && !isDisqualified
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                : 'bg-slate-800 text-slate-400 border border-slate-700'
            }`}
          >
            #{rank}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h4 className="text-sm font-semibold text-white">{candidate.fullName}</h4>
              <span className="text-[11px] font-mono text-slate-500">
                {candidate.employeeCode}
              </span>
            </div>
            <div className="flex items-center space-x-3 text-xs text-slate-400 mt-0.5">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-teal-400" />
                {candidate.distanceKm.toFixed(1)} km away
              </span>
              <span className="flex items-center gap-1">
                <Layers className="w-3.5 h-3.5 text-indigo-400" />
                {candidate.activeJobsCount}/{candidate.maxConcurrentJobs} load
              </span>
              <span className="flex items-center gap-1 text-amber-400">
                <Star className="w-3 h-3 fill-amber-400" />
                {candidate.rating.toFixed(1)}
              </span>
            </div>
          </div>
        </div>

        {/* Overall Score */}
        <div className="text-right">
          {isDisqualified ? (
            <Badge variant="danger" size="sm">
              Disqualified
            </Badge>
          ) : (
            <div
              className={`px-2.5 py-1 rounded-lg border font-mono font-bold text-sm flex items-center gap-1 ${getScoreColor(
                candidate.totalScore
              )}`}
            >
              <Award className="w-3.5 h-3.5" />
              {candidate.totalScore.toFixed(0)} pts
            </div>
          )}
        </div>
      </div>

      {/* Disqualification Reason if ineligible */}
      {isDisqualified && candidate.disqualificationReason && (
        <div className="mt-2.5 p-2 rounded bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-1.5">
          <XCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{candidate.disqualificationReason}</span>
        </div>
      )}

      {/* Skills Match Chips */}
      <div className="mt-3 flex flex-wrap items-center gap-1.5">
        {candidate.matchedSkills.map((skill) => (
          <span
            key={skill}
            className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium"
          >
            <CheckCircle2 className="w-3 h-3" />
            {skill}
          </span>
        ))}
        {candidate.missingSkills.map((skill) => (
          <span
            key={skill}
            className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20 font-medium"
          >
            <XCircle className="w-3 h-3" />
            {skill}
          </span>
        ))}
      </div>

      {/* Expandable Multi-Factor Score Breakdown */}
      <div className="mt-3 pt-2.5 border-t border-slate-800/80">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setShowBreakdown(!showBreakdown);
          }}
          className="text-xs text-slate-400 hover:text-slate-200 flex items-center justify-between w-full py-1"
        >
          <span>Multi-Factor Scoring Weights</span>
          {showBreakdown ? (
            <ChevronUp className="w-3.5 h-3.5" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5" />
          )}
        </button>

        {showBreakdown && candidate.scoreBreakdown && (
          <div className="mt-2 grid grid-cols-2 gap-2 text-xs p-2.5 rounded-lg bg-slate-950/70 border border-slate-800 font-mono">
            <div>
              <span className="text-slate-500">Skills (35%):</span>
              <span className="text-teal-300 ml-1 font-semibold">
                {candidate.scoreBreakdown.skillScore.toFixed(1)}
              </span>
            </div>
            <div>
              <span className="text-slate-500">Distance (25%):</span>
              <span className="text-teal-300 ml-1 font-semibold">
                {candidate.scoreBreakdown.distanceScore.toFixed(1)}
              </span>
            </div>
            <div>
              <span className="text-slate-500">Workload (20%):</span>
              <span className="text-teal-300 ml-1 font-semibold">
                {candidate.scoreBreakdown.workloadScore.toFixed(1)}
              </span>
            </div>
            <div>
              <span className="text-slate-500">SLA Urgency (20%):</span>
              <span className="text-teal-300 ml-1 font-semibold">
                {candidate.scoreBreakdown.slaScore.toFixed(1)}
              </span>
            </div>
            <div className="col-span-2 pt-1 border-t border-slate-800 text-[11px] text-slate-400">
              {candidate.scoreBreakdown.details}
            </div>
          </div>
        )}
      </div>

      {/* Action footer when selected */}
      {isSelected && (
        <div className="mt-3 pt-2 flex items-center justify-end">
          <Button
            size="sm"
            variant="primary"
            disabled={isDisqualified || isAssigning}
            isLoading={isAssigning}
            onClick={(e) => {
              e.stopPropagation();
              onConfirmAssign();
            }}
          >
            Assign Candidate #{rank}
          </Button>
        </div>
      )}
    </div>
  );
};
