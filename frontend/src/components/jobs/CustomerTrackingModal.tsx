import React, { useState } from 'react';
import {
  X,
  Phone,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Navigation,
  Star,
  Copy,
  Check,
  PenTool,
} from 'lucide-react';
import { Job } from '../../types/job';
import { Button } from '../ui/Button';

interface CustomerTrackingModalProps {
  job: Job | null;
  isOpen: boolean;
  onClose: () => void;
}

export const CustomerTrackingModal: React.FC<CustomerTrackingModalProps> = ({
  job,
  isOpen,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);
  const [isSigned, setIsSigned] = useState(false);

  if (!isOpen || !job) return null;

  const trackingUrl = `https://fieldpulse.io/track/${job.jobNumber.toLowerCase()}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(trackingUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const techName = job.assignedTechnician?.fullName || job.assignedTechnicianName || 'Marcus Vance';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-80">
      <div className="bg-white dark:bg-[#131D21] border border-slate-200 dark:border-[#22353A] rounded-3xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col transition-all duration-80">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-[#22353A] bg-slate-50 dark:bg-[#0C1215]">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white font-mono uppercase tracking-wide">
                Live Customer Portal View
              </h3>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Interactive client-facing mobile tracking link simulation
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-[#18252a] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Customer Mobile Chassis Preview */}
        <div className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* Shareable Link Bar */}
          <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-[#0C1215] border border-slate-200 dark:border-[#22353A] flex items-center justify-between gap-2">
            <span className="text-xs font-mono text-slate-600 dark:text-slate-300 truncate">
              {trackingUrl}
            </span>
            <button
              onClick={handleCopyLink}
              className="px-2.5 py-1 rounded-lg bg-white dark:bg-[#18252a] border border-slate-200 dark:border-[#22353A] text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1 shrink-0 hover:border-emerald-500"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Link'}</span>
            </button>
          </div>

          {/* ETA Card */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20 border border-emerald-200 dark:border-emerald-500/30 text-center space-y-1">
            <span className="text-[10px] font-mono uppercase font-bold text-emerald-700 dark:text-emerald-400 tracking-wider">
              Estimated Technician Arrival
            </span>
            <div className="text-3xl font-extrabold font-mono text-emerald-800 dark:text-sage-300">
              14 MINUTES
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Technician is currently 2.1 km away &bull; En Route to {job.address.split(',')[0]}
            </p>
          </div>

          {/* Technician Profile Card */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0C1215] border border-slate-200 dark:border-[#22353A] flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-sage-300/20 border border-emerald-300 dark:border-sage-300/40 text-emerald-800 dark:text-sage-300 font-bold font-mono text-base flex items-center justify-center">
                {techName.split(' ').map((n) => n[0]).join('')}
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">{techName}</h4>
                  <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-sage-300" />
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Certified Field Engineer &bull; EPA Universal
                </p>
                <div className="flex items-center gap-1 text-xs text-amber-500 mt-0.5">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <span className="font-bold">4.95</span>
                  <span className="text-slate-400 text-[11px]">(142 verified jobs)</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => alert(`Calling technician at +1 (555) 234-8901`)}
              className="p-2.5 rounded-xl bg-white dark:bg-[#18252a] border border-slate-200 dark:border-[#22353A] text-slate-700 dark:text-slate-300 hover:text-emerald-600 hover:border-emerald-500 transition-colors"
            >
              <Phone className="w-4 h-4" />
            </button>
          </div>

          {/* Live Progress Stepper */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0C1215] border border-slate-200 dark:border-[#22353A] space-y-3">
            <span className="text-[10px] font-mono uppercase font-bold text-slate-400 block tracking-wider">
              Service Journey Status
            </span>
            <div className="space-y-3 text-xs">
              <div className="flex items-center gap-3 text-emerald-700 dark:text-emerald-400 font-semibold">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                <span>Ticket Ingested &amp; Priority SLA Assigned</span>
              </div>
              <div className="flex items-center gap-3 text-emerald-700 dark:text-emerald-400 font-semibold">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                <span>Dispatched to {techName}</span>
              </div>
              <div className="flex items-center gap-3 text-sky-700 dark:text-cyan-400 font-bold">
                <Navigation className="w-4 h-4 shrink-0 animate-bounce" />
                <span>Technician En Route (Live GPS tracking active)</span>
              </div>
              <div className="flex items-center gap-3 text-slate-400">
                <Clock className="w-4 h-4 shrink-0" />
                <span>On-Site Diagnostics &amp; Component Replacement</span>
              </div>
              <div className="flex items-center gap-3 text-slate-400">
                <PenTool className="w-4 h-4 shrink-0" />
                <span>Digital Sign-Off &amp; SLA Fulfill</span>
              </div>
            </div>
          </div>

          {/* Customer Signature Pad Simulation */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0C1215] border border-slate-200 dark:border-[#22353A] space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
              <span className="flex items-center gap-1.5 font-mono">
                <PenTool className="w-3.5 h-3.5 text-emerald-600 dark:text-sage-300" />
                Customer Work Authorization Sign-Off
              </span>
              <span className="text-[10px] text-slate-400 font-mono">Digital Signature</span>
            </div>

            <div
              onClick={() => setIsSigned(!isSigned)}
              className="h-24 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 bg-white dark:bg-[#131D21] flex items-center justify-center cursor-pointer hover:border-emerald-500 transition-colors select-none"
            >
              {isSigned ? (
                <div className="text-center">
                  <span className="font-serif italic text-xl text-slate-900 dark:text-white">
                    {job.customerName || 'Facility Manager'}
                  </span>
                  <p className="text-[10px] font-mono text-emerald-600 dark:text-sage-300 mt-1">
                    ✓ Cryptographically Signed &bull; {new Date().toLocaleTimeString()}
                  </p>
                </div>
              ) : (
                <span className="text-xs text-slate-400 font-mono">
                  Click here to simulate Customer Signature
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-[#22353A] bg-slate-50 dark:bg-[#0C1215] flex items-center justify-between text-xs">
          <span className="text-[11px] text-slate-400 font-mono">FieldPulse Live Portal &bull; SSL 256-bit</span>
          <Button size="sm" variant="outline" onClick={onClose}>
            Close Simulator
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CustomerTrackingModal;
