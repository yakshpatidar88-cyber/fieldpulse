import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { useWebSocket } from '../../context/WebSocketContext';
import { AlertCircle, AlertTriangle, X } from 'lucide-react';

export const AppLayout: React.FC = () => {
  const { latestAlert, dismissBanner, acknowledgeAlert } = useWebSocket();

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 overflow-hidden">
      {/* Fixed Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Navbar />

        {/* Real-time Inbound Alert Toast Banner */}
        {latestAlert && !latestAlert.acknowledged && (
          <div
            className={`px-6 py-2.5 flex items-center justify-between text-xs border-b animate-in fade-in slide-in-from-top-2 duration-200 ${
              latestAlert.severity === 'CRITICAL'
                ? 'bg-rose-950/80 border-rose-800 text-rose-200'
                : 'bg-amber-950/80 border-amber-800 text-amber-200'
            }`}
          >
            <div className="flex items-center space-x-2.5">
              {latestAlert.severity === 'CRITICAL' ? (
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
              )}
              <span>
                <strong>{latestAlert.title}</strong> &mdash; {latestAlert.message}
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => acknowledgeAlert(latestAlert.id)}
                className="px-2 py-0.5 rounded text-[11px] font-medium bg-white/10 hover:bg-white/20 transition-colors"
              >
                Acknowledge
              </button>
              <button
                type="button"
                onClick={dismissBanner}
                className="p-1 rounded hover:bg-white/10 text-white/70 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        <main className="flex-1 overflow-y-auto p-6 bg-slate-950/90">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
