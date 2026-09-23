export type JobPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type JobStatus =
  | 'CREATED'
  | 'TRIAGED'
  | 'ASSIGNED'
  | 'ACCEPTED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'CANCELLED';

export interface ServiceRequest {
  id: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  address: string;
  latitude: number;
  longitude: number;
  description: string;
  priority: JobPriority;
  status: string;
  createdAt: string;
}

export interface Skill {
  id: number;
  code: string;
  name: string;
  category?: string;
  description?: string;
}

export interface JobPartItem {
  id: number;
  partId?: number;
  partNumber?: string;
  partName?: string;
  quantityRequired: number;
  quantityUsed?: number;
  status?: 'RESERVED' | 'CONSUMED' | 'RETURNED';
}

export interface Job {
  id: number;
  jobNumber: string;
  serviceRequestId?: number;
  title?: string;
  description?: string;
  address: string;
  latitude: number;
  longitude: number;
  priority: JobPriority;
  status: JobStatus;
  estimatedDurationMinutes: number;
  scheduledStartTime?: string;
  actualStartTime?: string;
  completedAt?: string;
  completionNotes?: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  assignedTechnician?: {
    id: number;
    employeeCode: string;
    fullName: string;
    phone: string;
    email?: string;
    status?: string;
    avatarUrl?: string;
  };
  requiredSkills: Skill[];
  parts?: JobPartItem[];
  slaDeadline?: string;
  slaRiskLevel?: 'HEALTHY' | 'WARNING' | 'BREACHED';
  createdAt: string;
  updatedAt?: string;
}

export interface JobSummary {
  id: number;
  jobNumber: string;
  priority: JobPriority;
  status: JobStatus;
  address: string;
  latitude: number;
  longitude: number;
  estimatedDurationMinutes: number;
  customerName?: string;
  title?: string;
  description?: string;
  assignedTechnicianName?: string;
  assignedTechnicianId?: number;
  slaRiskLevel?: 'HEALTHY' | 'WARNING' | 'BREACHED';
  resolutionDeadline?: string;
  createdAt: string;
}

export interface JobStatusTransitionRequest {
  status: JobStatus;
  notes?: string;
}

export interface AuditEvent {
  id: number;
  entityName: string;
  entityId: number;
  action: string;
  performedByEmail?: string;
  previousState?: string;
  newState?: string;
  metadata?: string;
  createdAt: string;
}

export interface CreateServiceRequestRequest {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  address: string;
  latitude: number;
  longitude: number;
  description: string;
  priority?: JobPriority;
}

export interface TriageServiceRequestRequest {
  priority: JobPriority;
  requiredSkillIds: number[];
  estimatedDurationMinutes: number;
  scheduledStartTime?: string;
  requiredParts?: {
    partId: number;
    quantityRequired: number;
  }[];
}
