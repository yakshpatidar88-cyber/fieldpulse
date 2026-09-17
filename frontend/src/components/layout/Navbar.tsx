import React, { useState } from 'react';
import {
  Bell,
  LogOut,
  User as UserIcon,
  Shield,
  Wifi,
  WifiOff,
  CheckCheck,
  AlertTriangle,
  AlertCircle,
  Info,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useWebSocket } from '../../context/WebSocketContext';
import { Badge } from '../ui/Badge';
import { NotificationSeverity } from '../../types/notification';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const { isConnected, notifications, unreadCount, acknowledgeAlert } =
    useWebSocket();
  const [showDropdown, setShowDropdown] = useState(false);

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

  const getSeverityIcon = (severity: NotificationSeverity) => {
    switch (severity) {
      case 'CRITICAL':
        return <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />;
      case 'WARNING':
        return <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />;
      default:
        return <Info className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />;
    }
  };

  return (
    <header className="h-16 border-b border-slate-800/80 bg-slate-900/60 backdrop-blur px-6 flex items-center justify-between shrink-0 relative z-30">
      <div className="flex items-center space-x-3">
        <span className="text-xs text-slate-400 font-medium">Workspace:</span>
        <span className="text-xs font-semibold text-slate-200 bg-slate-800/80 px-2.5 py-1 rounded-md border border-slate-700/60">
          Central Dispatch Hub (North America)
        </span>

        {/* Live WebSocket Status Pill */}
        <div
          title={
            isConnected
              ? 'Real-Time STOMP Broker Connected'
              : 'Connecting to STOMP Broker...'
          }
          className={`flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-mono border ${
            isConnected
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
              : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
          }`}
        >
          {isConnected ? (
            <>
              <Wifi className="w-3 h-3" />
              <span>LIVE WS</span>
            </>
          ) : (
            <>
              <WifiOff className="w-3 h-3" />
              <span>OFFLINE</span>
            </>
          )}
        </div>
      </div>

      <div className="flex items-center space-x-4">
        {/* Live Notification Indicator & Dropdown */}
        <div className="relative">
          <button
            type="button"
            aria-label="Notifications"
            onClick={() => setShowDropdown(!showDropdown)}
            className="relative p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 transition-colors"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <>
                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-rose-500 text-[10px] font-bold text-white flex items-center justify-center border-2 border-slate-950">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              </>
            )}
          </button>

          {/* Notifications Dropdown Panel */}
          {showDropdown && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-xl bg-slate-900 border border-slate-800 shadow-2xl p-3 space-y-2 z-50">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="text-xs font-semibold text-white">
                  Operational Alerts
                </span>
                <span className="text-[11px] font-mono text-slate-400">
                  {unreadCount} unacknowledged
                </span>
              </div>

              <div className="max-h-80 overflow-y-auto space-y-2 pr-1">
                {notifications.length === 0 ? (
                  <p className="text-xs text-slate-500 text-center py-6">
                    No active operational alerts.
                  </p>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      className={`p-2.5 rounded-lg border text-xs space-y-1 transition-colors ${
                        n.acknowledged
                          ? 'bg-slate-950/40 border-slate-800/50 text-slate-500'
                          : 'bg-slate-800/70 border-slate-700 text-slate-300'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-start space-x-2">
                          {getSeverityIcon(n.severity)}
                          <div>
                            <span className="font-semibold text-slate-200 block">
                              {n.title}
                            </span>
                            <span className="text-[11px] text-slate-400">
                              Job #{n.jobNumber} &bull;{' '}
                              {new Date(n.createdAt).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                          </div>
                        </div>

                        {!n.acknowledged && (
                          <button
                            type="button"
                            title="Acknowledge Alert"
                            onClick={() => acknowledgeAlert(n.id)}
                            className="p-1 rounded hover:bg-slate-700 text-slate-400 hover:text-emerald-400 transition-colors"
                          >
                            <CheckCheck className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                      <p className="text-[11px] leading-relaxed text-slate-400 pl-6">
                        {n.message}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        <div className="h-5 w-[1px] bg-slate-800" />

        {/* User Card */}
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full bg-teal-500/20 border border-teal-500/30 flex items-center justify-center text-teal-300">
            <UserIcon className="w-4 h-4" />
          </div>
          <div className="text-left hidden sm:block">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-slate-200">
                {user?.fullName || 'Operator'}
              </span>
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
