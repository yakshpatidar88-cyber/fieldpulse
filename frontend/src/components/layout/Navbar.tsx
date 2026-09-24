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
  Sun,
  Moon,
  Search,
  Command,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useWebSocket } from '../../context/WebSocketContext';
import { useTheme } from '../../context/ThemeContext';
import { Badge } from '../ui/Badge';
import { NotificationSeverity } from '../../types/notification';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { isConnected, notifications, unreadCount, acknowledgeAlert } =
    useWebSocket();
  const [showDropdown, setShowDropdown] = useState(false);

  const getRoleBadgeVariant = (role?: string) => {
    switch (role) {
      case 'ROLE_ADMIN':
        return 'danger';
      case 'ROLE_DISPATCHER':
        return 'success';
      case 'ROLE_TECHNICIAN':
        return 'info';
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
        return <Info className="w-4 h-4 text-sage-300 shrink-0 mt-0.5" />;
    }
  };

  const primaryRole = user?.role || (user?.roles && user.roles[0]);
  const displayName = user?.fullName || (user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : 'Operator');

  return (
    <header className="h-14 border-b border-pine-600 bg-pine-900/90 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between shrink-0 relative z-30 transition-all duration-80">
      {/* Left Breadcrumb & Hub */}
      <div className="flex items-center space-x-2.5">
        <span className="text-xs text-slate-400 font-medium hidden sm:inline">Hub:</span>
        <span className="text-xs font-semibold text-slate-200 bg-pine-800 px-2 py-0.5 rounded-md border border-pine-600 font-mono">
          Chicago Loop [ORD-01]
        </span>

        {/* Live WebSocket Status Pill */}
        <div
          title={isConnected ? 'STOMP Broker Online (14ms)' : 'Connecting to STOMP Broker...'}
          className={`flex items-center space-x-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono border ${
            isConnected
              ? 'bg-sage-300/10 text-sage-300 border-sage-300/30 shadow-tactical-glow'
              : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
          }`}
        >
          {isConnected ? (
            <>
              <span className="w-1.5 h-1.5 rounded-full bg-sage-300 animate-pulse" />
              <span className="font-bold">LIVE WS</span>
            </>
          ) : (
            <>
              <WifiOff className="w-3 h-3 text-amber-400" />
              <span>OFFLINE</span>
            </>
          )}
        </div>
      </div>

      {/* Center ⌘K Command Palette Trigger */}
      <div className="hidden md:flex items-center">
        <button
          type="button"
          onClick={() => {
            const query = prompt('Quick Command Palette: Search ticket, technician, or inventory part:');
            if (query) alert(`Searching for "${query}" across operations...`);
          }}
          className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-pine-800/80 border border-pine-600 hover:border-sage-300/40 text-xs text-slate-400 hover:text-slate-200 w-64 justify-between transition-all duration-80 cursor-pointer"
        >
          <div className="flex items-center space-x-2">
            <Search className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-[11px]">Command search...</span>
          </div>
          <div className="flex items-center space-x-0.5 text-[10px] font-mono px-1.5 py-0.2 rounded bg-pine-700 border border-pine-600 text-slate-300">
            <Command className="w-2.5 h-2.5" />
            <span>K</span>
          </div>
        </button>
      </div>

      {/* Right Controls */}
      <div className="flex items-center space-x-2 sm:space-x-3">
        {/* Theme Toggle Button */}
        <button
          type="button"
          onClick={toggleTheme}
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-pine-800 border border-pine-600 transition-all duration-80"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-300" />}
        </button>

        {/* Notifications Popover */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowDropdown(!showDropdown)}
            title="Operational Alerts"
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-pine-800 border border-pine-600 relative transition-all duration-80"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-tactical-amber text-obsidian rounded-full text-[9px] font-bold flex items-center justify-center shadow-xs">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {showDropdown && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-pine-900 border border-pine-600 shadow-2xl p-4 z-50 animate-in fade-in duration-80 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-pine-600">
                <span className="text-xs font-bold text-white tracking-wide">
                  Operational Alerts
                </span>
                <span className="text-[10px] font-mono text-sage-300">
                  {unreadCount} unacknowledged
                </span>
              </div>

              <div className="max-h-80 overflow-y-auto space-y-2 pr-1">
                {notifications.length === 0 ? (
                  <p className="text-xs text-slate-400 text-center py-6">
                    No active operational alerts.
                  </p>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      className={`p-2.5 rounded-xl border text-xs space-y-1 transition-all ${
                        n.acknowledged
                          ? 'bg-pine-800/40 border-pine-700 text-slate-400'
                          : 'bg-pine-800 border-pine-600 text-slate-200'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-start space-x-2">
                          {getSeverityIcon(n.severity)}
                          <div>
                            <span className="font-semibold text-white block">
                              {n.title}
                            </span>
                            <span className="text-[10px] text-slate-400">
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
                            className="p-1 rounded hover:bg-pine-700 text-slate-400 hover:text-sage-300 transition-colors"
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

        <div className="h-4 w-[1px] bg-pine-600" />

        {/* User Card */}
        <div className="flex items-center space-x-2.5">
          <div className="w-7 h-7 rounded-xl bg-sage-300/15 border border-sage-300/30 flex items-center justify-center text-sage-300 font-bold text-xs shadow-tactical-glow">
            <UserIcon className="w-3.5 h-3.5" />
          </div>
          <div className="text-left hidden sm:block">
            <div className="flex items-center space-x-1.5">
              <span className="text-xs font-bold text-white">
                {displayName}
              </span>
              <Badge variant={getRoleBadgeVariant(primaryRole)} size="sm">
                <Shield className="w-2.5 h-2.5 mr-1 inline" />
                {formatRoleName(primaryRole)}
              </Badge>
            </div>
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={logout}
          title="Sign Out"
          className="p-1.5 text-slate-400 hover:text-tactical-crimson hover:bg-rose-500/10 rounded-lg transition-colors"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};

export default Navbar;
