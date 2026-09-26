import React, { useState } from 'react';
import {
  History,
  ShieldCheck,
  Search,
  Filter,
  Download,
  AlertTriangle,
  UserCheck,
  Lock,
  ArrowRight,
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

interface AuditItem {
  id: number;
  timestamp: string;
  eventType: 'DISPATCH_ASSIGNED' | 'STATUS_TRANSITION' | 'INVENTORY_RESERVED' | 'SLA_BREACH_PREVENTED' | 'SUPERVISOR_OVERRIDE';
  actor: string;
  targetRef: string;
  summary: string;
  status: 'VERIFIED' | 'FLAGGED';
}

const INITIAL_LOGS: AuditItem[] = [
  {
    id: 1,
    timestamp: '2026-09-26 10:48:12',
    eventType: 'STATUS_TRANSITION',
    actor: 'Marcus Vance [TECH-001]',
    targetRef: 'JOB-2026-0001',
    summary: 'Transitioned lifecycle state from ASSIGNED to IN_PROGRESS upon on-site GPS check-in.',
    status: 'VERIFIED',
  },
  {
    id: 2,
    timestamp: '2026-09-26 10:42:04',
    eventType: 'DISPATCH_ASSIGNED',
    actor: 'Sarah Jenkins [DISPATCHER]',
    targetRef: 'JOB-2026-0001',
    summary: 'Assigned Marcus Vance (Score: 96.5/100) via automated multi-factor Haversine match matrix.',
    status: 'VERIFIED',
  },
  {
    id: 3,
    timestamp: '2026-09-26 10:35:55',
    eventType: 'INVENTORY_RESERVED',
    actor: 'System Autonomous Lock',
    targetRef: 'SKU: EXP-VALVE-04',
    summary: 'Pessimistic write lock acquired for 2 units reserved on ticket JOB-2026-0001.',
    status: 'VERIFIED',
  },
  {
    id: 4,
    timestamp: '2026-09-26 09:14:22',
    eventType: 'SLA_BREACH_PREVENTED',
    actor: 'SLA Watchdog Daemon',
    targetRef: 'JOB-2026-0003',
    summary: 'Elevated triage priority from HIGH to CRITICAL after 50% SLA window elapsed.',
    status: 'VERIFIED',
  },
  {
    id: 5,
    timestamp: '2026-09-26 08:30:00',
    eventType: 'SUPERVISOR_OVERRIDE',
    actor: 'Alex Rivera [ADMIN]',
    targetRef: 'JOB-2026-0002',
    summary: 'Dispatcher proximity radius manually extended from 25 km to 50 km for emergency server room cooling.',
    status: 'VERIFIED',
  },
];

export const AuditLogPage: React.FC = () => {
  const [logs, setLogs] = useState<AuditItem[]>(INITIAL_LOGS);
  const [search, setSearch] = useState('');

  const filteredLogs = logs.filter(
    (l) =>
      l.targetRef.toLowerCase().includes(search.toLowerCase()) ||
      l.actor.toLowerCase().includes(search.toLowerCase()) ||
      l.summary.toLowerCase().includes(search.toLowerCase()) ||
      l.eventType.toLowerCase().includes(search.toLowerCase())
  );

  const handleExportCSV = () => {
    const header = 'ID,Timestamp,EventType,Actor,TargetRef,Summary,Status\n';
    const rows = filteredLogs
      .map(
        (l) =>
          `"${l.id}","${l.timestamp}","${l.eventType}","${l.actor}","${l.targetRef}","${l.summary.replace(/"/g, '""')}","${l.status}"`
      )
      .join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `fieldpulse_audit_trail_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-in fade-in duration-80">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Regulatory Audit Trail &amp; Event Log
            </h1>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-sage-300/15 text-emerald-800 dark:text-sage-300 border border-emerald-200 dark:border-sage-300/30">
              TAMPER-EVIDENT
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Chronological immutable records of every status transition, dispatcher assignment, and safety escalation.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportCSV}
            leftIcon={<Download className="w-3.5 h-3.5" />}
          >
            Export Audit Log
          </Button>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by ticket #, technician, actor, or event..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-white dark:bg-[#131D21] border border-slate-200 dark:border-[#22353A] text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>
      </div>

      {/* Log Feed List */}
      <div className="space-y-2.5">
        {filteredLogs.map((item) => (
          <Card
            key={item.id}
            className="p-4 bg-white dark:bg-[#131D21] border border-slate-200 dark:border-[#22353A] shadow-xs hover:border-slate-300 dark:hover:border-sage-300/40 transition-all"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-[#0C1215] text-emerald-800 dark:text-sage-300 border border-slate-200 dark:border-[#22353A]">
                    {item.eventType}
                  </span>
                  <span className="font-mono text-slate-400 text-[11px]">&bull;</span>
                  <span className="font-bold text-slate-900 dark:text-white font-mono">
                    {item.targetRef}
                  </span>
                </div>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-[11px]">
                  {item.summary}
                </p>
                <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono">
                  <span>Actor: {item.actor}</span>
                </div>
              </div>

              <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-1 shrink-0 font-mono text-[11px]">
                <span className="text-slate-500 dark:text-slate-400">{item.timestamp}</span>
                <span className="text-emerald-700 dark:text-sage-300 font-bold flex items-center gap-1 text-[10px]">
                  <ShieldCheck className="w-3 h-3" /> VERIFIED
                </span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AuditLogPage;
