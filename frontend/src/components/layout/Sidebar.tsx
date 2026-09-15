import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Send,
  Briefcase,
  Boxes,
  ShieldAlert,
  Activity,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface NavItem {
  to: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  roles?: string[];
}

const navItems: NavItem[] = [
  {
    to: '/dashboard',
    label: 'Overview Deck',
    icon: LayoutDashboard,
  },
  {
    to: '/dispatch',
    label: 'Dispatch Console',
    icon: Send,
    roles: ['ROLE_ADMIN', 'ROLE_DISPATCHER'],
  },
  {
    to: '/jobs',
    label: 'Field Jobs',
    icon: Briefcase,
  },
  {
    to: '/inventory',
    label: 'Parts & Inventory',
    icon: Boxes,
  },
  {
    to: '/sla',
    label: 'SLA Guardrail',
    icon: ShieldAlert,
    roles: ['ROLE_ADMIN', 'ROLE_DISPATCHER'],
  },
];

export const Sidebar: React.FC = () => {
  const { user } = useAuth();
  const userRole = user?.role;

  const filteredItems = navItems.filter((item) => {
    if (!item.roles) return true;
    return userRole && item.roles.includes(userRole);
  });

  return (
    <aside className="w-64 bg-slate-900/70 border-r border-slate-800/80 flex flex-col justify-between shrink-0">
      <div>
        {/* Brand */}
        <div className="h-16 flex items-center px-6 border-b border-slate-800/80 space-x-3">
          <div className="w-9 h-9 rounded-xl bg-teal-500/15 border border-teal-500/30 flex items-center justify-center text-teal-400 shadow-inner">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-bold text-base tracking-tight text-white flex items-center gap-1.5">
              OpsFlow
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-teal-500/20 text-teal-300 border border-teal-500/30">
                v1.0
              </span>
            </h1>
            <p className="text-[11px] text-slate-400">Intelligent Dispatch</p>
          </div>
        </div>

        {/* Navigation Items */}
        <div className="p-4 space-y-1">
          <p className="px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Operations
          </p>
          {filteredItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all group ${
                    isActive
                      ? 'bg-teal-500/15 text-teal-300 border border-teal-500/30 shadow-sm'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                  }`
                }
              >
                <div className="flex items-center space-x-3">
                  <Icon className="w-4 h-4 transition-transform group-hover:scale-110" />
                  <span>{item.label}</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-slate-500" />
              </NavLink>
            );
          })}
        </div>
      </div>

      {/* System Status Pill */}
      <div className="p-4 border-t border-slate-800/80">
        <div className="bg-slate-950/60 border border-slate-800 rounded-lg p-3 text-xs flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-slate-300 font-medium">Engine Active</span>
          </div>
          <span className="text-[11px] text-slate-400 font-mono">24/7 SLA</span>
        </div>
      </div>
    </aside>
  );
};
