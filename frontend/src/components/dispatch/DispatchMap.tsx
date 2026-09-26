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
import { useTheme } from '../../context/ThemeContext';

// High-contrast Tactical Map Markers for CartoDB Dark Matter / Positron
const jobIcon = L.divIcon({
  className: 'custom-job-marker',
  html: `
    <div style="
      background-color: #E11D48;
      color: #ffffff;
      width: 34px;
      height: 34px;
      border-radius: 50%;
      border: 2px solid #ffffff;
      box-shadow: 0 2px 10px rgba(225, 29, 72, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      font-size: 15px;
    ">
      📍
    </div>
  `,
  iconSize: [34, 34],
  iconAnchor: [17, 17],
  popupAnchor: [0, -17],
});

const technicianIcon = (isSelected: boolean, isDark: boolean, rank?: number) =>
  L.divIcon({
    className: 'custom-tech-marker',
    html: `
      <div style="
        background-color: ${
          isSelected
            ? isDark ? '#AFD19B' : '#15803D'
            : isDark ? '#131D21' : '#FFFFFF'
        };
        color: ${
          isSelected
            ? isDark ? '#0C1215' : '#FFFFFF'
            : isDark ? '#AFD19B' : '#15803D'
        };
        width: ${isSelected ? '38px' : '30px'};
        height: ${isSelected ? '38px' : '30px'};
        border-radius: 50%;
        border: 2px solid ${
          isSelected
            ? '#FFFFFF'
            : isDark ? '#22353A' : '#CBD5E1'
        };
        box-shadow: ${
          isSelected
            ? isDark ? '0 0 16px rgba(175, 209, 155, 0.8)' : '0 4px 12px rgba(21, 128, 61, 0.4)'
            : '0 2px 6px rgba(0,0,0,0.15)'
        };
        display: flex;
        align-items: center;
        justify-content: center;
        font-family: monospace;
        font-weight: 800;
        font-size: ${isSelected ? '13px' : '11px'};
        transition: all 0.1s ease;
      ">
        ${rank ? `#${rank}` : '🔧'}
      </div>
    `,
    iconSize: isSelected ? [38, 38] : [30, 30],
    iconAnchor: isSelected ? [19, 19] : [15, 15],
    popupAnchor: [0, -15],
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
      map.fitBounds(bounds, { padding: [60, 60], maxZoom: 14 });
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
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const tileUrl = isDark
    ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
    : 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';

  return (
    <div className={`relative w-full h-full rounded-2xl overflow-hidden border border-slate-200 dark:border-[#22353A] shadow-xl ${className}`}>
      <MapContainer
        key={theme}
        center={[jobLatitude, jobLongitude]}
        zoom={12}
        scrollWheelZoom={true}
        className={`w-full h-full min-h-[580px] ${isDark ? 'bg-[#0C1215]' : 'bg-[#E2E8F0]'}`}
      >
        {/* Dynamic Basemap: CartoDB Positron for Light, Dark Matter for Dark */}
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CARTO</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url={tileUrl}
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
              <span className="font-bold text-[10px] uppercase font-mono text-rose-600 block mb-0.5">
                FIELD SERVICE SITE
              </span>
              <p className="font-mono font-bold text-sm">{jobNumber}</p>
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
              icon={technicianIcon(isSelected, isDark, index + 1)}
              eventHandlers={{
                click: () => onSelectCandidate(candidate),
              }}
            >
              <Popup>
                <div className="p-1 font-sans text-slate-900">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-mono font-bold px-1.5 py-0.5 rounded">
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
              color: isDark ? '#AFD19B' : '#15803D',
              weight: 3.5,
              dashArray: '6, 8',
              opacity: 0.95,
            }}
          />
        )}
      </MapContainer>

      {/* Tactical Map HUD Legend */}
      <div className="absolute top-3 left-3 bg-white/90 dark:bg-[#131D21]/90 backdrop-blur-md border border-slate-200 dark:border-[#22353A] rounded-xl p-2.5 shadow-xl text-xs z-[1000] space-y-1.5">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-xs" />
          <span className="text-slate-700 dark:text-slate-300 text-[11px] font-mono font-medium">Job Site</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 dark:bg-sage-300 shadow-xs" />
          <span className="text-slate-700 dark:text-slate-300 text-[11px] font-mono font-medium">Selected Tech</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-[#22353A] border border-slate-400 dark:border-slate-500" />
          <span className="text-slate-700 dark:text-slate-300 text-[11px] font-mono font-medium">Candidate Fleet</span>
        </div>
      </div>
    </div>
  );
};

export default DispatchMap;
