import React from 'react';
import { ScoredCandidate } from '../../types/dispatch';
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
    if (score >= 80) return 'text-sage-300 bg-sage-300/15 border-sage-300/30';
    if (score >= 60) return 'text-cyan-300 bg-cyan-500/15 border-cyan-500/30';
    if (score >= 40) return 'text-amber-300 bg-amber-500/15 border-amber-500/30';
    return 'text-rose-400 bg-rose-500/15 border-rose-500/30';
  };

  const isDisqualified = !candidate.eligible;

  return (
    <div
      onClick={onSelect}
      className={`rounded-xl p-3.5 transition-all duration-80 cursor-pointer border ${
        isSelected
          ? 'bg-[#162227] border-sage-300 ring-1 ring-sage-300/40 shadow-lg shadow-black/40'
          : isDisqualified
          ? 'bg-[#0C1215]/60 border-[#22353A] opacity-50 hover:opacity-75'
          : 'bg-[#131D21] border-[#22353A] hover:border-[#2f4950] hover:bg-[#152024]'
      }`}
    >
      {/* Top row: Rank, Name, Employee Code, Score Badge */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center space-x-2.5">
          <div
            className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold font-mono ${
              rank === 1 && !isDisqualified
                ? 'bg-sage-300/20 text-sage-300 border border-sage-300/40'
                : 'bg-[#0C1215] text-slate-400 border border-[#22353A]'
            }`}
          >
            #{rank}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h4 className="text-xs font-bold text-white">{candidate.fullName}</h4>
              <span className="text-[10px] font-mono text-slate-500">
                {candidate.employeeCode}
              </span>
            </div>
            <div className="flex items-center space-x-2.5 text-[11px] text-slate-400 mt-0.5">
              <span className="flex items-center gap-1 font-mono">
                <MapPin className="w-3 h-3 text-sage-300" />
                {candidate.distanceKm.toFixed(1)} km
              </span>
              <span className="flex items-center gap-1 font-mono">
                <Layers className="w-3 h-3 text-cyan-400" />
                {candidate.activeJobsCount}/{candidate.maxConcurrentJobs}
              </span>
              <span className="flex items-center gap-1 text-amber-400 font-mono">
                <Star className="w-3 h-3 fill-amber-400" />
                {candidate.rating.toFixed(1)}
              </span>
            </div>
          </div>
        </div>

        {/* Overall Score */}
        <div className="text-right">
          {isDisqualified ? (
            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-rose-500/15 text-rose-300 border border-rose-500/30">
              Ineligible
            </span>
          ) : (
            <div
              className={`px-2 py-0.5 rounded-lg border font-mono font-bold text-xs flex items-center gap-1 ${getScoreColor(
                candidate.totalScore
              )}`}
            >
              <Award className="w-3 h-3" />
              {candidate.totalScore.toFixed(0)} pts
            </div>
          )}
        </div>
      </div>

      {/* Disqualification Reason if ineligible */}
      {isDisqualified && candidate.disqualificationReason && (
        <div className="mt-2 p-2 rounded bg-rose-500/10 border border-rose-500/20 text-rose-300 text-[11px] flex items-center gap-1.5 font-mono">
          <XCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{candidate.disqualificationReason}</span>
        </div>
      )}

      {/* Skills Match Chips */}
      <div className="mt-2.5 flex flex-wrap items-center gap-1">
        {candidate.matchedSkills.map((skill) => (
          <span
            key={skill}
            className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded bg-sage-300/10 text-sage-300 border border-sage-300/20"
          >
            <CheckCircle2 className="w-2.5 h-2.5" />
            {skill}
          </span>
        ))}
        {candidate.missingSkills.map((skill) => (
          <span
            key={skill}
            className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20"
          >
            <XCircle className="w-2.5 h-2.5" />
            {skill}
          </span>
        ))}
      </div>

      {/* Expandable Multi-Factor Score Breakdown */}
      <div className="mt-2.5 pt-2 border-t border-[#22353A]">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setShowBreakdown(!showBreakdown);
          }}
          className="text-[11px] text-slate-400 hover:text-white flex items-center justify-between w-full py-0.5 font-mono"
        >
          <span>Multi-Factor Weights</span>
          {showBreakdown ? (
            <ChevronUp className="w-3.5 h-3.5" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5" />
          )}
        </button>

        {showBreakdown && candidate.scoreBreakdown && (
          <div className="mt-2 grid grid-cols-2 gap-1.5 text-[11px] p-2 rounded-lg bg-[#0C1215] border border-[#22353A] font-mono">
            <div>
              <span className="text-slate-500">Skills (35%):</span>
              <span className="text-sage-300 ml-1 font-semibold">
                {candidate.scoreBreakdown.skillScore.toFixed(1)}
              </span>
            </div>
            <div>
              <span className="text-slate-500">Distance (25%):</span>
              <span className="text-sage-300 ml-1 font-semibold">
                {candidate.scoreBreakdown.distanceScore.toFixed(1)}
              </span>
            </div>
            <div>
              <span className="text-slate-500">Workload (20%):</span>
              <span className="text-sage-300 ml-1 font-semibold">
                {candidate.scoreBreakdown.workloadScore.toFixed(1)}
              </span>
            </div>
            <div>
              <span className="text-slate-500">SLA (20%):</span>
              <span className="text-sage-300 ml-1 font-semibold">
                {candidate.scoreBreakdown.slaScore.toFixed(1)}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Action footer when selected */}
      {isSelected && (
        <div className="mt-2.5 pt-2 flex items-center justify-end">
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
            Assign #{rank} &bull; {candidate.fullName}
          </Button>
        </div>
      )}
    </div>
  );
};
