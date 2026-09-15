export type SlaRiskLevel = 'HEALTHY' | 'WARNING' | 'BREACHED';

export interface Sla {
  id: number;
  jobId: number;
  responseDeadline: string;
  resolutionDeadline: string;
  respondedAt?: string;
  resolvedAt?: string;
  riskLevel: SlaRiskLevel;
  breachReason?: string;
}

export interface SlaDashboardMetrics {
  totalActiveJobs: number;
  healthyCount: number;
  warningCount: number;
  breachedCount: number;
  complianceRatePercent: number;
}
