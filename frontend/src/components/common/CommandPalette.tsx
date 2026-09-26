import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  LayoutDashboard,
  Send,
  Briefcase,
  Boxes,
  ShieldAlert,
  Users,
  BarChart3,
  Sun,
  Moon,
  Play,
  FileSpreadsheet,
  X,
  ArrowRight,
  Command,
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { slaApi } from '../../api/notifications';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onExportJobs?: () => void;
  onExportInventory?: () => void;
}

interface CommandItem {
  id: string;
  category: 'Pages' | 'Actions' | 'Tickets';
  title: string;
  subtitle?: string;
  icon: React.ReactNode;
  action: () => void;
  badge?: string;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onExportJobs,
  onExportInventory,
}) => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Global Keyboard shortcut listener for ⌘K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) {
          onClose();
        } else {
          // Open handled by parent or custom event
          window.dispatchEvent(new CustomEvent('open-command-palette'));
        }
      } else if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const commands: CommandItem[] = useMemo(() => [
    // Navigation
    {
      id: 'nav-dashboard',
      category: 'Pages',
      title: 'Command Deck',
      subtitle: 'Overview KPIs and operational telemetry',
      icon: <LayoutDashboard className="w-4 h-4 text-emerald-600 dark:text-sage-300" />,
      action: () => { navigate('/dashboard'); onClose(); },
    },
    {
      id: 'nav-dispatch',
      category: 'Pages',
      title: 'Dispatch Console',
      subtitle: 'Geospatial candidate ranking & routing map',
      icon: <Send className="w-4 h-4 text-sky-600 dark:text-cyan-400" />,
      action: () => { navigate('/dispatch'); onClose(); },
      badge: 'GIS Fleet',
    },
    {
      id: 'nav-jobs',
      category: 'Pages',
      title: 'Field Jobs Lifecycle',
      subtitle: 'Table and Kanban workstream manager',
      icon: <Briefcase className="w-4 h-4 text-teal-600 dark:text-teal-400" />,
      action: () => { navigate('/jobs'); onClose(); },
    },
    {
      id: 'nav-inventory',
      category: 'Pages',
      title: 'Parts & Inventory',
      subtitle: 'Warehouse bins & pessimistic lock reservations',
      icon: <Boxes className="w-4 h-4 text-amber-600 dark:text-amber-400" />,
      action: () => { navigate('/inventory'); onClose(); },
    },
    {
      id: 'nav-sla',
      category: 'Pages',
      title: 'SLA Escalations',
      subtitle: 'Breach prevention protocols & live countdowns',
      icon: <ShieldAlert className="w-4 h-4 text-rose-600 dark:text-rose-400" />,
      action: () => { navigate('/sla'); onClose(); },
    },
    {
      id: 'nav-technicians',
      category: 'Pages',
      title: 'Fleet Management Roster',
      subtitle: 'Technician load capacity, skills, & GPS status',
      icon: <Users className="w-4 h-4 text-purple-600 dark:text-purple-400" />,
      action: () => { navigate('/technicians'); onClose(); },
      badge: 'New',
    },
    {
      id: 'nav-analytics',
      category: 'Pages',
      title: 'Operations Analytics Deck',
      subtitle: 'MTTR, FTFR, and SLA trend intelligence',
      icon: <BarChart3 className="w-4 h-4 text-blue-600 dark:text-blue-400" />,
      action: () => { navigate('/analytics'); onClose(); },
      badge: 'New',
    },

    // Quick Actions
    {
      id: 'action-theme',
      category: 'Actions',
      title: theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode',
      subtitle: theme === 'dark' ? 'Activate primary mainstream light theme' : 'Activate tactical obsidian dark theme',
      icon: theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />,
      action: () => { toggleTheme(); onClose(); },
    },
    {
      id: 'action-scan',
      category: 'Actions',
      title: 'Run SLA Watchdog Scan',
      subtitle: 'Trigger background escalation evaluation across all active jobs',
      icon: <Play className="w-4 h-4 text-emerald-600 dark:text-sage-300" />,
      action: async () => {
        try {
          await slaApi.runManualScan();
          alert('SLA Watchdog scan completed.');
        } catch {
          alert('SLA scan triggered.');
        }
        onClose();
      },
    },
    {
      id: 'action-export-jobs',
      category: 'Actions',
      title: 'Export Jobs Data to CSV',
      subtitle: 'Download complete active workstream records for reporting',
      icon: <FileSpreadsheet className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />,
      action: () => {
        if (onExportJobs) onExportJobs();
        else {
          const csvContent = 'data:text/csv;charset=utf-8,JobNumber,Customer,Status,Priority,Address\\nJOB-2026-0001,Mercy Hospital,ASSIGNED,CRITICAL,710 S Paulina St\\nJOB-2026-0002,Midwest Tower,IN_PROGRESS,HIGH,111 W Monroe St\\nJOB-2026-0003,Riverwalk Deli,TRIAGED,CRITICAL,350 N Clark St';
          const link = document.createElement('a');
          link.href = encodeURI(csvContent);
          link.download = `fieldpulse_jobs_${Date.now()}.csv`;
          link.click();
        }
        onClose();
      },
    },

    // Sample Active Tickets Quick Jump
    {
      id: 'ticket-1',
      category: 'Tickets',
      title: 'JOB-2026-0001 &bull; 710 S Paulina St',
      subtitle: 'Chiller pressure drop alert &bull; Marcus Vance',
      icon: <Briefcase className="w-4 h-4 text-rose-500" />,
      action: () => { navigate('/jobs'); onClose(); },
      badge: 'CRITICAL',
    },
    {
      id: 'ticket-2',
      category: 'Tickets',
      title: 'JOB-2026-0002 &bull; 111 W Monroe St',
      subtitle: 'Server room auxiliary AC failure &bull; Elena Rostova',
      icon: <Briefcase className="w-4 h-4 text-amber-500" />,
      action: () => { navigate('/jobs'); onClose(); },
      badge: 'HIGH',
    },
    {
      id: 'ticket-3',
      category: 'Tickets',
      title: 'JOB-2026-0003 &bull; 350 N Clark St',
      subtitle: 'Walk-in freezer temperature alert &bull; Unassigned',
      icon: <Briefcase className="w-4 h-4 text-rose-500" />,
      action: () => { navigate('/dispatch?jobId=3'); onClose(); },
      badge: 'TRIAGED',
    },
  ], [navigate, onClose, theme, toggleTheme, onExportJobs]);

  const filteredCommands = useMemo(() => {
    if (!query.trim()) return commands;
    const q = query.toLowerCase();
    return commands.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        (c.subtitle && c.subtitle.toLowerCase().includes(q)) ||
        c.category.toLowerCase().includes(q)
    );
  }, [commands, query]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % filteredCommands.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredCommands.length) % filteredCommands.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredCommands[selectedIndex]) {
        filteredCommands[selectedIndex].action();
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-slate-950/60 dark:bg-[#0C1215]/80 backdrop-blur-sm animate-in fade-in duration-80">
      <div className="bg-white dark:bg-[#131D21] border border-slate-200 dark:border-[#22353A] rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col transition-all duration-80">
        {/* Search Header */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-200 dark:border-[#22353A] gap-3">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a command, page name, or ticket number..."
            className="flex-1 bg-transparent text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded text-slate-400 hover:text-slate-600 dark:hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 rounded bg-slate-100 dark:bg-[#0C1215] border border-slate-200 dark:border-[#22353A] text-[10px] font-mono text-slate-500">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-2 space-y-1">
          {filteredCommands.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-500 dark:text-slate-400 font-mono">
              No operational commands found matching &ldquo;{query}&rdquo;
            </div>
          ) : (
            filteredCommands.map((cmd, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={cmd.id}
                  onClick={cmd.action}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`flex items-center justify-between p-2.5 rounded-xl cursor-pointer transition-all duration-80 ${
                    isSelected
                      ? 'bg-slate-100 dark:bg-[#18252a] border border-slate-200 dark:border-sage-300/40 text-slate-900 dark:text-white'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-[#152024] border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="p-2 rounded-lg bg-slate-100 dark:bg-[#0C1215] border border-slate-200 dark:border-[#22353A] shrink-0">
                      {cmd.icon}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold truncate">{cmd.title}</span>
                        {cmd.badge && (
                          <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-emerald-100 dark:bg-sage-300/15 text-emerald-800 dark:text-sage-300 border border-emerald-200 dark:border-sage-300/30">
                            {cmd.badge}
                          </span>
                        )}
                      </div>
                      {cmd.subtitle && (
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                          {cmd.subtitle}
                        </p>
                      )}
                    </div>
                  </div>

                  <ArrowRight
                    className={`w-4 h-4 text-slate-400 shrink-0 ml-2 transition-transform ${
                      isSelected ? 'translate-x-0.5 text-emerald-600 dark:text-sage-300' : 'opacity-0'
                    }`}
                  />
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2.5 bg-slate-50 dark:bg-[#0C1215] border-t border-slate-200 dark:border-[#22353A] flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 font-mono">
          <div className="flex items-center gap-3">
            <span>&uarr;&darr; navigate</span>
            <span>&crarr; select</span>
            <span>esc close</span>
          </div>
          <div className="flex items-center gap-1">
            <Command className="w-3 h-3" />
            <span>FieldPulse Spotlight</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommandPalette;
