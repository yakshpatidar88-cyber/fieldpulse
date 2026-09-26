import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { CommandPalette } from '../common/CommandPalette';
import { useWebSocket } from '../../context/WebSocketContext';
import { AlertCircle, AlertTriangle, X } from 'lucide-react';

export const AppLayout: React.FC = () => {
  const { latestAlert, dismissBanner, acknowledgeAlert } = useWebSocket();
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  useEffect(() => {
    const handleOpen = () => setIsCommandPaletteOpen(true);
    window.addEventListener('open-command-palette', handleOpen);
    return () => window.removeEventListener('open-command-palette', handleOpen);
  }, []);

  return (
    <div className="flex h-screen bg-[#F8FAFB] text-slate-900 dark:bg-[#0C1215] dark:text-slate-100 overflow-hidden">
      {/* Tactical Expandable Sidebar Rail */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Navbar />

        {/* Real-time Inbound Alert Toast Banner */}
        {latestAlert && !latestAlert.acknowledged && (
          <div
            className={`px-6 py-2.5 flex items-center justify-between text-xs border-b animate-in fade-in duration-80 ${
              latestAlert.severity === 'CRITICAL'
                ? 'bg-rose-50 border-rose-200 text-rose-900 dark:bg-rose-950/80 dark:border-rose-800 dark:text-rose-200'
                : 'bg-amber-50 border-amber-200 text-amber-900 dark:bg-amber-950/80 dark:border-amber-800 dark:text-amber-200'
            }`}
          >
            <div className="flex items-center space-x-2.5">
              {latestAlert.severity === 'CRITICAL' ? (
                <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
              )}
              <span>
                <strong>{latestAlert.title}</strong> &mdash; {latestAlert.message}
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => acknowledgeAlert(latestAlert.id)}
                className="px-2 py-0.5 rounded text-[11px] font-medium bg-white/70 hover:bg-white dark:bg-white/10 dark:hover:bg-white/20 border border-slate-300 dark:border-transparent text-slate-800 dark:text-white transition-colors"
              >
                Acknowledge
              </button>
              <button
                type="button"
                onClick={dismissBanner}
                className="p-1 rounded hover:bg-black/5 dark:hover:bg-white/10 text-slate-500 dark:text-white/70 hover:text-slate-800 dark:hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#F8FAFB] dark:bg-[#0C1215]">
          <Outlet />
        </main>
      </div>

      {/* Global Command Palette (⌘K / Ctrl+K) */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
      />
    </div>
  );
};

export default AppLayout;
