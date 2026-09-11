import React from 'react';
import { Activity, ShieldCheck, Wrench, Clock, MapPin } from 'lucide-react';

export default function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <header className="border-b border-slate-800 bg-slate-900/60 backdrop-blur px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-400">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white">OpsFlow</h1>
            <p className="text-xs text-slate-400">Intelligent SLA-Aware Dispatch &amp; Operations</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1.5 animate-pulse"></span>
            System Online
          </span>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto p-6 space-y-6">
        <section className="rounded-2xl border border-slate-800 bg-slate-900/50 p-8 shadow-xl">
          <h2 className="text-2xl font-bold text-white mb-2">Operations Command Deck</h2>
          <p className="text-slate-400 max-w-3xl mb-6">
            OpsFlow coordinates incoming field service requests into constraint-validated technician dispatches.
            Evaluating certified skills, proximity, shift workload, and real-time SLA deadlines.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-4 flex items-center space-x-4">
              <div className="p-3 rounded-lg bg-teal-500/10 text-teal-400 border border-teal-500/20">
                <Wrench className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-400">Active Field Jobs</p>
                <p className="text-xl font-semibold text-white">24</p>
              </div>
            </div>

            <div className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-4 flex items-center space-x-4">
              <div className="p-3 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-400">SLA Warning Risk</p>
                <p className="text-xl font-semibold text-amber-400">2</p>
              </div>
            </div>

            <div className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-4 flex items-center space-x-4">
              <div className="p-3 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-400">Technicians In Transit</p>
                <p className="text-xl font-semibold text-white">12</p>
              </div>
            </div>

            <div className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-4 flex items-center space-x-4">
              <div className="p-3 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-400">First-Time Fix Rate</p>
                <p className="text-xl font-semibold text-emerald-400">92.4%</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-800 py-4 px-6 text-center text-xs text-slate-500">
        OpsFlow &copy; 2026. Built with Spring Boot 3, React 18, PostgreSQL 16 &amp; Redis 7.
      </footer>
    </div>
  );
}
