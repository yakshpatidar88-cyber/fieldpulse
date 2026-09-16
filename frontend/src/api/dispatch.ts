import apiClient from './client';
import { ApiResponse } from '../types/api';
import {
  DispatchRecommendationResponse,
  ConfirmAssignmentRequest,
  Assignment,
  TechnicianSummary,
} from '../types/dispatch';

export const dispatchApi = {
  /**
   * Fetch ranked technician candidates for a job based on multi-factor algorithm
   * (skills, Haversine distance, workload balance, SLA urgency)
   */
  getRecommendations: async (
    jobId: number,
    maxDistanceKm?: number
  ): Promise<DispatchRecommendationResponse> => {
    const params: Record<string, any> = { jobId };
    if (maxDistanceKm) {
      params.maxDistanceKm = maxDistanceKm;
    }
    const response = await apiClient.get<ApiResponse<DispatchRecommendationResponse>>(
      '/dispatch/recommendations',
      { params }
    );
    return response.data.data;
  },

  /**
   * Confirm technician assignment to a job
   */
  confirmAssignment: async (
    request: ConfirmAssignmentRequest
  ): Promise<Assignment> => {
    const response = await apiClient.post<ApiResponse<Assignment>>(
      '/dispatch/assign',
      request
    );
    return response.data.data;
  },

  /**
   * Get assignment history for a job
   */
  getAssignmentsForJob: async (jobId: number): Promise<Assignment[]> => {
    const response = await apiClient.get<ApiResponse<Assignment[]>>(
      `/dispatch/jobs/${jobId}/assignments`
    );
    return response.data.data;
  },

  /**
   * Get assignment history for a technician
   */
  getAssignmentsForTechnician: async (
    technicianId: number
  ): Promise<Assignment[]> => {
    const response = await apiClient.get<ApiResponse<Assignment[]>>(
      `/dispatch/technicians/${technicianId}/assignments`
    );
    return response.data.data;
  },

  /**
   * Fetch all active technicians with their current GPS coordinates and load
   */
  getAllTechnicians: async (): Promise<TechnicianSummary[]> => {
    const response = await apiClient.get<ApiResponse<TechnicianSummary[]>>(
      '/technicians'
    );
    return response.data.data;
  },
};
