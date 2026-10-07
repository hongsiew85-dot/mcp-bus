import React from 'react';
import { NextBus } from '../types/transit';
import { CrowdingBadge, WabBadge } from './CrowdingBadge';
import { Layers, ArrowRight } from 'lucide-react';

interface EtaTrackerProps {
  nextBus: NextBus;
  nextBus2?: NextBus;
  nextBus3?: NextBus;
  compact?: boolean;
}

export const BusTimingSlot: React.FC<{
  bus?: NextBus;
  slotIndex: number;
  compact?: boolean;
}> = ({ bus, slotIndex, compact = false }) => {
  if (!bus) {
    return (
      <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-[#F7F7FA] border border-dashed border-[#E5E5EB] min-w-[70px] min-h-[58px] opacity-40">
        <span className="font-service text-xs text-[#82737F]">-</span>
      </div>
    );
  }

  const isArriving = bus.etaMinutes <= 0;
  const timingText = isArriving ? 'Arr' : `${bus.etaMinutes}m`;

  return (
    <div
      className={`flex flex-col items-center justify-between p-2 rounded-lg border transition-all ${
        isArriving
          ? 'bg-[#F2FCF5] border-[#B7E1CD] shadow-xs'
          : slotIndex === 1
          ? 'bg-white border-[#E5E5EB]'
          : 'bg-[#FAFBFD] border-[#EAEBF2]'
      } ${compact ? 'min-w-[62px]' : 'min-w-[74px]'}`}
    >
      {/* Top row: Timing with Space Grotesk */}
      <div className="flex items-center gap-1">
        <span
          className={`font-service font-bold tabular-nums tracking-tight ${
            isArriving
              ? 'text-[#00875A] text-lg animate-pulse-subtle'
              : 'text-[#171C24] text-base'
          }`}
        >
          {timingText}
        </span>

        {/* Bus Deck Silhouette Indicator */}
        {bus.type === 'DD' && (
          <span
            className="flex flex-col gap-[1.5px] p-0.5 rounded bg-[#F0F2F8] text-[#50434E]"
            title="Double Decker Bus (DD)"
          >
            <span className="w-2.5 h-[3px] bg-[#6E1D74] rounded-[1px]" />
            <span className="w-2.5 h-[3px] bg-[#6E1D74] rounded-[1px]" />
          </span>
        )}
        {bus.type === 'BD' && (
          <span
            className="flex items-center gap-[1px] p-0.5 rounded bg-[#F0F2F8] text-[#50434E]"
            title="Bendy Articulated Bus"
          >
            <span className="w-2 h-[4px] bg-[#D9531E] rounded-[1px]" />
            <span className="w-1.5 h-[4px] bg-[#D9531E] rounded-[1px]" />
          </span>
        )}
      </div>

      {/* Bottom row: Load & accessibility badge */}
      <div className="flex items-center gap-1 mt-1">
        <CrowdingBadge load={bus.load} showText={!compact} size="sm" />
        {bus.wab && <WabBadge size="sm" />}
      </div>
    </div>
  );
};

export const EtaTracker: React.FC<EtaTrackerProps> = ({
  nextBus,
  nextBus2,
  nextBus3,
  compact = false,
}) => {
  return (
    <div className="flex items-center gap-1.5">
      <BusTimingSlot bus={nextBus} slotIndex={1} compact={compact} />
      <BusTimingSlot bus={nextBus2} slotIndex={2} compact={compact} />
      <BusTimingSlot bus={nextBus3} slotIndex={3} compact={compact} />
    </div>
  );
};
