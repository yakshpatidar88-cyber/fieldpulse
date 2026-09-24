import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Send,
  Briefcase,
  Boxes,
  ShieldAlert,
  Zap,
  Radio,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface NavItem {
  to: string;
  label: string;
  badge?: string;
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
    badge: 'QUEUE',
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
    badge: '96.4%',
    icon: ShieldAlert,
    roles: ['ROLE_ADMIN', 'ROLE_DISPATCHER'],
  },
];

export const Sidebar: React.FC = () => {
  const { user } = useAuth();
  const [isHovered, setIsHovered] = useState(false);
  const userRoles = user?.roles || (user?.role ? [user.role] : []);
  const isAdmin = userRoles.includes('ROLE_ADMIN');

  const filteredItems = navItems.filter((item) => {
    if (!item.roles || item.roles.length === 0) return true;
    if (isAdmin) return true;
    return item.roles.some((r) => userRoles.includes(r as any));
  });

  return (
    <aside
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`bg-pine-900 border-r border-pine-600 flex flex-col justify-between shrink-0 select-none z-40 transition-all duration-80 ${
        isHovered ? 'w-60 shadow-2xl' : 'w-16'
      }`}
    >
      <div>
        {/* Brand Header */}
        <div className="h-14 flex items-center px-4 border-b border-pine-600 space-x-3 overflow-hidden">
          <div className="w-8 h-8 rounded-xl bg-sage-300/15 border border-sage-300/30 flex items-center justify-center text-sage-300 shrink-0 shadow-tactical-glow">
            <Zap className="w-4 h-4 fill-sage-300" />
          </div>
          {isHovered && (
            <div className="truncate">
              <h1 className="font-extrabold text-sm tracking-tight text-white flex items-center gap-1.5">
                FieldPulse
                <span className="text-[9px] uppercase font-mono px-1 py-0.2 rounded bg-sage-300/15 text-sage-300 border border-sage-300/30 font-bold">
                  PRO
                </span>
              </h1>
              <p className="text-[10px] text-slate-400">Tactical Dispatch</p>
            </div>
          )}
        </div>

        {/* Navigation Items */}
        <div className="p-2 space-y-1">
          {filteredItems.map((item) => {
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
                      ? 'bg-sage-300/10 text-sage-300 border border-sage-300/30 shadow-xs'
                      : 'text-slate-400 hover:text-white hover:bg-pine-800/80 border border-transparent'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {/* Active Edge Indicator Pill */}
                    {isActive && (
                      <span className="absolute -left-2 top-2.5 bottom-2.5 w-1 bg-sage-300 rounded-r-full shadow-tactical-glow" />
                    )}

                    <div className="flex items-center space-x-3 truncate">
                      <Icon className="w-4 h-4 shrink-0 transition-transform group-hover:scale-105" />
                      {isHovered && <span className="truncate">{item.label}</span>}
                    </div>

                    {isHovered && item.badge && (
                      <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-sage-300/15 text-sage-300 border border-sage-300/25 shrink-0">
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
      <div className="p-2 border-t border-pine-600">
        <div
          className={`rounded-xl bg-pine-800/80 border border-pine-600 flex items-center transition-all ${
            isHovered ? 'p-2.5 justify-between text-xs' : 'h-10 w-12 justify-center mx-auto'
          }`}
        >
          <div className="flex items-center space-x-2">
            <Radio className="w-3.5 h-3.5 text-sage-300 animate-pulse shrink-0" />
            {isHovered && (
              <div className="truncate text-[10px]">
                <span className="text-white font-semibold block leading-tight">GPS LIVE</span>
                <span className="text-slate-400 font-mono">14ms latency</span>
              </div>
            )}
          </div>
          {isHovered && (
            <span className="w-2 h-2 rounded-full bg-sage-300 shadow-tactical-glow" />
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
