import apiClient from './client';
import { ApiResponse } from '../types/api';
import {
  Job,
  JobSummary,
  JobPriority,
  JobStatus,
  JobStatusTransitionRequest,
  AuditEvent,
  ServiceRequest,
  CreateServiceRequestRequest,
  TriageServiceRequestRequest,
} from '../types/job';

export const jobApi = {
  /**
   * Fetch all jobs with optional filters
   */
  getAllJobs: async (
    status?: JobStatus,
    priority?: JobPriority
  ): Promise<JobSummary[]> => {
    const params: Record<string, any> = {};
    if (status) params.status = status;
    if (priority) params.priority = priority;

    const response = await apiClient.get<ApiResponse<JobSummary[]>>('/jobs', {
      params,
    });
    return response.data.data;
  },

  /**
   * Fetch full job details by ID
   */
  getJobById: async (id: number): Promise<Job> => {
    const response = await apiClient.get<ApiResponse<Job>>(`/jobs/${id}`);
    return response.data.data;
  },

  /**
   * Fetch full job details by job number
   */
  getJobByNumber: async (jobNumber: string): Promise<Job> => {
    const response = await apiClient.get<ApiResponse<Job>>(
      `/jobs/number/${jobNumber}`
    );
    return response.data.data;
  },

  /**
   * Fetch active jobs assigned to a technician
   */
  getActiveJobsForTechnician: async (
    technicianId: number
  ): Promise<JobSummary[]> => {
    const response = await apiClient.get<ApiResponse<JobSummary[]>>(
      `/jobs/technician/${technicianId}/active`
    );
    return response.data.data;
  },

  /**
   * Transition job status (e.g. IN_PROGRESS -> COMPLETED)
   */
  transitionJobStatus: async (
    id: number,
    dto: JobStatusTransitionRequest
  ): Promise<Job> => {
    const response = await apiClient.patch<ApiResponse<Job>>(
      `/jobs/${id}/status`,
      dto
    );
    return response.data.data;
  },

  /**
   * Fetch audit trail for a job
   */
  getJobAuditTrail: async (id: number): Promise<AuditEvent[]> => {
    const response = await apiClient.get<ApiResponse<AuditEvent[]>>(
      `/jobs/${id}/audit-trail`
    );
    return response.data.data;
  },

  /**
   * Fetch all service requests awaiting triage
   */
  getAllRequests: async (
    status?: string,
    priority?: JobPriority
  ): Promise<ServiceRequest[]> => {
    const params: Record<string, any> = {};
    if (status) params.status = status;
    if (priority) params.priority = priority;

    const response = await apiClient.get<ApiResponse<ServiceRequest[]>>(
      '/requests',
      { params }
    );
    return response.data.data;
  },

  /**
   * Submit a new customer service request
   */
  createServiceRequest: async (
    dto: CreateServiceRequestRequest
  ): Promise<ServiceRequest> => {
    const response = await apiClient.post<ApiResponse<ServiceRequest>>(
      '/requests',
      dto
    );
    return response.data.data;
  },

  /**
   * Triage a service request and convert it into an operational job
   */
  triageRequest: async (
    id: number,
    dto: TriageServiceRequestRequest
  ): Promise<Job> => {
    const response = await apiClient.post<ApiResponse<Job>>(
      `/requests/${id}/triage`,
      dto
    );
    return response.data.data;
  },
};
