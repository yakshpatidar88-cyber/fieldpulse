import React from 'react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Briefcase, Boxes, ShieldAlert } from 'lucide-react';

export const JobsPage: React.FC = () => {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Briefcase className="w-6 h-6 text-teal-400" />
            Field Jobs &amp; Service Requests
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Track job lifecycle: PENDING &rarr; ASSIGNED &rarr; IN_TRANSIT &rarr; IN_PROGRESS &rarr; COMPLETED.
          </p>
        </div>
        <Badge variant="info">Day 11 Feature Ready</Badge>
      </div>

      <Card
        title="Job Management Table"
        subtitle="Hooked to GET /api/v1/jobs with status transition validation"
      >
        <div className="border border-dashed border-slate-800 rounded-xl p-12 text-center text-slate-500">
          <Briefcase className="w-12 h-12 mx-auto mb-4 text-teal-500/40" />
          <p className="text-base font-medium text-slate-300">Ready for Day 11 Jobs UI Integration</p>
          <p className="text-xs text-slate-500 mt-1">
            Filterable job queue, SLA deadline countdown chips, and technician assignment status.
          </p>
        </div>
      </Card>
    </div>
  );
};

export const InventoryPage: React.FC = () => {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Boxes className="w-6 h-6 text-teal-400" />
            Inventory &amp; Parts Management
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Track warehouse stock levels with pessimistic reservation lock guarding.
          </p>
        </div>
        <Badge variant="info">Day 11 Feature Ready</Badge>
      </div>

      <Card
        title="Parts Catalog &amp; Low Stock Alerts"
        subtitle="Hooked to GET /api/v1/inventory and stock reservation endpoints"
      >
        <div className="border border-dashed border-slate-800 rounded-xl p-12 text-center text-slate-500">
          <Boxes className="w-12 h-12 mx-auto mb-4 text-teal-500/40" />
          <p className="text-base font-medium text-slate-300">Ready for Day 11 Inventory UI Integration</p>
          <p className="text-xs text-slate-500 mt-1">
            Stock reorder thresholds, reserved count visualizer, and manual stock adjustment modal.
          </p>
        </div>
      </Card>
    </div>
  );
};

export const SlaPage: React.FC = () => {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <ShieldAlert className="w-6 h-6 text-teal-400" />
            SLA Escalation Guardrail
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Tiered breach prevention: WARNING at 50% elapsed, CRITICAL at 75%, BREACHED at 100%.
          </p>
        </div>
        <Badge variant="purple">Escalation Engine Active</Badge>
      </div>

      <Card
        title="SLA Risk Dashboard"
        subtitle="Hooked to GET /api/v1/sla/dashboard metrics"
      >
        <div className="border border-dashed border-slate-800 rounded-xl p-12 text-center text-slate-500">
          <ShieldAlert className="w-12 h-12 mx-auto mb-4 text-teal-500/40" />
          <p className="text-base font-medium text-slate-300">Ready for Day 11 SLA UI Integration</p>
          <p className="text-xs text-slate-500 mt-1">
            Live breach countdown timers, escalation tier logs, and dispatcher alert resolution actions.
          </p>
        </div>
      </Card>
    </div>
  );
};
