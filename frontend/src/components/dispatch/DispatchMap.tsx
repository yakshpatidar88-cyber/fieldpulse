import React, { useEffect } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMap,
} from 'react-leaflet';
import L from 'leaflet';
import { ScoredCandidate } from '../../types/dispatch';

// Custom SVG-based Leaflet Icons so default asset URLs don't break in Vite builds
const jobIcon = L.divIcon({
  className: 'custom-job-marker',
  html: `
    <div style="
      background-color: #f43f5e;
      color: white;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      border: 3px solid #ffffff;
      box-shadow: 0 4px 12px rgba(244, 63, 94, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      font-size: 14px;
    ">
      📍
    </div>
  `,
  iconSize: [32, 32],
  iconAnchor: [16, 16],
  popupAnchor: [0, -16],
});

const technicianIcon = (isSelected: boolean, rank?: number) =>
  L.divIcon({
    className: 'custom-tech-marker',
    html: `
      <div style="
        background-color: ${isSelected ? '#0d9488' : '#3b82f6'};
        color: white;
        width: ${isSelected ? '36px' : '28px'};
        height: ${isSelected ? '36px' : '28px'};
        border-radius: 50%;
        border: 2px solid #ffffff;
        box-shadow: 0 4px 10px rgba(0,0,0,0.4);
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 700;
        font-size: ${isSelected ? '13px' : '11px'};
        transition: all 0.2s ease;
      ">
        ${rank ? `#${rank}` : '🔧'}
      </div>
    `,
    iconSize: isSelected ? [36, 36] : [28, 28],
    iconAnchor: isSelected ? [18, 18] : [14, 14],
    popupAnchor: [0, -14],
  });

interface AutoRecenterProps {
  jobLat: number;
  jobLng: number;
  selectedCandidate?: ScoredCandidate | null;
}

const AutoRecenter: React.FC<AutoRecenterProps> = ({
  jobLat,
  jobLng,
  selectedCandidate,
}) => {
  const map = useMap();

  useEffect(() => {
    if (selectedCandidate) {
      const bounds = L.latLngBounds([
        [jobLat, jobLng],
        [selectedCandidate.currentLatitude, selectedCandidate.currentLongitude],
      ]);
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 });
    } else {
      map.setView([jobLat, jobLng], 12);
    }
  }, [jobLat, jobLng, selectedCandidate, map]);

  return null;
};

interface DispatchMapProps {
  jobLatitude: number;
  jobLongitude: number;
  jobAddress: string;
  jobNumber: string;
  candidates: ScoredCandidate[];
  selectedCandidate: ScoredCandidate | null;
  onSelectCandidate: (candidate: ScoredCandidate) => void;
  className?: string;
}

export const DispatchMap: React.FC<DispatchMapProps> = ({
  jobLatitude,
  jobLongitude,
  jobAddress,
  jobNumber,
  candidates,
  selectedCandidate,
  onSelectCandidate,
  className = '',
}) => {
  return (
    <div className={`relative rounded-xl overflow-hidden border border-slate-800 shadow-xl ${className}`}>
      <MapContainer
        center={[jobLatitude, jobLongitude]}
        zoom={12}
        scrollWheelZoom={true}
        className="w-full h-full min-h-[420px] bg-slate-900"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <AutoRecenter
          jobLat={jobLatitude}
          jobLng={jobLongitude}
          selectedCandidate={selectedCandidate}
        />

        {/* Job Site Destination Marker */}
        <Marker position={[jobLatitude, jobLongitude]} icon={jobIcon}>
          <Popup>
            <div className="p-1 font-sans text-slate-900">
              <span className="font-bold text-xs text-rose-600 block mb-0.5">
                FIELD SERVICE SITE
              </span>
              <p className="font-semibold text-sm">{jobNumber}</p>
              <p className="text-xs text-slate-600 mt-0.5">{jobAddress}</p>
            </div>
          </Popup>
        </Marker>

        {/* Candidate Technician Markers */}
        {candidates.map((candidate, index) => {
          const isSelected = selectedCandidate?.technicianId === candidate.technicianId;
          return (
            <Marker
              key={candidate.technicianId}
              position={[candidate.currentLatitude, candidate.currentLongitude]}
              icon={technicianIcon(isSelected, index + 1)}
              eventHandlers={{
                click: () => onSelectCandidate(candidate),
              }}
            >
              <Popup>
                <div className="p-1 font-sans text-slate-900">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="bg-teal-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                      Rank #{index + 1}
                    </span>
                    <span className="font-bold text-xs">{candidate.fullName}</span>
                  </div>
                  <p className="text-xs text-slate-600">
                    Distance: <strong>{candidate.distanceKm.toFixed(1)} km</strong>
                  </p>
                  <p className="text-xs text-slate-600">
                    Match Score: <strong>{candidate.totalScore.toFixed(1)} / 100</strong>
                  </p>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Active Load: {candidate.activeJobsCount} / {candidate.maxConcurrentJobs}
                  </p>
                </div>
              </Popup>
            </Marker>
          );
        })}

        {/* Route Line Connecting Job Site to Selected Technician */}
        {selectedCandidate && (
          <Polyline
            positions={[
              [jobLatitude, jobLongitude],
              [selectedCandidate.currentLatitude, selectedCandidate.currentLongitude],
            ]}
            pathOptions={{
              color: '#0d9488',
              weight: 3,
              dashArray: '6, 8',
              opacity: 0.8,
            }}
          />
        )}
      </MapContainer>

      {/* Map Legend Overlay */}
      <div className="absolute top-3 right-3 bg-slate-900/90 backdrop-blur border border-slate-700/70 rounded-lg p-2.5 shadow-lg text-xs z-[1000] space-y-1.5">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-rose-500 border border-white" />
          <span className="text-slate-200 text-[11px]">Job Location</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-teal-600 border border-white" />
          <span className="text-slate-200 text-[11px]">Selected Technician</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-blue-500 border border-white" />
          <span className="text-slate-200 text-[11px]">Candidate Fleet</span>
        </div>
      </div>
    </div>
  );
};
