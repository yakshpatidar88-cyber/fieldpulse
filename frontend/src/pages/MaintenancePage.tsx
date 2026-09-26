import React, { useState } from 'react';
import {
  CalendarCheck,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Wrench,
  Building2,
  Plus,
  RefreshCw,
  FileSpreadsheet,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

interface PreventiveSchedule {
  id: number;
  assetName: string;
  facility: string;
  category: string;
  interval: string;
  lastServiced: string;
  nextDueDate: string;
  healthScore: number;
  status: 'OPTIMAL' | 'DUE_SOON' | 'OVERDUE';
  assignedTech: string;
  checklistCount: number;
}

const INITIAL_SCHEDULES: PreventiveSchedule[] = [
  {
    id: 1,
    assetName: 'Centrifugal Chiller Unit #01',
    facility: 'Mercy Hospital Chicago',
    category: 'Commercial Chillers',
    interval: 'Quarterly (90 Days)',
    lastServiced: '2026-07-15',
    nextDueDate: '2026-10-15',
    healthScore: 94,
    status: 'OPTIMAL',
    assignedTech: 'Marcus Vance',
    checklistCount: 14,
  },
  {
    id: 2,
    assetName: 'Rooftop Packaged HVAC Unit #04',
    facility: 'Midwest Tower Corporate',
    category: 'Packaged Rooftop',
    interval: 'Bi-Monthly (60 Days)',
    lastServiced: '2026-08-01',
    nextDueDate: '2026-10-01',
    healthScore: 78,
    status: 'DUE_SOON',
    assignedTech: 'Elena Rostova',
    checklistCount: 11,
  },
  {
    id: 3,
    assetName: 'Walk-In Refrigeration Compressor #02',
    facility: 'Riverwalk Deli & Grocers',
    category: 'Commercial Refrigeration',
    interval: 'Monthly (30 Days)',
    lastServiced: '2026-08-20',
    nextDueDate: '2026-09-20',
    healthScore: 62,
    status: 'OVERDUE',
    assignedTech: 'Darius Thorne',
    checklistCount: 9,
  },
  {
    id: 4,
    assetName: 'BACnet Central Air Handling Unit #07',
    facility: 'Loop Civic Center',
    category: 'Smart Air Handlers',
    interval: 'Bi-Annual (180 Days)',
    lastServiced: '2026-04-10',
    nextDueDate: '2026-10-10',
    healthScore: 91,
    status: 'OPTIMAL',
    assignedTech: 'Devon Patel',
    checklistCount: 16,
  },
];

export const MaintenancePage: React.FC = () => {
  const [schedules, setSchedules] = useState<PreventiveSchedule[]>(INITIAL_SCHEDULES);
  const [filter, setFilter] = useState<'ALL' | 'DUE_SOON' | 'OVERDUE'>('ALL');
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const handleTriggerWorkOrder = (schedule: PreventiveSchedule) => {
    setSuccessToast(`Automated Work Order generated for ${schedule.assetName}! Dispatched to ${schedule.assignedTech}.`);
    setSchedules((prev) =>
      prev.map((s) =>
        s.id === schedule.id
          ? { ...s, status: 'OPTIMAL', lastServiced: new Date().toISOString().split('T')[0], healthScore: 98 }
          : s
      )
    );
    setTimeout(() => setSuccessToast(null), 4000);
  };

  const filtered = schedules.filter((s) => {
    if (filter === 'ALL') return true;
    return s.status === filter;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-in fade-in duration-80">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Preventive Maintenance &amp; Asset Schedules
            </h1>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-sage-300/15 text-emerald-800 dark:text-sage-300 border border-emerald-200 dark:border-sage-300/30">
              PREDICTIVE
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Automated recurring inspection cycles, health scoring, and autonomous PM service ticket dispatch.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Filter Pills */}
          <div className="flex bg-slate-100 dark:bg-[#131D21] border border-slate-200 dark:border-[#22353A] rounded-xl p-0.5 text-xs font-semibold">
            {(['ALL', 'DUE_SOON', 'OVERDUE'] as const).map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                className={`px-3 py-1 rounded-lg transition-all ${
                  filter === f
                    ? 'bg-white dark:bg-[#1E2D32] text-slate-900 dark:text-white shadow-xs font-bold'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                {f.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Success Notification */}
      {successToast && (
        <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-[#131D21] border border-emerald-200 dark:border-sage-300/40 text-emerald-800 dark:text-sage-300 text-xs flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-sage-300 shrink-0" />
            <span>{successToast}</span>
          </div>
          <button onClick={() => setSuccessToast(null)} className="font-mono underline">Dismiss</button>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 bg-white dark:bg-[#131D21] border border-slate-200 dark:border-[#22353A]">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Scheduled Assets</span>
          <div className="text-2xl font-black text-slate-900 dark:text-white font-mono mt-2">4 Units</div>
          <p className="text-[11px] text-slate-500 mt-1">100% telemetry coverage</p>
        </Card>
        <Card className="p-4 bg-white dark:bg-[#131D21] border border-slate-200 dark:border-[#22353A]">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Fleet Health Index</span>
          <div className="text-2xl font-black text-emerald-700 dark:text-sage-300 font-mono mt-2">81.3 / 100</div>
          <p className="text-[11px] text-emerald-600 mt-1 font-semibold">Good mechanical condition</p>
        </Card>
        <Card className="p-4 bg-white dark:bg-[#131D21] border border-slate-200 dark:border-[#22353A]">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Due Within 14 Days</span>
          <div className="text-2xl font-black text-amber-600 dark:text-amber-400 font-mono mt-2">1 Asset</div>
          <p className="text-[11px] text-amber-600 mt-1 font-semibold">Scheduled for auto-dispatch</p>
        </Card>
        <Card className="p-4 bg-white dark:bg-[#131D21] border border-slate-200 dark:border-[#22353A]">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Preventive Overdue</span>
          <div className="text-2xl font-black text-rose-600 dark:text-rose-400 font-mono mt-2">1 Asset</div>
          <p className="text-[11px] text-rose-600 mt-1 font-semibold">Requires priority dispatch</p>
        </Card>
      </div>

      {/* Assets Maintenance List */}
      <div className="space-y-3">
        {filtered.map((item) => (
          <Card
            key={item.id}
            className="p-5 bg-white dark:bg-[#131D21] border border-slate-200 dark:border-[#22353A] shadow-xs hover:border-slate-300 dark:hover:border-sage-300/40 transition-all"
          >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-slate-900 dark:text-white">
                    {item.assetName}
                  </span>
                  <span
                    className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${
                      item.status === 'OPTIMAL'
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-sage-300/15 dark:text-sage-300 dark:border-sage-300/30'
                        : item.status === 'DUE_SOON'
                        ? 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-500/15 dark:text-amber-300 dark:border-amber-500/30'
                        : 'bg-rose-50 text-rose-800 border-rose-200 dark:bg-rose-500/15 dark:text-rose-300 dark:border-rose-500/30'
                    }`}
                  >
                    ● {item.status.replace('_', ' ')}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                  <span className="flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5" />
                    {item.facility}
                  </span>
                  <span>&bull;</span>
                  <span>Category: {item.category}</span>
                  <span>&bull;</span>
                  <span>Cadence: {item.interval}</span>
                </div>
              </div>

              {/* Health Score & Dates */}
              <div className="flex flex-wrap items-center gap-6 text-xs">
                <div className="space-y-1">
                  <span className="text-[11px] text-slate-400 block font-mono">HEALTH SCORE</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-2 rounded-full bg-slate-100 dark:bg-[#0C1215] overflow-hidden">
                      <div
                        style={{ width: `${item.healthScore}%` }}
                        className={`h-full rounded-full ${
                          item.healthScore >= 90 ? 'bg-emerald-600' : item.healthScore >= 75 ? 'bg-amber-500' : 'bg-rose-500'
                        }`}
                      />
                    </div>
                    <span className="font-mono font-bold text-slate-900 dark:text-white">
                      {item.healthScore}%
                    </span>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[11px] text-slate-400 block font-mono">NEXT SERVICE DUE</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">
                    {item.nextDueDate}
                  </span>
                </div>

                <div className="space-y-1">
                  <span className="text-[11px] text-slate-400 block font-mono">PRIMARY TECH</span>
                  <span className="font-medium text-slate-800 dark:text-slate-200">
                    {item.assignedTech}
                  </span>
                </div>

                <Button
                  size="sm"
                  variant={item.status === 'OVERDUE' ? 'primary' : 'secondary'}
                  onClick={() => handleTriggerWorkOrder(item)}
                  rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                >
                  Generate PM Work Order
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default MaintenancePage;
