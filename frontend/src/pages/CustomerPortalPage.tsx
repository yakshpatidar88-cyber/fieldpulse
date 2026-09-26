import React, { useState } from 'react';
import {
  Smartphone,
  MapPin,
  Clock,
  Phone,
  ShieldCheck,
  CheckCircle2,
  Navigation,
  Star,
  Copy,
  Check,
  FileCheck2,
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

export const CustomerPortalPage: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const [isSigned, setIsSigned] = useState(false);
  const [selectedJobNumber, setSelectedJobNumber] = useState('JOB-2026-0001');

  const jobsData = {
    'JOB-2026-0001': {
      jobNumber: 'JOB-2026-0001',
      title: 'Centrifugal Chiller Low Pressure Sensor Fault',
      customer: 'Mercy Hospital Chicago',
      address: '710 S Paulina St, Chicago, IL 60612',
      techName: 'Marcus Vance',
      techPhone: '+1 (312) 555-0144',
      techRating: 4.95,
      etaMinutes: 18,
      distanceMiles: '2.4 miles away',
      currentStep: 2, // 0: Dispatch, 1: En Route, 2: On-Site, 3: Completed
    },
    'JOB-2026-0002': {
      jobNumber: 'JOB-2026-0002',
      title: 'Server Room Auxiliary AC Failure',
      customer: 'Midwest Tower Corporate',
      address: '111 W Monroe St, Chicago, IL 60603',
      techName: 'Elena Rostova',
      techPhone: '+1 (312) 555-0182',
      techRating: 4.88,
      etaMinutes: 34,
      distanceMiles: '4.8 miles away',
      currentStep: 1,
    },
  };

  const job = jobsData[selectedJobNumber as keyof typeof jobsData] || jobsData['JOB-2026-0001'];
  const trackingUrl = `https://fieldpulse.io/track/${job.jobNumber.toLowerCase()}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(trackingUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-in fade-in duration-80">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Customer Live Tracking Experience
            </h1>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-500/20 dark:text-blue-300 border border-blue-200 dark:border-blue-500/30">
              CLIENT-FACING
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Real-time GPS mobile tracking portal, technician identity verification, and customer digital sign-off receipts.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Select Ticket to Preview */}
          <select
            value={selectedJobNumber}
            onChange={(e) => setSelectedJobNumber(e.target.value)}
            className="rounded-xl bg-white dark:bg-[#131D21] border border-slate-200 dark:border-[#22353A] px-3 py-1.5 text-xs text-slate-900 dark:text-white font-mono focus:outline-none"
          >
            <option value="JOB-2026-0001">JOB-2026-0001 (Mercy Hospital)</option>
            <option value="JOB-2026-0002">JOB-2026-0002 (Midwest Tower)</option>
          </select>
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopyLink}
            leftIcon={copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
          >
            {copied ? 'Link Copied' : 'Share Tracking Link'}
          </Button>
        </div>
      </div>

      {/* Main Dual-Column Simulator View */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        {/* Left: Mobile Simulator Frame */}
        <div className="bg-slate-900 rounded-[36px] p-4 shadow-2xl border-4 border-slate-800 max-w-sm mx-auto w-full">
          <div className="bg-white dark:bg-[#131D21] rounded-[28px] overflow-hidden border border-slate-200 dark:border-[#22353A] text-slate-800 dark:text-white space-y-4 p-5">
            {/* Top Brand Pill */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-[#22353A]">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                <span className="text-[11px] font-mono font-bold tracking-tight text-emerald-700 dark:text-sage-300">FIELDPULSE LIVE</span>
              </div>
              <span className="text-[10px] font-mono text-slate-400">{job.jobNumber}</span>
            </div>

            {/* Big Arrival ETA Card */}
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-sage-300/10 border border-emerald-200 dark:border-sage-300/30 text-center">
              <span className="text-[10px] font-mono font-bold text-emerald-800 dark:text-sage-300 uppercase block">
                Estimated Technician Arrival
              </span>
              <div className="text-3xl font-black text-slate-900 dark:text-white font-mono mt-1">
                {job.etaMinutes} MINS
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                {job.distanceMiles} &bull; Traffic optimal
              </p>
            </div>

            {/* Stepper Progress */}
            <div className="space-y-2 py-1">
              <span className="text-[10px] font-mono uppercase font-bold text-slate-400 block">Service Journey</span>
              <div className="flex items-center justify-between text-center relative">
                <div className="absolute top-3 left-4 right-4 h-0.5 bg-slate-200 dark:bg-[#22353A] -z-0" />
                {['Dispatched', 'En Route', 'On-Site', 'Complete'].map((step, idx) => {
                  const isDone = idx <= job.currentStep;
                  return (
                    <div key={step} className="relative z-10 flex flex-col items-center">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold font-mono transition-all ${
                        isDone ? 'bg-emerald-600 text-white' : 'bg-slate-200 dark:bg-[#22353A] text-slate-500'
                      }`}>
                        {idx + 1}
                      </div>
                      <span className="text-[9px] font-medium mt-1 text-slate-600 dark:text-slate-400">{step}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Technician Credentials */}
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#0C1215] border border-slate-200 dark:border-[#22353A] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white font-mono font-bold flex items-center justify-center">
                  {job.techName.split(' ').map((n) => n[0]).join('')}
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-900 dark:text-white block">{job.techName}</span>
                  <span className="text-[10px] text-slate-500">Master HVAC &bull; EPA Certified</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs font-mono font-bold text-amber-500">★ {job.techRating}</span>
              </div>
            </div>

            {/* Sign-off Simulator */}
            <div className="space-y-2 pt-1 border-t border-slate-100 dark:border-[#22353A]">
              <span className="text-xs font-bold text-slate-900 dark:text-white block">Digital Service Acceptance:</span>
              <div className="h-20 rounded-xl border border-dashed border-slate-300 dark:border-[#22353A] bg-slate-50 dark:bg-[#0C1215] flex items-center justify-center text-xs text-slate-400">
                {isSigned ? (
                  <span className="font-mono text-emerald-600 font-bold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" /> Cryptographic Sign-Off Verified
                  </span>
                ) : (
                  <span>Touch or sign on delivery</span>
                )}
              </div>
              <Button
                variant={isSigned ? 'outline' : 'primary'}
                size="sm"
                className="w-full text-xs"
                onClick={() => setIsSigned(!isSigned)}
              >
                {isSigned ? 'Reset Signature' : 'Simulate Customer Sign-Off'}
              </Button>
            </div>
          </div>
        </div>

        {/* Right: Operational Details & Features */}
        <div className="space-y-4">
          <Card className="p-5 bg-white dark:bg-[#131D21] border border-slate-200 dark:border-[#22353A]">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-sage-300" />
              Autonomous Transparency Engine
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
              When tickets are assigned, FieldPulse automatically generates an encrypted, tokenized customer tracking URL delivered via SMS and Email. Customers can view their technician en route in real-time, decreasing dispatch inquiry phone calls by 74%.
            </p>
          </Card>

          <Card className="p-5 bg-white dark:bg-[#131D21] border border-slate-200 dark:border-[#22353A] space-y-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Active Service Record</h3>
            <div className="text-xs space-y-2 text-slate-600 dark:text-slate-300">
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-[#22353A]">
                <span className="text-slate-400">Customer:</span>
                <span className="font-semibold text-slate-900 dark:text-white">{job.customer}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-[#22353A]">
                <span className="text-slate-400">Worksite:</span>
                <span className="font-semibold text-slate-900 dark:text-white">{job.address}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-[#22353A]">
                <span className="text-slate-400">Assigned Engineer:</span>
                <span className="font-semibold text-slate-900 dark:text-white">{job.techName}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Direct Contact:</span>
                <span className="font-mono text-emerald-700 dark:text-sage-300">{job.techPhone}</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CustomerPortalPage;
