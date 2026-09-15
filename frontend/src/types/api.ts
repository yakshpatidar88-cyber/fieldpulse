export interface ApiResponse<T> {
  status: 'SUCCESS' | 'ERROR' | 'CREATED';
  message: string;
  data: T;
  timestamp: string;
  errorCode?: string;
  validationErrors?: Record<string, string>;
}
