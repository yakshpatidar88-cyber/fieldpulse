import React from 'react';
import {
  Wrench,
  Clock,
  MapPin,
  ShieldCheck,
  TrendingUp,
  AlertTriangle,
  Boxes,
  Users,
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { useNavigate } from 'react-router-dom';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Operations Command Deck</h2>
          <p className="text-sm text-slate-400 mt-1">
            Real-time SLA monitoring, active technician fleet, and automated dispatch pipeline.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/inventory')}
          >
            Inventory Stock
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate('/dispatch')}
          >
            Open Dispatch Console
          </Button>
        </div>
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Active Field Jobs</span>
            <div className="p-2 rounded-lg bg-teal-500/10 text-teal-400 border border-teal-500/20">
              <Wrench className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-white">24</span>
            <div className="flex items-center space-x-1.5 mt-1 text-xs text-emerald-400">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>4 scheduled today</span>
            </div>
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">SLA Warning Tiers</span>
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-amber-400">2</span>
            <div className="flex items-center space-x-1.5 mt-1 text-xs text-amber-300">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Breach risk &lt; 2 hrs</span>
            </div>
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Technicians In Transit</span>
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <MapPin className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-white">12</span>
            <div className="flex items-center space-x-1.5 mt-1 text-xs text-slate-400">
              <Users className="w-3.5 h-3.5" />
              <span>8 on-site servicing</span>
            </div>
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">First-Time Fix Rate</span>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-emerald-400">94.2%</span>
            <div className="flex items-center space-x-1.5 mt-1 text-xs text-slate-400">
              <Boxes className="w-3.5 h-3.5" />
              <span>Stock reservation active</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Two Column Layout: Urgent SLA Alerts & Candidate Dispatch Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Urgent SLA Guardrail */}
        <Card
          title="Active SLA Guardrail Monitor"
          subtitle="Real-time escalation watchdog running on 60-second intervals"
          className="lg:col-span-2"
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3.5 rounded-lg bg-slate-800/40 border border-slate-700/50">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-semibold text-white">SR-1002 — Main Cooling Tower Pump Failure</span>
                  <Badge variant="danger" size="sm" dot>CRITICAL</Badge>
                </div>
                <p className="text-xs text-slate-400">Customer: Apex Hospital Group &bull; Dallas Regional Clinic</p>
              </div>
              <div className="text-right">
                <span className="text-xs font-mono font-semibold text-rose-400">1h 14m remaining</span>
                <p className="text-[11px] text-slate-500">Tier 2 Escalation</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-lg bg-slate-800/40 border border-slate-700/50">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-semibold text-white">SR-1005 — 3-Phase Inverter Fault</span>
                  <Badge variant="warning" size="sm" dot>HIGH</Badge>
                </div>
                <p className="text-xs text-slate-400">Customer: NorthStar Logistics &bull; Distribution Center B</p>
              </div>
              <div className="text-right">
                <span className="text-xs font-mono font-semibold text-amber-400">3h 45m remaining</span>
                <p className="text-[11px] text-slate-500">Tier 1 Escalation</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-lg bg-slate-800/40 border border-slate-700/50">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-semibold text-white">SR-1008 — Fiber Backbone Splicing</span>
                  <Badge variant="info" size="sm">MEDIUM</Badge>
                </div>
                <p className="text-xs text-slate-400">Customer: Metro Broadband &bull; Central Switching Hub</p>
              </div>
              <div className="text-right">
                <span className="text-xs font-mono font-semibold text-teal-400">18h remaining</span>
                <p className="text-[11px] text-slate-500">Normal SLA Horizon</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Quick Actions & System Info */}
        <Card
          title="System Topology"
          subtitle="Spring Boot 3 + React 18 Foundation"
        >
          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between py-2 border-b border-slate-800">
              <span className="text-slate-400">API Gateway</span>
              <span className="text-slate-200 font-mono">http://localhost:8080/api/v1</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-slate-800">
              <span className="text-slate-400">Security Core</span>
              <span className="text-emerald-400 font-mono font-semibold">JWT Bearer (HS256)</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-slate-800">
              <span className="text-slate-400">Geo Algorithm</span>
              <span className="text-teal-400 font-medium">Haversine Great-Circle</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-slate-800">
              <span className="text-slate-400">Stock Guard</span>
              <span className="text-purple-400 font-medium">Pessimistic Write Lock</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-slate-400">WebSocket STOMP</span>
              <span className="text-indigo-400 font-mono">/ws (Day 12 Ready)</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
