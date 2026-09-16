import apiClient from './client';
import { ApiResponse } from '../types/api';
import { Job, JobSummary, JobPriority, JobStatus } from '../types/job';

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
};
