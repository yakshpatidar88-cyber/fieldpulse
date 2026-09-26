import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Send,
  Briefcase,
  Boxes,
  ShieldAlert,
  Users,
  BarChart3,
  CalendarCheck,
  Smartphone,
  History,
  Zap,
  Radio,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface NavItem {
  to: string;
  label: string;
  badge?: string;
  icon: React.ComponentType<{ className?: string }>;
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
    badge: 'QUEUE',
    icon: Send,
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
    badge: '98.2%',
    icon: ShieldAlert,
  },
  {
    to: '/technicians',
    label: 'Fleet Technicians',
    badge: '4 ACTIVE',
    icon: Users,
  },
  {
    to: '/analytics',
    label: 'Analytics Deck',
    badge: '92.4%',
    icon: BarChart3,
  },
  {
    to: '/maintenance',
    label: 'Preventive PM',
    badge: 'AUTO',
    icon: CalendarCheck,
  },
  {
    to: '/customer-portal',
    label: 'Customer Portal',
    badge: 'LIVE',
    icon: Smartphone,
  },
  {
    to: '/audit',
    label: 'Audit Trail',
    badge: 'LOGS',
    icon: History,
  },
];

export const Sidebar: React.FC = () => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <aside
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`bg-white dark:bg-[#131D21] border-r border-slate-200 dark:border-[#22353A] flex flex-col justify-between shrink-0 select-none z-40 transition-all duration-80 ${
        isHovered ? 'w-60 shadow-xl' : 'w-16'
      }`}
    >
      <div className="flex-1 overflow-y-auto overflow-x-hidden">
        {/* Brand Header */}
        <div className="h-14 flex items-center px-4 border-b border-slate-200 dark:border-[#22353A] space-x-3 overflow-hidden sticky top-0 bg-white dark:bg-[#131D21] z-10">
          <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-sage-300/15 border border-emerald-200 dark:border-sage-300/30 flex items-center justify-center text-emerald-800 dark:text-sage-300 shrink-0 shadow-xs">
            <Zap className="w-4 h-4 fill-emerald-800 dark:fill-sage-300" />
          </div>
          {isHovered && (
            <div className="truncate">
              <h1 className="font-black text-sm tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5">
                FieldPulse
                <span className="text-[9px] uppercase font-mono px-1 py-0.2 rounded bg-emerald-100 dark:bg-sage-300/15 text-emerald-800 dark:text-sage-300 border border-emerald-200 dark:border-sage-300/30 font-bold">
                  PRO
                </span>
              </h1>
              <p className="text-[10px] text-slate-400 font-mono">Tactical Dispatch</p>
            </div>
          )}
        </div>

        {/* Navigation Items */}
        <div className="p-2 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                title={!isHovered ? item.label : undefined}
                className={({ isActive }) =>
                  `relative flex items-center rounded-xl text-xs font-semibold transition-all duration-80 group ${
                    isHovered ? 'px-3 py-2.5 justify-between' : 'h-10 w-12 justify-center mx-auto'
                  } ${
                    isActive
                      ? 'bg-emerald-50 dark:bg-sage-300/10 text-emerald-900 dark:text-sage-300 border border-emerald-200 dark:border-sage-300/30 shadow-xs font-bold'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#1A262B] border border-transparent'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {/* Active Edge Indicator Pill */}
                    {isActive && (
                      <span className="absolute -left-2 top-2.5 bottom-2.5 w-1 bg-emerald-700 dark:bg-sage-300 rounded-r-full" />
                    )}

                    <div className="flex items-center space-x-3 truncate">
                      <Icon className="w-4 h-4 shrink-0 transition-transform group-hover:scale-105" />
                      {isHovered && <span className="truncate">{item.label}</span>}
                    </div>

                    {isHovered && item.badge && (
                      <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-slate-100 dark:bg-sage-300/15 text-slate-700 dark:text-sage-300 border border-slate-200 dark:border-sage-300/25 shrink-0">
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </div>
      </div>

      {/* Footer Telemetry Widget */}
      <div className="p-2 border-t border-slate-200 dark:border-[#22353A] shrink-0 bg-white dark:bg-[#131D21]">
        <div
          className={`rounded-xl bg-slate-50 dark:bg-[#0C1215] border border-slate-200 dark:border-[#22353A] flex items-center transition-all ${
            isHovered ? 'p-2.5 justify-between text-xs' : 'h-10 w-12 justify-center mx-auto'
          }`}
        >
          <div className="flex items-center space-x-2">
            <Radio className="w-3.5 h-3.5 text-emerald-600 dark:text-sage-300 animate-pulse shrink-0" />
            {isHovered && (
              <div className="truncate text-[10px]">
                <span className="text-slate-800 dark:text-white font-semibold block leading-tight">GPS LIVE</span>
                <span className="text-slate-500 dark:text-slate-400 font-mono">14ms latency</span>
              </div>
            )}
          </div>
          {isHovered && (
            <span className="w-2 h-2 rounded-full bg-emerald-500 dark:bg-sage-300" />
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
