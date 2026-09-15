import React from 'react';
import { Bell, LogOut, User as UserIcon, Shield } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Badge } from '../ui/Badge';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();

  const getRoleBadgeVariant = (role?: string) => {
    switch (role) {
      case 'ROLE_ADMIN':
        return 'danger';
      case 'ROLE_DISPATCHER':
        return 'info';
      case 'ROLE_TECHNICIAN':
        return 'success';
      default:
        return 'default';
    }
  };

  const formatRoleName = (role?: string) => {
    if (!role) return 'USER';
    return role.replace('ROLE_', '');
  };

  return (
    <header className="h-16 border-b border-slate-800/80 bg-slate-900/60 backdrop-blur px-6 flex items-center justify-between shrink-0">
      <div className="flex items-center space-x-3">
        <span className="text-xs text-slate-400 font-medium">Workspace:</span>
        <span className="text-xs font-semibold text-slate-200 bg-slate-800/80 px-2.5 py-1 rounded-md border border-slate-700/60">
          Central Dispatch Hub (North America)
        </span>
      </div>

      <div className="flex items-center space-x-4">
        {/* Live Notification Indicator */}
        <button
          type="button"
          aria-label="Notifications"
          className="relative p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 transition-colors"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-teal-400 animate-ping" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-teal-400" />
        </button>

        <div className="h-5 w-[1px] bg-slate-800" />

        {/* User Card */}
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full bg-teal-500/20 border border-teal-500/30 flex items-center justify-center text-teal-300">
            <UserIcon className="w-4 h-4" />
          </div>
          <div className="text-left hidden sm:block">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-slate-200">{user?.fullName || 'Operator'}</span>
              <Badge variant={getRoleBadgeVariant(user?.role)} size="sm">
                <Shield className="w-2.5 h-2.5 mr-1 inline" />
                {formatRoleName(user?.role)}
              </Badge>
            </div>
            <p className="text-[11px] text-slate-500">{user?.email}</p>
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={logout}
          title="Sign Out"
          className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
