import { Skill } from './job';

export type TechnicianStatus = 'AVAILABLE' | 'ON_JOB' | 'ON_BREAK' | 'OFFLINE';

export interface Technician {
  id: number;
  employeeCode: string;
  fullName: string;
  phone: string;
  status: TechnicianStatus;
  baseLatitude: number;
  baseLongitude: number;
  currentLatitude: number;
  currentLongitude: number;
  maxConcurrentJobs: number;
  activeJobsCount: number;
  rating: number;
  skills: Skill[];
}

export interface TechnicianSummary {
  id: number;
  fullName: string;
  employeeCode: string;
  status: TechnicianStatus;
  activeJobsCount: number;
  maxConcurrentJobs: number;
  rating: number;
  currentLatitude: number;
  currentLongitude: number;
}

export interface ScoreBreakdown {
  skillScore: number;
  distanceScore: number;
  workloadScore: number;
  slaScore: number;
  weightedTotal: number;
  details: string;
}

export interface ScoredCandidate {
  technicianId: number;
  employeeCode: string;
  fullName: string;
  phone: string;
  currentLatitude: number;
  currentLongitude: number;
  distanceKm: number;
  rating: number;
  activeJobsCount: number;
  maxConcurrentJobs: number;
  eligible: boolean;
  disqualificationReason?: string;
  matchedSkills: string[];
  missingSkills: string[];
  scoreBreakdown: ScoreBreakdown;
  totalScore: number;
}

export interface DispatchRecommendationResponse {
  jobId: number;
  jobNumber: string;
  title?: string;
  priority: string;
  status: string;
  address: string;
  latitude: number;
  longitude: number;
  scheduledStartTime?: string;
  requiredSkills: string[];
  recommendations: ScoredCandidate[];
  totalCandidatesEvaluated: number;
  eligibleCandidatesCount: number;
}

export interface ConfirmAssignmentRequest {
  jobId: number;
  technicianId: number;
  notes?: string;
}

export interface Assignment {
  id: number;
  jobId: number;
  jobNumber: string;
  technicianId: number;
  technicianName: string;
  technicianEmployeeCode: string;
  assignedBy?: string;
  dispatchScore: number;
  scoreExplanation: string;
  status: string;
  offeredAt: string;
  respondedAt?: string;
  rejectionReason?: string;
}
