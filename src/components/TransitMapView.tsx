import React, { useState } from 'react';
import { BusStop } from '../types/transit';
import { BusServiceBadge } from './BusServiceBadge';
import { MapPin, TrainTrack, Layers, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

interface TransitMapViewProps {
  busStops: BusStop[];
  selectedStopId?: string;
  onSelectStop: (stop: BusStop) => void;
  onSelectService: (serviceNo: string, stop: BusStop) => void;
}

export const TransitMapView: React.FC<TransitMapViewProps> = ({
  busStops,
  selectedStopId,
  onSelectStop,
  onSelectService,
}) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'mrt' | 'bus'>('all');
  const [hoveredStop, setHoveredStop] = useState<BusStop | null>(null);

  // Geographic bounds conversion for Singapore schematic coordinates (approx lat 1.25 to 1.45, lng 103.65 to 104.0)
  // Map dimensions 800 x 480
  const convertCoords = (lat: number, lng: number) => {
    const minLng = 103.7;
    const maxLng = 103.98;
    const minLat = 1.25;
    const maxLat = 1.38;

    const x = ((lng - minLng) / (maxLng - minLng)) * 720 + 40;
    const y = (1 - (lat - minLat) / (maxLat - minLat)) * 380 + 50;
    return { x: Math.max(30, Math.min(770, x)), y: Math.max(30, Math.min(450, y)) };
  };

  const selectedStop = busStops.find((s) => s.id === selectedStopId);

  return (
    <div className="bg-white rounded-xl border border-[#E5E5EB] shadow-xs overflow-hidden">
      {/* Map Control Bar */}
      <div className="p-3 bg-[#FAFBFD] border-b border-[#F0F0F5] flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <MapPin size={18} className="text-[#6E1D74]" />
          <span className="font-display font-bold text-sm text-[#171C24]">
            Singapore Multimodal Transit Network Map
          </span>
        </div>

        {/* Filter controls */}
        <div className="flex items-center gap-1 p-0.5 bg-[#EAEDFA] rounded-lg">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
              activeFilter === 'all'
                ? 'bg-white text-[#520059] shadow-xs'
                : 'text-[#50434E] hover:text-[#171C24]'
            }`}
          >
            All Corridors
          </button>
          <button
            onClick={() => setActiveFilter('mrt')}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
              activeFilter === 'mrt'
                ? 'bg-white text-[#520059] shadow-xs'
                : 'text-[#50434E] hover:text-[#171C24]'
            }`}
          >
            Rail Interchanges
          </button>
          <button
            onClick={() => setActiveFilter('bus')}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
              activeFilter === 'bus'
                ? 'bg-white text-[#520059] shadow-xs'
                : 'text-[#50434E] hover:text-[#171C24]'
            }`}
          >
            Key Bus Hubs
          </button>
        </div>
      </div>

      {/* Interactive SVG Schematic Map */}
      <div className="relative w-full overflow-x-auto bg-[#F9F9FF] p-2 min-h-[420px] flex items-center justify-center">
        <svg
          viewBox="0 0 800 480"
          className="w-full max-w-[800px] h-auto select-none"
          style={{ minWidth: '600px' }}
        >
          {/* Background Singapore Coastline hint */}
          <path
            d="M 60 160 Q 180 80 420 100 T 740 180 Q 720 340 560 380 T 260 400 Q 120 370 60 160 Z"
            fill="#F0F3FF"
            stroke="#DFE2EF"
            strokeWidth="1.5"
            strokeDasharray="4 4"
          />

          {/* Major MRT Schematic Lines */}
          {activeFilter !== 'bus' && (
            <g id="mrt-lines" opacity="0.85">
              {/* East-West Line (Green) */}
              <path
                d="M 90 280 L 150 250 L 320 280 L 480 300 L 680 230 L 730 220"
                stroke="#009530"
                strokeWidth="5"
                strokeLinecap="round"
                fill="none"
              />
              {/* North-South Line (Red) */}
              <path
                d="M 380 90 L 400 160 L 420 260 L 400 350 L 420 400"
                stroke="#D42E12"
                strokeWidth="5"
                strokeLinecap="round"
                fill="none"
              />
              {/* North-East Line (Purple) */}
              <path
                d="M 340 390 L 410 320 L 480 230 L 580 140"
                stroke="#9900AA"
                strokeWidth="4"
                strokeLinecap="round"
                fill="none"
              />
              {/* Downtown Line (Blue) */}
              <path
                d="M 220 180 L 350 240 L 450 310 L 600 280 L 690 240"
                stroke="#005EC4"
                strokeWidth="4"
                strokeLinecap="round"
                fill="none"
              />
              {/* Circle Line (Orange) */}
              <ellipse
                cx="420"
                cy="290"
                rx="160"
                ry="100"
                stroke="#FA9E0D"
                strokeWidth="3.5"
                strokeDasharray="8 4"
                fill="none"
              />
            </g>
          )}

          {/* MRT Line Legend in corner */}
          <g transform="translate(40, 390)">
            <rect width="180" height="75" rx="6" fill="white" fillOpacity="0.9" stroke="#E5E5EB" />
            <text x="10" y="18" fontSize="10" fontWeight="bold" fill="#171C24" fontFamily="Work Sans">
              MRT RAIL NETWORK
            </text>
            <circle cx="16" cy="32" r="4" fill="#009530" />
            <text x="26" y="35" fontSize="9" fill="#50434E">EWL (East-West)</text>
            <circle cx="16" cy="46" r="4" fill="#D42E12" />
            <text x="26" y="49" fontSize="9" fill="#50434E">NSL (North-South)</text>
            <circle cx="16" cy="60" r="4" fill="#9900AA" />
            <text x="26" y="63" fontSize="9" fill="#50434E">NEL (North-East)</text>
            <circle cx="106" cy="32" r="4" fill="#005EC4" />
            <text x="116" y="35" fontSize="9" fill="#50434E">DTL (Downtown)</text>
            <circle cx="106" cy="46" r="4" fill="#FA9E0D" />
            <text x="116" y="49" fontSize="9" fill="#50434E">CCL (Circle)</text>
          </g>

          {/* Bus Stops & Interchanges Nodes */}
          {busStops.map((stop) => {
            const pos = convertCoords(stop.coordinates.lat, stop.coordinates.lng);
            const isSelected = stop.id === selectedStopId;
            const isHovered = hoveredStop?.id === stop.id;

            return (
              <g
                key={stop.id}
                transform={`translate(${pos.x}, ${pos.y})`}
                className="cursor-pointer transition-transform"
                onClick={() => onSelectStop(stop)}
                onMouseEnter={() => setHoveredStop(stop)}
                onMouseLeave={() => setHoveredStop(null)}
              >
                {/* Ripple ring if selected */}
                {isSelected && (
                  <circle
                    r="18"
                    fill="#6E1D74"
                    fillOpacity="0.2"
                    className="animate-ping"
                  />
                )}

                {/* Node marker */}
                <circle
                  r={stop.isInterchange ? 9 : 7}
                  fill={stop.isInterchange ? '#6E1D74' : isSelected ? '#D9531E' : '#FFFFFF'}
                  stroke={stop.isInterchange ? '#FFFFFF' : '#6E1D74'}
                  strokeWidth="2.5"
                  className="shadow-md"
                />

                {stop.isInterchange && (
                  <circle r="3" fill="#FFFFFF" />
                )}

                {/* Label text */}
                <text
                  y={stop.isInterchange ? -13 : 18}
                  textAnchor="middle"
                  fontSize="10"
                  fontWeight={isSelected || isHovered ? 'bold' : '600'}
                  fill={isSelected ? '#520059' : '#171C24'}
                  fontFamily="Space Grotesk"
                  className="pointer-events-none drop-shadow-xs"
                >
                  {stop.name.replace(' Bus Interchange', ' Int').replace('Exit B', '').replace('Exit C', '')}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Selected Stop Quick Info Strip */}
      {selectedStop && (
        <div className="p-4 bg-white border-t border-[#F0F0F5] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="font-service font-bold text-xs text-[#520059] bg-[#FFD6FA]/60 border border-[#FFA9FD] px-2 py-0.5 rounded">
              {selectedStop.code}
            </span>
            <div>
              <div className="font-display font-bold text-sm text-[#171C24]">
                {selectedStop.name}
              </div>
              <div className="text-xs text-[#50434E]">{selectedStop.road} · {selectedStop.nearbyMrt}</div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs text-[#82737F]">Available buses:</span>
            {selectedStop.services.map((svc) => (
              <button
                key={svc.serviceNo}
                onClick={() => onSelectService(svc.serviceNo, selectedStop)}
                className="cursor-pointer"
              >
                <BusServiceBadge serviceNo={svc.serviceNo} category={svc.category} size="sm" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
