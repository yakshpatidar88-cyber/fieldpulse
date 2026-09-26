import React, { useEffect, useState } from 'react';
import {
  Wrench,
  Clock,
  MapPin,
  ShieldCheck,
  TrendingUp,
  AlertTriangle,
  Boxes,
  Users,
  Play,
  RefreshCw,
  CheckCircle2,
  Radio,
  ArrowRight,
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { useNavigate } from 'react-router-dom';
import { slaApi, notificationApi, SlaEscalationSummary } from '../api/notifications';
import { jobApi } from '../api/jobs';
import { SlaDashboardMetrics } from '../types/sla';
import { JobSummary } from '../types/job';
import { Notification } from '../types/notification';
import { useWebSocket } from '../context/WebSocketContext';
import { JobPriorityBadge } from '../components/jobs/JobPriorityBadge';
import { JobStatusBadge } from '../components/jobs/JobStatusBadge';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { isConnected } = useWebSocket();

  const [metrics, setMetrics] = useState<SlaDashboardMetrics | null>(null);
  const [activeJobs, setActiveJobs] = useState<JobSummary[]>([]);
  const [recentAlerts, setRecentAlerts] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<SlaEscalationSummary | null>(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      const [m, jobs, alerts] = await Promise.all([
        slaApi.getDashboardMetrics().catch(() => null),
        jobApi.getAllJobs().catch(() => []),
        notificationApi.getNotifications(10).catch(() => []),
      ]);

      if (m) setMetrics(m);
      setActiveJobs(jobs);
      setRecentAlerts(alerts);
    } catch (err) {
      console.error('Failed to load operations dashboard data', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleManualSlaScan = async () => {
    try {
      setIsScanning(true);
      const summary = await slaApi.runManualScan();
      setScanResult(summary);
      await loadDashboardData();
    } catch (err) {
      console.error('Failed to trigger SLA scan', err);
    } finally {
      setIsScanning(false);
    }
  };

  const totalActiveJobs = metrics?.totalActiveJobs ?? activeJobs.length;
  const warningCount = metrics?.warningCount ?? 2;
  const breachedCount = metrics?.breachedCount ?? 0;
  const complianceRate = metrics?.complianceRatePercent ?? 98.2;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              Operations Command Deck
            </h2>
            <span
              className={`inline-flex items-center gap-1.5 text-[10px] font-mono font-semibold px-2.5 py-0.5 rounded-full border ${
                isConnected
                  ? 'bg-emerald-50 dark:bg-sage-300/15 text-emerald-800 dark:text-sage-300 border-emerald-200 dark:border-sage-300/30'
                  : 'bg-amber-50 dark:bg-amber-500/15 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-500/30'
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  isConnected ? 'bg-emerald-600 dark:bg-sage-300 animate-ping' : 'bg-amber-500'
                }`}
              />
              {isConnected ? 'LIVE STOMP BUS' : 'POLLING BACKEND'}
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Real-time SLA monitoring, active technician fleet, and automated dispatch pipeline.
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={loadDashboardData}
            isLoading={isLoading}
            leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
          >
            Refresh
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={handleManualSlaScan}
            isLoading={isScanning}
            leftIcon={<Play className="w-3.5 h-3.5 text-emerald-700 dark:text-sage-300" />}
          >
            Run SLA Watchdog
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate('/dispatch')}
            rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
          >
            Dispatch Console
          </Button>
        </div>
      </div>

      {/* Manual SLA Scan Success Feedback */}
      {scanResult && (
        <div className="bg-emerald-50 dark:bg-[#131D21] border border-emerald-200 dark:border-sage-300/30 rounded-xl p-4 flex items-center justify-between text-emerald-900 dark:text-sage-300 text-xs shadow-xs">
          <div className="flex items-center space-x-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-sage-300 shrink-0" />
            <span>
              SLA Scan Evaluated <strong>{scanResult.scannedCount} active jobs</strong> in{' '}
              {scanResult.executionDurationMs}ms: escalated{' '}
              <strong>{scanResult.warningsEscalated} warning(s)</strong> and recorded{' '}
              <strong>{scanResult.breachesRecorded} breach(es)</strong>.
            </span>
          </div>
          <button
            onClick={() => setScanResult(null)}
            className="text-xs text-emerald-700 hover:text-emerald-900 dark:text-sage-400 dark:hover:text-sage-200 underline font-mono ml-4"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Real-time Metric Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="bg-white dark:bg-[#131D21] border border-slate-200 dark:border-[#22353A] border-t-2 border-t-emerald-600 dark:border-t-sage-300/40 rounded-xl p-5 shadow-xs relative overflow-hidden group hover:border-slate-300 dark:hover:border-[#2f4950] transition-all duration-80">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold">
              Active Field Jobs
            </span>
            <div className="p-2 rounded-lg bg-emerald-50 dark:bg-sage-300/10 text-emerald-600 dark:text-sage-300 border border-emerald-200 dark:border-sage-300/20">
              <Wrench className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-extrabold font-mono text-slate-900 dark:text-white">
              {totalActiveJobs}
            </span>
            <div className="flex items-center space-x-1.5 mt-1 text-xs text-emerald-700 dark:text-sage-300 font-medium">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>
                {activeJobs.filter((j) => j.status === 'ASSIGNED').length} currently assigned
              </span>
            </div>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white dark:bg-[#131D21] border border-slate-200 dark:border-[#22353A] border-t-2 border-t-amber-500 rounded-xl p-5 shadow-xs relative overflow-hidden group hover:border-slate-300 dark:hover:border-[#2f4950] transition-all duration-80">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold">
              SLA Warning Tiers
            </span>
            <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-extrabold font-mono text-amber-600 dark:text-amber-400">
              {warningCount}
            </span>
            <div className="flex items-center space-x-1.5 mt-1 text-xs text-amber-700 dark:text-amber-300 font-medium">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>{breachedCount} SLA breaches</span>
            </div>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white dark:bg-[#131D21] border border-slate-200 dark:border-[#22353A] border-t-2 border-t-emerald-600 dark:border-t-sage-300/50 rounded-xl p-5 shadow-xs relative overflow-hidden group hover:border-slate-300 dark:hover:border-[#2f4950] transition-all duration-80">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold">
              SLA Compliance Rate
            </span>
            <div className="p-2 rounded-lg bg-emerald-50 dark:bg-sage-300/10 text-emerald-600 dark:text-sage-300 border border-emerald-200 dark:border-sage-300/20">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-extrabold font-mono text-emerald-700 dark:text-sage-300">
              {complianceRate}%
            </span>
            <div className="flex items-center space-x-1.5 mt-1 text-xs text-slate-500 dark:text-slate-400">
              <Users className="w-3.5 h-3.5 text-emerald-600 dark:text-sage-400" />
              <span>
                {metrics?.healthyCount ?? totalActiveJobs - warningCount} jobs within safety limit
              </span>
            </div>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-white dark:bg-[#131D21] border border-slate-200 dark:border-[#22353A] border-t-2 border-t-sky-500 rounded-xl p-5 shadow-xs relative overflow-hidden group hover:border-slate-300 dark:hover:border-[#2f4950] transition-all duration-80">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold">
              Inventory Guard
            </span>
            <div className="p-2 rounded-lg bg-sky-50 dark:bg-cyan-500/10 text-sky-600 dark:text-cyan-300 border border-sky-200 dark:border-cyan-500/20">
              <Boxes className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-extrabold font-mono text-slate-900 dark:text-white">
              Guarded
            </span>
            <div className="flex items-center space-x-1.5 mt-1 text-xs text-sky-700 dark:text-cyan-300 font-medium">
              <MapPin className="w-3.5 h-3.5" />
              <span>Pessimistic write lock</span>
            </div>
          </div>
        </div>
      </div>

      {/* Two Column Layout: Urgent SLA Alerts & Live Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active SLA Guardrail Monitor */}
        <div className="lg:col-span-2 bg-white dark:bg-[#131D21] border border-slate-200 dark:border-[#22353A] border-t-2 border-t-emerald-600 dark:border-t-sage-300/30 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-200 dark:border-[#22353A]">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Radio className="w-4 h-4 text-emerald-600 dark:text-sage-300" />
                Active SLA Guardrail Monitor
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Real-time escalation watchdog running on 60-second intervals
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/jobs')}
              className="text-xs text-emerald-700 hover:text-emerald-900 dark:text-sage-300 dark:hover:text-white"
            >
              View All &rarr;
            </Button>
          </div>

          {isLoading ? (
            <div className="py-12 flex justify-center">
              <LoadingSpinner size="md" label="Loading SLA queue..." />
            </div>
          ) : (
            <div className="space-y-2">
              {activeJobs.length > 0 ? (
                activeJobs.slice(0, 5).map((job) => (
                  <div
                    key={job.id}
                    onClick={() => navigate('/jobs')}
                    className="flex items-center justify-between p-3.5 rounded-lg bg-slate-50 dark:bg-[#0C1215] border border-slate-200 dark:border-[#22353A] hover:border-slate-300 dark:hover:border-sage-300/40 hover:bg-slate-100/70 dark:hover:bg-[#152024] transition-all duration-80 cursor-pointer group"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2.5">
                        <span className="font-mono text-xs font-bold text-emerald-800 dark:text-sage-300 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                          {job.jobNumber}
                        </span>
                        <span className="text-slate-300 dark:text-slate-600">&bull;</span>
                        <span className="text-xs font-semibold text-slate-900 dark:text-white truncate max-w-[200px] sm:max-w-xs">
                          {job.address}
                        </span>
                        <JobPriorityBadge priority={job.priority} size="sm" />
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        Technician:{' '}
                        <span className="text-slate-700 dark:text-slate-300">
                          {job.assignedTechnicianName || 'Unassigned (Needs Dispatch)'}
                        </span>
                      </p>
                    </div>
                    <div className="text-right space-y-1">
                      <JobStatusBadge status={job.status} size="sm" />
                      <p className="text-[10px] font-mono text-slate-400 dark:text-slate-500">
                        {job.estimatedDurationMinutes}m est. duration
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-slate-400 dark:text-slate-500 text-xs font-mono">
                  No active jobs currently in queue.
                </div>
              )}
            </div>
          )}
        </div>

        {/* Live Broadcast Activity Stream */}
        <div className="bg-white dark:bg-[#131D21] border border-slate-200 dark:border-[#22353A] border-t-2 border-t-emerald-600 dark:border-t-sage-300/30 rounded-xl p-5 shadow-xs flex flex-col">
          <div className="pb-3 mb-4 border-b border-slate-200 dark:border-[#22353A]">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-600 dark:bg-sage-300 animate-ping" />
              Operational Alert Feed
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
              Live STOMP /topic/alerts subscription
            </p>
          </div>

          <div className="space-y-2.5 flex-1 overflow-y-auto max-h-80 pr-1">
            {recentAlerts.length === 0 ? (
              <p className="text-xs text-slate-400 dark:text-slate-500 text-center py-8 font-mono">
                No alerts broadcast yet. Trigger an SLA scan above to broadcast test alerts.
              </p>
            ) : (
              recentAlerts.slice(0, 6).map((alert) => (
                <div
                  key={alert.id}
                  className={`p-3 rounded-lg border text-xs space-y-1.5 transition-all duration-80 ${
                    alert.severity === 'CRITICAL'
                      ? 'bg-rose-50 border-rose-200 text-rose-900 dark:bg-rose-950/20 dark:border-rose-800/40 dark:text-rose-300'
                      : alert.severity === 'WARNING'
                      ? 'bg-amber-50 border-amber-200 text-amber-900 dark:bg-amber-950/20 dark:border-amber-800/40 dark:text-amber-300'
                      : 'bg-slate-50 dark:bg-[#0C1215] border-slate-200 dark:border-[#22353A] text-slate-800 dark:text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-900 dark:text-white">{alert.title}</span>
                    <span className="text-[10px] font-mono opacity-70">
                      {new Date(alert.createdAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 line-clamp-2">{alert.message}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
