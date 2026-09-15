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

export interface Job {
  id: number;
  jobNumber: string;
  serviceRequestId?: number;
  title?: string;
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
  assignedTechnician?: {
    id: number;
    employeeCode: string;
    fullName: string;
    phone: string;
  };
  requiredSkills: Skill[];
  createdAt: string;
  updatedAt?: string;
}

export interface JobStatusTransitionRequest {
  status: JobStatus;
  notes?: string;
}
