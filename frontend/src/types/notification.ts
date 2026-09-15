import { SlaRiskLevel } from './sla';

export type NotificationSeverity = 'INFO' | 'WARNING' | 'CRITICAL';

export interface Notification {
  id: string;
  jobId: number;
  jobNumber: string;
  title: string;
  message: string;
  severity: NotificationSeverity;
  riskLevel: SlaRiskLevel;
  createdAt: string;
  acknowledged: boolean;
}
