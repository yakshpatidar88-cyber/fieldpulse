import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Role, LoginRequest, AuthResponse } from '../types';
import { authApi } from '../api/auth';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => void;
  hasRole: (role: Role) => boolean;
  isAdmin: boolean;
  isDispatcher: boolean;
  isTechnician: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = 'opsflow_access_token';
const REFRESH_KEY = 'opsflow_refresh_token';
const USER_KEY = 'opsflow_user';

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

  const login = async (credentials: LoginRequest) => {
    setLoading(true);
    try {
      const authData: AuthResponse = await authApi.login(credentials);
      setToken(authData.accessToken);
      localStorage.setItem(TOKEN_KEY, authData.accessToken);
      localStorage.setItem(REFRESH_KEY, authData.refreshToken);

      const userProfile: User = {
        id: authData.userId,
        email: authData.email,
        firstName: authData.email.split('@')[0],
        lastName: '',
        roles: authData.roles,
      };

      setUser(userProfile);
      localStorage.setItem(USER_KEY, JSON.stringify(userProfile));

      // Attempt to load full user details in background
      try {
        const fullProfile = await authApi.getProfile();
        setUser(fullProfile);
        localStorage.setItem(USER_KEY, JSON.stringify(fullProfile));
      } catch (profileErr) {
        // Fallback to basic profile from login response
        console.warn('Could not fetch full profile, using basic claims:', profileErr);
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
