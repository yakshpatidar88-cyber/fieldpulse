import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  Clock,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  Download,
  Filter,
  Users,
  Award,
  Calendar,
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

interface DailyTrendPoint {
  day: string;
  completed: number;
  slaBreaches: number;
  ftfr: number;
}

const TREND_DATA: DailyTrendPoint[] = [
  { day: 'Mon', completed: 42, slaBreaches: 0, ftfr: 94 },
  { day: 'Tue', completed: 48, slaBreaches: 1, ftfr: 91 },
  { day: 'Wed', completed: 53, slaBreaches: 0, ftfr: 96 },
  { day: 'Thu', completed: 39, slaBreaches: 0, ftfr: 93 },
  { day: 'Fri', completed: 61, slaBreaches: 2, ftfr: 89 },
  { day: 'Sat', completed: 34, slaBreaches: 0, ftfr: 97 },
  { day: 'Sun', completed: 28, slaBreaches: 0, ftfr: 95 },
];

interface LeaderboardTech {
  id: number;
  name: string;
  code: string;
  completedJobs: number;
  avgResolutionTime: string;
  ftfr: number;
  satisfaction: number;
  specialty: string;
}

const LEADERBOARD: LeaderboardTech[] = [
  {
    id: 1,
    name: 'Marcus Vance',
    code: 'TECH-001',
    completedJobs: 148,
    avgResolutionTime: '1h 22m',
    ftfr: 96.5,
    satisfaction: 4.95,
    specialty: 'Chiller Specialist',
  },
  {
    id: 2,
    name: 'Elena Rostova',
    code: 'TECH-002',
    completedJobs: 132,
    avgResolutionTime: '1h 35m',
    ftfr: 94.2,
    satisfaction: 4.88,
    specialty: 'Smart Controls BACnet',
  },
  {
    id: 3,
    name: 'Devon Patel',
    code: 'TECH-004',
    completedJobs: 119,
    avgResolutionTime: '1h 41m',
    ftfr: 93.0,
    satisfaction: 4.82,
    specialty: 'Heavy Industrial HVAC',
  },
  {
    id: 4,
    name: 'Darius Thorne',
    code: 'TECH-003',
    completedJobs: 98,
    avgResolutionTime: '1h 55m',
    ftfr: 89.8,
    satisfaction: 4.79,
    specialty: 'Commercial Refrigeration',
  },
];

export const AnalyticsPage: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('7d');

  const handleExportCSV = () => {
    const header = 'Date,CompletedJobs,SlaBreaches,FTFR_Percent\n';
    const rows = TREND_DATA.map(
      (d) => `${d.day},${d.completed},${d.slaBreaches},${d.ftfr}%`
    ).join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `fieldpulse_analytics_${timeRange}_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-80">
      {/* Header Deck */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Operations Intelligence
            </h1>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-sage-300/15 text-emerald-800 dark:text-sage-300 border border-emerald-200 dark:border-sage-300/30">
              AUDITED TELEMETRY
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Real-time SLA compliance, resolution velocity, and technician efficiency benchmarks
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Time range selector */}
          <div className="flex bg-slate-100 dark:bg-[#131D21] border border-slate-200 dark:border-[#22353A] rounded-xl p-0.5 text-xs font-semibold">
            {(['7d', '30d', '90d'] as const).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setTimeRange(r)}
                className={`px-3 py-1 rounded-lg transition-all ${
                  timeRange === r
                    ? 'bg-white dark:bg-[#1E2D32] text-slate-900 dark:text-white shadow-xs font-bold'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                {r.toUpperCase()}
              </button>
            ))}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleExportCSV}
            className="flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export Analytics</span>
          </Button>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* FTFR Card */}
        <Card className="p-4 bg-white dark:bg-[#131D21] border border-slate-200 dark:border-[#22353A]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              First-Time Fix Rate
            </span>
            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-sage-300/10 text-emerald-600 dark:text-sage-300 border border-emerald-100 dark:border-sage-300/20">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <div className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              92.4%
            </div>
            <span className="inline-flex items-center text-xs font-bold text-emerald-600 dark:text-emerald-400">
              <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
              +3.2%
            </span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            Target: &gt;90.0% &bull; Industry benchmark 88%
          </p>
        </Card>

        {/* MTTR Card */}
        <Card className="p-4 bg-white dark:bg-[#131D21] border border-slate-200 dark:border-[#22353A]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Mean Time To Resolution
            </span>
            <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-400/10 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-400/20">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <div className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              1h 48m
            </div>
            <span className="inline-flex items-center text-xs font-bold text-emerald-600 dark:text-emerald-400">
              <ArrowDownRight className="w-3.5 h-3.5 mr-0.5" />
              -14m fast
            </span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            Target SLA: &lt;2h 15m &bull; Triage to On-Site
          </p>
        </Card>

        {/* SLA Compliance */}
        <Card className="p-4 bg-white dark:bg-[#131D21] border border-slate-200 dark:border-[#22353A]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              SLA Adherence Rate
            </span>
            <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-400/10 text-purple-600 dark:text-purple-400 border border-purple-100 dark:border-purple-400/20">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <div className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              98.2%
            </div>
            <span className="inline-flex items-center text-xs font-bold text-emerald-600 dark:text-emerald-400">
              <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
              +0.8%
            </span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            3 breaches out of 168 dispatches this cycle
          </p>
        </Card>

        {/* Total Dispatches */}
        <Card className="p-4 bg-white dark:bg-[#131D21] border border-slate-200 dark:border-[#22353A]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Dispatches Completed
            </span>
            <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-400/10 text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-400/20">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <div className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              305
            </div>
            <span className="inline-flex items-center text-xs font-bold text-emerald-600 dark:text-emerald-400">
              <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
              +18.4%
            </span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            Chicago Loop ORD-01 regional hub
          </p>
        </Card>
      </div>

      {/* Main Charts & Visualizations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 7-Day Dispatch Trend & FTFR Sparkline Chart */}
        <Card className="lg:col-span-2 p-5 bg-white dark:bg-[#131D21] border border-slate-200 dark:border-[#22353A] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                  7-Day Dispatch Volume & FTFR Consistency
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Daily resolved work orders vs First-Time Fix percentage
                </p>
              </div>
              <div className="flex items-center gap-4 text-xs font-medium">
                <span className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                  <span className="w-3 h-3 rounded-md bg-emerald-600 dark:bg-sage-300 inline-block" />
                  Dispatches
                </span>
                <span className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                  <span className="w-3 h-1 rounded bg-sky-500 inline-block" />
                  FTFR %
                </span>
              </div>
            </div>

            {/* Custom Interactive SVG Bar & Line Chart */}
            <div className="h-64 w-full pt-4">
              <div className="h-full flex items-end justify-between gap-3 px-2">
                {TREND_DATA.map((item) => {
                  const maxVal = 70;
                  const barHeightPercent = Math.round((item.completed / maxVal) * 100);

                  return (
                    <div
                      key={item.day}
                      className="flex-1 flex flex-col items-center h-full justify-end group cursor-pointer"
                    >
                      {/* Tooltip on hover */}
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity mb-2 px-2 py-1 rounded-lg bg-slate-900 text-white text-[10px] font-mono pointer-events-none whitespace-nowrap shadow-lg">
                        {item.completed} jobs &bull; {item.ftfr}% FTFR
                      </div>

                      {/* Bar */}
                      <div className="w-full max-w-[48px] bg-slate-100 dark:bg-[#0C1215] rounded-t-xl overflow-hidden flex flex-col justify-end h-44 relative">
                        <div
                          style={{ height: `${barHeightPercent}%` }}
                          className="w-full bg-emerald-700 hover:bg-emerald-600 dark:bg-[#234B34] dark:hover:bg-sage-300/80 transition-all rounded-t-lg relative"
                        >
                          {item.slaBreaches > 0 && (
                            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                          )}
                        </div>
                      </div>

                      {/* X-axis label */}
                      <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-2 font-mono">
                        {item.day}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="pt-4 mt-2 border-t border-slate-100 dark:border-[#22353A] flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Peak day: <strong>Friday (61 jobs)</strong></span>
            <span className="text-emerald-700 dark:text-sage-300 font-semibold font-mono">Zero SLA breaches on 5 of 7 days</span>
          </div>
        </Card>

        {/* SLA Breakdown by System Category */}
        <Card className="p-5 bg-white dark:bg-[#131D21] border border-slate-200 dark:border-[#22353A] flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
              Breach Risk by Equipment Category
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Historical failure complexity & response lead times
            </p>

            <div className="space-y-4">
              {[
                { name: 'Commercial Chillers', risk: 'Low', compliance: 99.1, color: 'bg-emerald-500' },
                { name: 'BACnet / Smart Controls', risk: 'Low', compliance: 98.4, color: 'bg-emerald-500' },
                { name: 'Rooftop Packaged HVAC', risk: 'Moderate', compliance: 94.6, color: 'bg-amber-500' },
                { name: 'Walk-In Refrigeration', risk: 'Elevated', compliance: 91.2, color: 'bg-rose-500' },
              ].map((cat) => (
                <div key={cat.name} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {cat.name}
                    </span>
                    <span className="font-mono font-bold text-slate-600 dark:text-slate-300">
                      {cat.compliance}%
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-[#0C1215] overflow-hidden">
                    <div
                      style={{ width: `${cat.compliance}%` }}
                      className={`h-full rounded-full ${cat.color}`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 p-3 rounded-xl bg-slate-50 dark:bg-[#0C1215] border border-slate-200 dark:border-[#22353A] text-xs space-y-1">
            <span className="font-bold text-slate-800 dark:text-white flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
              SLA Recommendation
            </span>
            <p className="text-slate-500 dark:text-slate-400 text-[11px] leading-relaxed">
              Walk-In Refrigeration tickets have the highest variance due to specialized compressor parts. Pre-stocking truck bins reduces MTTR by 26 minutes.
            </p>
          </div>
        </Card>
      </div>

      {/* Technician Efficiency Leaderboard */}
      <Card className="p-5 bg-white dark:bg-[#131D21] border border-slate-200 dark:border-[#22353A]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-500" />
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                Fleet Performance & First-Time Fix Leaderboard
              </h2>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Individual technician resolution metrics and customer approval ratings
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-[#22353A] text-slate-500 dark:text-slate-400 font-mono text-[11px]">
                <th className="pb-3 font-semibold">TECHNICIAN</th>
                <th className="pb-3 font-semibold">SPECIALTY</th>
                <th className="pb-3 font-semibold text-center">COMPLETED JOBS</th>
                <th className="pb-3 font-semibold text-center">AVG MTTR</th>
                <th className="pb-3 font-semibold text-center">FTFR RATE</th>
                <th className="pb-3 font-semibold text-right">CSAT RATING</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-[#22353A]">
              {LEADERBOARD.map((tech, rank) => (
                <tr
                  key={tech.id}
                  className="hover:bg-slate-50/80 dark:hover:bg-[#18252a] transition-colors"
                >
                  <td className="py-3 font-semibold text-slate-900 dark:text-white">
                    <div className="flex items-center gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-slate-100 dark:bg-[#0C1215] flex items-center justify-center font-mono text-[10px] text-slate-600 dark:text-slate-400">
                        {rank + 1}
                      </span>
                      <div>
                        <span>{tech.name}</span>
                        <span className="block text-[10px] text-slate-400 font-mono">
                          {tech.code}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 text-slate-600 dark:text-slate-300">
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-[#0C1215] text-[10px] font-mono border border-slate-200 dark:border-[#22353A]">
                      {tech.specialty}
                    </span>
                  </td>
                  <td className="py-3 text-center font-mono font-bold text-slate-800 dark:text-slate-200">
                    {tech.completedJobs}
                  </td>
                  <td className="py-3 text-center font-mono text-slate-700 dark:text-slate-300">
                    {tech.avgResolutionTime}
                  </td>
                  <td className="py-3 text-center font-mono font-bold text-emerald-700 dark:text-sage-300">
                    {tech.ftfr}%
                  </td>
                  <td className="py-3 text-right font-mono font-bold text-amber-600 dark:text-amber-400">
                    ★ {tech.satisfaction.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default AnalyticsPage;
