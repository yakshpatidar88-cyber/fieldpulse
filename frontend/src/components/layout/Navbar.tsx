import React, { useState } from 'react';
import {
  Bell,
  LogOut,
  User as UserIcon,
  Shield,
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
        return <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />;
      case 'WARNING':
        return <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />;
      default:
        return <Info className="w-4 h-4 text-emerald-600 dark:text-sage-300 shrink-0 mt-0.5" />;
    }
  };

  const primaryRole = user?.role || (user?.roles && user.roles[0]);
  const displayName = user?.fullName || (user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : 'Operator');

  const handleOpenSpotlight = () => {
    window.dispatchEvent(new CustomEvent('open-command-palette'));
  };

  return (
    <header className="h-14 border-b border-slate-200 dark:border-[#22353A] bg-white/95 dark:bg-[#131D21]/90 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between shrink-0 relative z-30 transition-all duration-80">
      {/* Left Breadcrumb & Hub */}
      <div className="flex items-center space-x-2.5">
        <span className="text-xs text-slate-500 dark:text-slate-400 font-medium hidden sm:inline">Hub:</span>
        <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-[#1A262B] px-2 py-0.5 rounded-md border border-slate-200 dark:border-[#22353A] font-mono">
          Chicago Loop [ORD-01]
        </span>

        {/* Live WebSocket Status Pill */}
        <div
          title={isConnected ? 'STOMP Broker Online (14ms)' : 'Connecting to STOMP Broker...'}
          className={`flex items-center space-x-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono border ${
            isConnected
              ? 'bg-emerald-50 dark:bg-sage-300/10 text-emerald-800 dark:text-sage-300 border-emerald-200 dark:border-sage-300/30'
              : 'bg-amber-50 dark:bg-amber-500/10 text-amber-800 dark:text-amber-400 border-amber-200 dark:border-amber-500/30'
          }`}
        >
          {isConnected ? (
            <>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 dark:bg-sage-300 animate-pulse" />
              <span className="font-bold">LIVE WS</span>
            </>
          ) : (
            <>
              <WifiOff className="w-3 h-3 text-amber-500" />
              <span>OFFLINE</span>
            </>
          )}
        </div>
      </div>

      {/* Center ⌘K Command Palette Trigger */}
      <div className="hidden md:flex items-center">
        <button
          type="button"
          onClick={handleOpenSpotlight}
          className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200/70 dark:bg-[#1A262B] dark:hover:bg-[#22353A] border border-slate-200 dark:border-[#22353A] text-xs text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 w-64 justify-between transition-all duration-80 cursor-pointer shadow-xs"
        >
          <div className="flex items-center space-x-2">
            <Search className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-[11px] font-medium">Command search...</span>
          </div>
          <div className="flex items-center space-x-0.5 text-[10px] font-mono px-1.5 py-0.5 rounded bg-white dark:bg-[#0C1215] border border-slate-200 dark:border-[#22353A] text-slate-600 dark:text-slate-400 shadow-2xs">
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
          className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white bg-slate-100 hover:bg-slate-200 dark:bg-[#1A262B] dark:hover:bg-[#22353A] border border-slate-200 dark:border-[#22353A] transition-all duration-80"
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4 text-slate-700" />
          )}
        </button>

        {/* Notifications Popover */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowDropdown(!showDropdown)}
            title="Operational Alerts"
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white bg-slate-100 hover:bg-slate-200 dark:bg-[#1A262B] dark:hover:bg-[#22353A] border border-slate-200 dark:border-[#22353A] relative transition-all duration-80"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 text-white rounded-full text-[9px] font-bold flex items-center justify-center shadow-xs">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {showDropdown && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white dark:bg-[#131D21] border border-slate-200 dark:border-[#22353A] shadow-2xl p-4 z-50 animate-in fade-in duration-80 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-[#22353A]">
                <span className="text-xs font-bold text-slate-900 dark:text-white tracking-wide">
                  Operational Alerts
                </span>
                <span className="text-[10px] font-mono text-emerald-700 dark:text-sage-300 font-bold">
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
                          ? 'bg-slate-50 dark:bg-[#18252a]/50 border-slate-200 dark:border-[#22353A] text-slate-500 dark:text-slate-400'
                          : 'bg-slate-50 dark:bg-[#1A262B] border-slate-200 dark:border-[#22353A] text-slate-800 dark:text-slate-200 shadow-xs'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-start space-x-2">
                          {getSeverityIcon(n.severity)}
                          <div>
                            <span className="font-semibold text-slate-900 dark:text-white block">
                              {n.title}
                            </span>
                            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
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
                            className="p-1 rounded hover:bg-slate-200 dark:hover:bg-[#22353A] text-slate-500 hover:text-emerald-700 dark:hover:text-sage-300 transition-colors"
                          >
                            <CheckCheck className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                      <p className="text-[11px] leading-relaxed text-slate-600 dark:text-slate-400 pl-6">
                        {n.message}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        <div className="h-4 w-[1px] bg-slate-200 dark:bg-[#22353A]" />

        {/* User Card */}
        <div className="flex items-center space-x-2.5">
          <div className="w-7 h-7 rounded-xl bg-emerald-100 dark:bg-sage-300/15 border border-emerald-200 dark:border-sage-300/30 flex items-center justify-center text-emerald-800 dark:text-sage-300 font-bold text-xs shadow-xs">
            <UserIcon className="w-3.5 h-3.5" />
          </div>
          <div className="text-left hidden sm:block">
            <div className="flex items-center space-x-1.5">
              <span className="text-xs font-bold text-slate-900 dark:text-white">
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
          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-lg transition-colors"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};

export default Navbar;
