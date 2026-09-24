export type Role = 'ROLE_ADMIN' | 'ROLE_DISPATCHER' | 'ROLE_TECHNICIAN' | 'ROLE_CUSTOMER' | string;

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  fullName?: string;
  roles: Role[];
  role?: Role;
  technicianProfile?: any;
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
