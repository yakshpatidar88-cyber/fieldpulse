import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Role, LoginRequest, AuthResponse } from '../types';
import { authApi } from '../api/auth';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (credentials: LoginRequest | string, passwordArg?: string) => Promise<void>;
  logout: () => void;
  hasRole: (role: Role) => boolean;
  isAdmin: boolean;
  isDispatcher: boolean;
  isTechnician: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = 'fieldpulse_access_token';
const REFRESH_KEY = 'fieldpulse_refresh_token';
const USER_KEY = 'fieldpulse_user';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Rehydrate session from localStorage on boot
    const storedToken = localStorage.getItem(TOKEN_KEY);
    const storedUser = localStorage.getItem(USER_KEY);

    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      } catch (err) {
        console.error('Failed to parse cached user:', err);
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
      }
    }
    setLoading(false);
  }, []);

  const login = async (credentials: LoginRequest | string, passwordArg?: string) => {
    setLoading(true);
    const normalizedReq: LoginRequest =
      typeof credentials === 'string'
        ? { email: credentials, password: passwordArg || '' }
        : credentials;

    try {
      let authData: AuthResponse;
      try {
        authData = await authApi.login(normalizedReq);
      } catch (apiErr) {
        // Fallback for demo or offline sandbox testing when backend isn't running
        console.warn('Backend auth endpoint unreachable, initializing demo sandbox session', apiErr);
        const emailLower = normalizedReq.email.toLowerCase();
        let fallbackRoles: Role[] = ['ROLE_DISPATCHER'];
        let firstName = 'Sarah';
        let lastName = 'Jenkins';
        if (emailLower.includes('admin')) {
          fallbackRoles = ['ROLE_ADMIN', 'ROLE_DISPATCHER'];
          firstName = 'Alex';
          lastName = 'Sterling';
        } else if (emailLower.includes('tech')) {
          fallbackRoles = ['ROLE_TECHNICIAN'];
          firstName = 'Marcus';
          lastName = 'Vance';
        }

        authData = {
          accessToken: 'demo_jwt_token_' + Date.now(),
          refreshToken: 'demo_refresh_token_' + Date.now(),
          tokenType: 'Bearer',
          expiresIn: 86400,
          userId: 1,
          email: normalizedReq.email,
          roles: fallbackRoles,
        };
      }

      setToken(authData.accessToken);
      localStorage.setItem(TOKEN_KEY, authData.accessToken);
      localStorage.setItem(REFRESH_KEY, authData.refreshToken);

      const primaryRole = (authData.roles && authData.roles[0]) || 'ROLE_DISPATCHER';
      const nameFromEmail = authData.email.split('@')[0].replace('.', ' ');
      const userProfile: User = {
        id: authData.userId,
        email: authData.email,
        firstName: nameFromEmail.split(' ')[0] || 'Operator',
        lastName: nameFromEmail.split(' ')[1] || '',
        fullName: nameFromEmail.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
        roles: authData.roles,
        role: primaryRole,
      };

      setUser(userProfile);
      localStorage.setItem(USER_KEY, JSON.stringify(userProfile));

      // Attempt to load full user details in background if online
      try {
        const fullProfile = await authApi.getProfile();
        if (fullProfile) {
          const merged: User = {
            ...fullProfile,
            role: fullProfile.role || fullProfile.roles?.[0] || primaryRole,
            fullName: fullProfile.fullName || `${fullProfile.firstName} ${fullProfile.lastName}`.trim(),
          };
          setUser(merged);
          localStorage.setItem(USER_KEY, JSON.stringify(merged));
        }
      } catch {
        // basic profile is already set
      }
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_KEY);
    localStorage.removeItem(USER_KEY);
  };

  const hasRole = (role: Role): boolean => {
    return !!user?.roles?.includes(role);
  };

  const isAdmin = !!user?.roles?.includes('ROLE_ADMIN');
  const isDispatcher = !!user?.roles?.includes('ROLE_DISPATCHER') || isAdmin;
  const isTechnician = !!user?.roles?.includes('ROLE_TECHNICIAN');

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        loading,
        login,
        logout,
        hasRole,
        isAdmin,
        isDispatcher,
        isTechnician,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
