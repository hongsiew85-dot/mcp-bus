import React, { useState } from 'react';
import { RouteDetail, RouteWaypoint } from '../types/transit';
import { BusServiceBadge } from './BusServiceBadge';
import { CrowdingBadge } from './CrowdingBadge';
import { X, Clock, Repeat, MapPin, Gauge, Bus, ArrowDown, Bell, Check } from 'lucide-react';

interface RouteInspectorModalProps {
  route: RouteDetail;
  initialStopCode?: string;
  onClose: () => void;
  onSelectStopCode?: (stopCode: string) => void;
}

export const RouteInspectorModal: React.FC<RouteInspectorModalProps> = ({
  route,
  initialStopCode,
  onClose,
  onSelectStopCode,
}) => {
  const [selectedDirection, setSelectedDirection] = useState<'dir1' | 'dir2'>('dir1');
  const [activeAlertStop, setActiveAlertStop] = useState<string | null>(null);

  const directionData =
    selectedDirection === 'dir1'
      ? route.direction1
      : route.direction2 || route.direction1;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl border border-[#E5E5EB] overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-[#520059] to-[#6E1D74] text-white flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <BusServiceBadge
              serviceNo={route.serviceNo}
              category={route.category}
              size="lg"
            />
            <div>
              <div className="text-xs uppercase tracking-wider text-[#FFD6FA] font-medium">
                {route.operator} · {route.category} Service
              </div>
              <h2 className="font-display font-bold text-lg sm:text-xl text-white">
                {directionData.origin} → {directionData.destination}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/20 text-white transition-colors"
            aria-label="Close route inspector"
          >
            <X size={20} />
          </button>
        </div>

        {/* Route Metadata strip */}
        <div className="px-4 py-2.5 bg-[#FAF9FB] border-b border-[#E5E5EB] flex items-center justify-between flex-wrap gap-2 text-xs text-[#50434E]">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <Clock size={13} className="text-[#6E1D74]" />
              {route.operatingHours}
            </span>
            <span className="flex items-center gap-1">
              <Repeat size={13} className="text-[#D9531E]" />
              Freq: {route.frequencyRange}
            </span>
          </div>

          {/* Direction toggle if direction 2 exists */}
          {route.direction2 && (
            <div className="flex items-center p-0.5 bg-[#EAEBF2] rounded-lg">
              <button
                onClick={() => setSelectedDirection('dir1')}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
                  selectedDirection === 'dir1'
                    ? 'bg-white text-[#520059] shadow-xs'
                    : 'text-[#50434E] hover:text-[#171C24]'
                }`}
              >
                Dir 1
              </button>
              <button
                onClick={() => setSelectedDirection('dir2')}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
                  selectedDirection === 'dir2'
                    ? 'bg-white text-[#520059] shadow-xs'
                    : 'text-[#50434E] hover:text-[#171C24]'
                }`}
              >
                Dir 2
              </button>
            </div>
          )}
        </div>

        {/* Live Active Buses on Route Banner */}
        <div className="px-4 py-2 bg-[#F0F3FF] border-b border-[#DFE2EF] flex items-center justify-between text-xs text-[#272C3C]">
          <span className="font-medium flex items-center gap-1.5">
            <Bus size={14} className="text-[#6E1D74]" />
            Live Fleet Tracking ({directionData.stops.filter((s) => s.hasActiveBus).length} active buses on route)
          </span>
          <span className="text-[11px] text-[#50434E]">Auto-refreshing GPS</span>
        </div>

        {/* Route progression list */}
        <div className="flex-1 overflow-y-auto p-4 divide-y divide-[#F0F0F5]">
          {directionData.stops.map((stop: RouteWaypoint, index: number) => {
            const isTarget = initialStopCode === stop.stopCode;
            const isFirst = index === 0;
            const isLast = index === directionData.stops.length - 1;

            return (
              <div
                key={stop.stopCode}
                className={`py-3 px-2 flex items-start gap-3 transition-colors rounded-lg ${
                  isTarget ? 'bg-[#FFD6FA]/20 border border-[#FFA9FD]' : 'hover:bg-[#FAF9FB]'
                }`}
              >
                {/* Timeline track node */}
                <div className="flex flex-col items-center pt-1 self-stretch shrink-0">
                  <div
                    className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center ${
                      isFirst || isLast
                        ? 'border-[#6E1D74] bg-[#6E1D74]'
                        : isTarget
                        ? 'border-[#D9531E] bg-[#D9531E]'
                        : 'border-[#82737F] bg-white'
                    }`}
                  >
                    {(isFirst || isLast) && <span className="w-1 h-1 bg-white rounded-full" />}
                  </div>
                  {!isLast && <div className="w-0.5 flex-1 bg-[#DFE2EF] my-1 min-h-[28px]" />}
                </div>

                {/* Stop Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-service text-xs font-semibold text-[#520059] bg-[#F0EEF2] px-1.5 py-0.5 rounded">
                      {stop.stopCode}
                    </span>
                    <span className="text-xs text-[#82737F]">Stage {stop.fareStage}</span>
                    <span className="text-xs text-[#82737F] tabular-nums">({stop.cumulativeKm} km)</span>
                  </div>

                  <h4 className="font-display font-semibold text-sm text-[#171C24] mt-0.5 truncate">
                    {stop.stopName}
                  </h4>
                  <p className="text-xs text-[#50434E] truncate">{stop.roadName}</p>

                  {/* Active Bus telemetry pill if bus is currently near this stop */}
                  {stop.hasActiveBus && stop.activeBusDetails && (
                    <div className="mt-2 inline-flex items-center gap-2 p-1.5 rounded-lg bg-[#FAF0FA] border border-[#EA8EEA] text-xs">
                      <div className="flex items-center gap-1 font-service font-semibold text-[#520059]">
                        <Bus size={13} className="text-[#6E1D74]" />
                        {stop.activeBusDetails.plateNumber}
                      </div>
                      <span className="text-[#82737F]">·</span>
                      <CrowdingBadge load={stop.activeBusDetails.load} size="sm" />
                      <span className="text-[#82737F]">·</span>
                      <span className="text-[11px] text-[#50434E] flex items-center gap-0.5">
                        <Gauge size={11} /> {stop.activeBusDetails.speedKmH} km/h
                      </span>
                    </div>
                  )}
                </div>

                {/* Quick Action: Set alert or jump to stop */}
                <div className="shrink-0 flex items-center gap-1 pt-1">
                  <button
                    onClick={() => {
                      setActiveAlertStop(
                        activeAlertStop === stop.stopCode ? null : stop.stopCode
                      );
                    }}
                    className={`p-1.5 rounded-md text-xs transition-colors ${
                      activeAlertStop === stop.stopCode
                        ? 'bg-[#00875A] text-white'
                        : 'text-[#82737F] hover:text-[#520059] hover:bg-[#F0EEF2]'
                    }`}
                    title="Alert me when bus is 2 stops away"
                    aria-label="Alert me"
                  >
                    {activeAlertStop === stop.stopCode ? <Check size={14} /> : <Bell size={14} />}
                  </button>

                  {onSelectStopCode && (
                    <button
                      onClick={() => {
                        onSelectStopCode(stop.stopCode);
                        onClose();
                      }}
                      className="px-2 py-1 text-xs font-medium text-[#6E1D74] hover:bg-[#F0EEF2] rounded-md transition-colors"
                    >
                      View
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-3 bg-[#FAF9FB] border-t border-[#E5E5EB] flex items-center justify-between text-xs text-[#50434E]">
          <span>Tap bell icon to simulate bus arrival alert</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-[#520059] text-white font-medium rounded-lg hover:bg-[#6E1D74] transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
