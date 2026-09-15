import React, { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Role } from '../../types';
import { ShieldAlert } from 'lucide-react';

interface ProtectedRouteProps {
  children?: ReactNode;
  requiredRoles?: Role[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRoles }) => {
  const { isAuthenticated, loading, user, hasRole, isAdmin } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-10 h-10 border-4 border-teal-500/20 border-t-teal-500 rounded-full animate-spin"></div>
          <p className="text-sm text-slate-400 font-medium">Authenticating OpsFlow session...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check RBAC permissions if roles are required
  if (requiredRoles && requiredRoles.length > 0) {
    const hasAnyRole = isAdmin || requiredRoles.some((role) => hasRole(role));
    if (!hasAnyRole) {
      return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-slate-900 border border-rose-500/30 rounded-2xl p-8 text-center space-y-4 shadow-2xl">
            <div className="w-14 h-14 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-full flex items-center justify-center mx-auto">
              <ShieldAlert className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-white">Access Denied</h2>
            <p className="text-sm text-slate-400">
              Your account (<span className="text-slate-200">{user?.email}</span>) does not hold the required permissions ({requiredRoles.join(', ')}) to access this view.
            </p>
            <div className="pt-2">
              <a
                href="/dashboard"
                className="inline-flex items-center justify-center px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-sm font-medium transition"
              >
                Return to Command Deck
              </a>
            </div>
          </div>
        </div>
      );
    }
  }

  return children ? <>{children}</> : null;
};

export default ProtectedRoute;
