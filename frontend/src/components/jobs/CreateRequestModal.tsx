import React, { useState } from 'react';
import { CreateServiceRequestRequest, JobPriority } from '../../types/job';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { X, Plus, AlertCircle, MapPin } from 'lucide-react';

interface CreateRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (dto: CreateServiceRequestRequest) => Promise<void>;
}

export const CreateRequestModal: React.FC<CreateRequestModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [address, setAddress] = useState('');
  const [latitude, setLatitude] = useState<number>(47.6062);
  const [longitude, setLongitude] = useState<number>(-122.3321);
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<JobPriority>('MEDIUM');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handlePresetLocation = (name: string, lat: number, lon: number, addr: string) => {
    setAddress(addr);
    setLatitude(lat);
    setLongitude(lon);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      setError(null);
      await onSubmit({
        customerName,
        customerEmail,
        customerPhone,
        address,
        latitude,
        longitude,
        description,
        priority,
      });
      onClose();
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || 'Failed to submit service request');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0C1215]/80 backdrop-blur-md animate-in fade-in duration-150">
      <div className="bg-[#131D21] border border-[#22353A] rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#22353A]">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Plus className="w-5 h-5 text-sage-300" />
              Ingest New Field Service Request
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Submit customer ticket for automated SLA assignment and geospatial dispatch triage
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-[#0C1215] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {error && (
            <div className="bg-rose-500/10 border border-rose-500/30 text-rose-300 p-3 rounded-lg text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          {/* Customer Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Customer Name"
              placeholder="e.g. Apex Data Center"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              required
            />
            <Input
              label="Customer Email"
              type="email"
              placeholder="facility.ops@apex.com"
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Contact Phone"
              placeholder="+1 (206) 555-0199"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              required
            />
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 font-mono">
                Priority Tier
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as JobPriority)}
                className="w-full rounded-lg bg-[#0C1215] border border-[#22353A] px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-sage-300 transition-all duration-80 font-mono"
              >
                <option value="LOW">LOW &bull; 24h Resolution SLA</option>
                <option value="MEDIUM">MEDIUM &bull; 8h Resolution SLA</option>
                <option value="HIGH">HIGH &bull; 4h Resolution SLA</option>
                <option value="CRITICAL">CRITICAL &bull; 2h Emergency SLA</option>
              </select>
            </div>
          </div>

          {/* Location & Presets */}
          <div className="space-y-2">
            <Input
              label="Worksite Address"
              placeholder="e.g. 1000 4th Ave, Seattle, WA 98104"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />

            <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-mono">
              <MapPin className="w-3.5 h-3.5 text-sage-300" />
              <span>Presets:</span>
              <button
                type="button"
                onClick={() =>
                  handlePresetLocation('Downtown Seattle', 47.6062, -122.3321, '700 5th Ave, Seattle, WA')
                }
                className="hover:underline text-sage-300"
              >
                Downtown
              </button>
              &bull;
              <button
                type="button"
                onClick={() =>
                  handlePresetLocation('Bellevue Tech Park', 47.6101, -122.2015, '10800 NE 8th St, Bellevue, WA')
                }
                className="hover:underline text-sage-300"
              >
                Bellevue
              </button>
              &bull;
              <button
                type="button"
                onClick={() =>
                  handlePresetLocation('Redmond Campus', 47.674, -122.1215, '15700 NE 39th St, Redmond, WA')
                }
                className="hover:underline text-sage-300"
              >
                Redmond
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <Input
                label="Latitude"
                type="number"
                step="0.0001"
                value={latitude}
                onChange={(e) => setLatitude(parseFloat(e.target.value) || 0)}
                required
              />
              <Input
                label="Longitude"
                type="number"
                step="0.0001"
                value={longitude}
                onChange={(e) => setLongitude(parseFloat(e.target.value) || 0)}
                required
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 font-mono">
              Service Request Details
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe symptoms, equipment tag, or failure mode..."
              required
              className="w-full rounded-xl bg-[#0C1215] border border-[#22353A] p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-sage-300 focus:border-sage-300 transition-all duration-80"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#22353A]">
            <Button type="button" variant="outline" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" isLoading={isSubmitting}>
              Submit Service Request
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
