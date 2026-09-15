export type Role = 'ROLE_ADMIN' | 'ROLE_DISPATCHER' | 'ROLE_TECHNICIAN';

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  roles: Role[];
  active?: boolean;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
  userId: number;
  email: string;
  roles: Role[];
}
