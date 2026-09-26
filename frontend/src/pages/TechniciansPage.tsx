import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  Search,
  Phone,
  Mail,
  MapPin,
  Star,
  CheckCircle2,
  Clock,
  Layers,
  Send,
  Plus,
  RefreshCw,
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

interface TechnicianRosterItem {
  id: number;
  fullName: string;
  employeeCode: string;
  phone: string;
  email: string;
  skills: string[];
  rating: number;
  completedJobsCount: number;
  activeJobsCount: number;
  maxConcurrentJobs: number;
  latitude: number;
  longitude: number;
  status: 'AVAILABLE' | 'ON_JOB' | 'OFF_DUTY';
  currentJobNumber?: string;
}

const INITIAL_TECHS: TechnicianRosterItem[] = [
  {
    id: 1,
    fullName: 'Marcus Vance',
    employeeCode: 'TECH-001',
    phone: '+1 (312) 555-0144',
    email: 'marcus.vance@fieldpulse.io',
    skills: ['HVAC EPA Universal', 'Chiller Specialist', 'Commercial Refrigeration'],
    rating: 4.95,
    completedJobsCount: 148,
    activeJobsCount: 0,
    maxConcurrentJobs: 2,
    latitude: 41.8845,
    longitude: -87.632,
    status: 'AVAILABLE',
  },
  {
    id: 2,
    fullName: 'Elena Rostova',
    employeeCode: 'TECH-002',
    phone: '+1 (312) 555-0182',
    email: 'elena.rostova@fieldpulse.io',
    skills: ['Smart Controls BACnet', 'Heat Pump Specialist', 'HVAC EPA Universal'],
    rating: 4.88,
    completedJobsCount: 112,
    activeJobsCount: 1,
    maxConcurrentJobs: 1,
    latitude: 41.8808,
    longitude: -87.6318,
    status: 'ON_JOB',
    currentJobNumber: 'JOB-2026-0002',
  },
  {
    id: 3,
    fullName: 'David Kim',
    employeeCode: 'TECH-003',
    phone: '+1 (312) 555-0291',
    email: 'david.kim@fieldpulse.io',
    skills: ['High Voltage 480V', 'Master Electrical', 'Industrial Motors'],
    rating: 4.75,
    completedJobsCount: 94,
    activeJobsCount: 0,
    maxConcurrentJobs: 2,
    latitude: 41.855,
    longitude: -87.658,
    status: 'AVAILABLE',
  },
  {
    id: 4,
    fullName: 'Sarah Chen',
    employeeCode: 'TECH-004',
    phone: '+1 (312) 555-0377',
    email: 'sarah.chen@fieldpulse.io',
    skills: ['Hydronic Heating', 'Boiler Systems', 'Commercial Plumbing'],
    rating: 4.91,
    completedJobsCount: 130,
    activeJobsCount: 0,
    maxConcurrentJobs: 2,
    latitude: 41.8992,
    longitude: -87.625,
    status: 'OFF_DUTY',
  },
];

export const TechniciansPage: React.FC = () => {
  const navigate = useNavigate();
  const [techs, setTechs] = useState<TechnicianRosterItem[]>(INITIAL_TECHS);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'AVAILABLE' | 'ON_JOB' | 'OFF_DUTY'>('ALL');

  const filteredTechs = techs.filter((t) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      t.fullName.toLowerCase().includes(q) ||
      t.employeeCode.toLowerCase().includes(q) ||
      t.skills.some((s) => s.toLowerCase().includes(q));
    const matchesStatus = statusFilter === 'ALL' || t.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleToggleStatus = (id: number) => {
    setTechs((prev) =>
      prev.map((t) => {
        if (t.id !== id) return t;
        const nextStatus: Record<string, 'AVAILABLE' | 'ON_JOB' | 'OFF_DUTY'> = {
          AVAILABLE: 'ON_JOB',
          ON_JOB: 'OFF_DUTY',
          OFF_DUTY: 'AVAILABLE',
        };
        return { ...t, status: nextStatus[t.status] };
      })
    );
  };

  const availableCount = techs.filter((t) => t.status === 'AVAILABLE').length;
  const onJobCount = techs.filter((t) => t.status === 'ON_JOB').length;
  const avgRating = (techs.reduce((acc, t) => acc + t.rating, 0) / techs.length).toFixed(2);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <Users className="w-6 h-6 text-[#234B34] dark:text-sage-300" />
            Field Engineer Fleet Roster
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Real-time technician tracking, skill certifications, active workload balance, and dispatch routing.
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setTechs(INITIAL_TECHS)}
            leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
          >
            Reset Fleet
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate('/dispatch')}
            leftIcon={<Send className="w-3.5 h-3.5" />}
          >
            Dispatch Console
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="bg-white dark:bg-[#131D21] border border-slate-200 dark:border-[#22353A] border-t-2 border-t-[#3E6B48] dark:border-t-sage-300/40 rounded-xl p-4 space-y-1 shadow-xs dark:shadow-md transition-all duration-80">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-mono uppercase">
            <span>Total Fleet</span>
            <Users className="w-4 h-4 text-[#234B34] dark:text-sage-300" />
          </div>
          <div className="text-2xl font-mono font-bold text-slate-900 dark:text-white">
            {techs.length}
          </div>
          <div className="text-[11px] text-slate-400">Certified field technicians</div>
        </div>

        <div className="bg-white dark:bg-[#131D21] border border-slate-200 dark:border-[#22353A] border-t-2 border-t-emerald-500 rounded-xl p-4 space-y-1 shadow-xs dark:shadow-md transition-all duration-80">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-mono uppercase">
            <span>Available Now</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-mono font-bold text-emerald-700 dark:text-sage-300">
            {availableCount}
          </div>
          <div className="text-[11px] text-slate-400">Ready for instant dispatch</div>
        </div>

        <div className="bg-white dark:bg-[#131D21] border border-slate-200 dark:border-[#22353A] border-t-2 border-t-amber-500 rounded-xl p-4 space-y-1 shadow-xs dark:shadow-md transition-all duration-80">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-mono uppercase">
            <span>On Active Job</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-mono font-bold text-amber-600 dark:text-amber-400">
            {onJobCount}
          </div>
          <div className="text-[11px] text-slate-400">In fieldwork or transit</div>
        </div>

        <div className="bg-white dark:bg-[#131D21] border border-slate-200 dark:border-[#22353A] border-t-2 border-t-sky-500 rounded-xl p-4 space-y-1 shadow-xs dark:shadow-md transition-all duration-80">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-mono uppercase">
            <span>Average Rating</span>
            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
          </div>
          <div className="text-2xl font-mono font-bold text-slate-900 dark:text-white">
            {avgRating} <span className="text-xs font-normal text-slate-400">/ 5.0</span>
          </div>
          <div className="text-[11px] text-slate-400">Verified customer feedback</div>
        </div>
      </div>

      {/* Toolbar: Search & Filter */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white dark:bg-[#131D21] p-3.5 rounded-xl border border-slate-200 dark:border-[#22353A] shadow-xs">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, code, or certified skill..."
            className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-slate-50 dark:bg-[#0C1215] border border-slate-200 dark:border-[#22353A] text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#234B34] dark:focus:ring-sage-300 font-mono"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto">
          {(['ALL', 'AVAILABLE', 'ON_JOB', 'OFF_DUTY'] as const).map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold whitespace-nowrap transition-all duration-80 ${
                statusFilter === st
                  ? 'bg-[#234B34] text-white dark:bg-sage-300 dark:text-[#0C1215] shadow-xs'
                  : 'bg-slate-100 dark:bg-[#0C1215] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {st.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Fleet Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredTechs.map((tech) => {
          const loadPercent = (tech.activeJobsCount / tech.maxConcurrentJobs) * 100;
          return (
            <div
              key={tech.id}
              className="bg-white dark:bg-[#131D21] border border-slate-200 dark:border-[#22353A] hover:border-[#3E6B48] dark:hover:border-sage-300/40 rounded-2xl p-5 shadow-xs dark:shadow-md transition-all duration-80 space-y-4"
            >
              {/* Header: Avatar, Name, Status Badge */}
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-sage-300/15 border border-emerald-200 dark:border-sage-300/30 text-emerald-800 dark:text-sage-300 font-mono font-bold text-base flex items-center justify-center shrink-0">
                    {tech.fullName
                      .split(' ')
                      .map((n) => n[0])
                      .join('')}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                        {tech.fullName}
                      </h3>
                      <span className="text-[10px] font-mono text-slate-400 bg-slate-100 dark:bg-[#0C1215] px-1.5 py-0.2 rounded border border-slate-200 dark:border-[#22353A]">
                        {tech.employeeCode}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      <span className="flex items-center gap-1 font-mono">
                        <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
                        <strong>{tech.rating}</strong>
                      </span>
                      <span>&bull;</span>
                      <span className="font-mono">{tech.completedJobsCount} fixes</span>
                    </div>
                  </div>
                </div>

                {/* Status Toggle Button */}
                <button
                  type="button"
                  onClick={() => handleToggleStatus(tech.id)}
                  title="Click to toggle status"
                  className={`inline-flex items-center text-[10px] font-mono font-bold px-2.5 py-1 rounded-full border transition-all cursor-pointer ${
                    tech.status === 'AVAILABLE'
                      ? 'bg-emerald-50 dark:bg-sage-300/15 text-emerald-700 dark:text-sage-300 border-emerald-200 dark:border-sage-300/30'
                      : tech.status === 'ON_JOB'
                      ? 'bg-amber-50 dark:bg-amber-500/15 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-500/30'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                      tech.status === 'AVAILABLE'
                        ? 'bg-emerald-600 dark:bg-sage-300 animate-pulse'
                        : tech.status === 'ON_JOB'
                        ? 'bg-amber-500 animate-pulse'
                        : 'bg-slate-400'
                    }`}
                  />
                  {tech.status.replace('_', ' ')}
                </button>
              </div>

              {/* Skills Certifications */}
              <div className="flex flex-wrap gap-1.5">
                {tech.skills.map((skill) => (
                  <span
                    key={skill}
                    className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-md bg-slate-100 dark:bg-[#0C1215] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-[#22353A]"
                  >
                    {skill}
                  </span>
                ))}
              </div>

              {/* Workload Meter & Telemetry */}
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#0C1215] border border-slate-200 dark:border-[#22353A] space-y-2 text-xs">
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1">
                    <Layers className="w-3.5 h-3.5 text-sky-500" />
                    Load Capacity:
                  </span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {tech.activeJobsCount} / {tech.maxConcurrentJobs} slots
                  </span>
                </div>
                {/* Progress bar */}
                <div className="w-full h-1.5 bg-slate-200 dark:bg-[#22353A] rounded-full overflow-hidden">
                  <div
                    style={{ width: `${loadPercent}%` }}
                    className={`h-full ${loadPercent >= 100 ? 'bg-amber-500' : 'bg-[#234B34] dark:bg-sage-300'}`}
                  />
                </div>
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-0.5">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-emerald-600 dark:text-sage-300" />
                    GPS: {tech.latitude.toFixed(3)}, {tech.longitude.toFixed(3)}
                  </span>
                  {tech.currentJobNumber && (
                    <span className="text-amber-600 dark:text-amber-400 font-bold">
                      Assigned: {tech.currentJobNumber}
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between gap-2 pt-1">
                <div className="flex items-center gap-2 text-xs">
                  <a
                    href={`tel:${tech.phone}`}
                    className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-[#0C1215] dark:hover:bg-[#18252a] border border-slate-200 dark:border-[#22353A] text-slate-700 dark:text-slate-300"
                    title="Call Engineer"
                  >
                    <Phone className="w-3.5 h-3.5" />
                  </a>
                  <a
                    href={`mailto:${tech.email}`}
                    className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-[#0C1215] dark:hover:bg-[#18252a] border border-slate-200 dark:border-[#22353A] text-slate-700 dark:text-slate-300"
                    title="Email Engineer"
                  >
                    <Mail className="w-3.5 h-3.5" />
                  </a>
                </div>

                <Button
                  size="sm"
                  variant="primary"
                  onClick={() => navigate('/dispatch')}
                  leftIcon={<Send className="w-3 h-3" />}
                  className="text-xs"
                >
                  Direct Dispatch
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TechniciansPage;
