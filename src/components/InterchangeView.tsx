import React, { useState } from 'react';
import { TransitInterchange, InterchangeBerth } from '../types/transit';
import { BusServiceBadge } from './BusServiceBadge';
import { Building2, TrainTrack, Accessibility, Search, MapPin, ChevronRight } from 'lucide-react';

interface InterchangeViewProps {
  interchanges: TransitInterchange[];
  onSelectService: (serviceNo: string) => void;
}

export const InterchangeView: React.FC<InterchangeViewProps> = ({
  interchanges,
  onSelectService,
}) => {
  const [selectedInterchangeId, setSelectedInterchangeId] = useState<string>(
    interchanges[0]?.id || ''
  );
  const [berthSearchQuery, setBerthSearchQuery] = useState<string>('');

  const currentInterchange =
    interchanges.find((i) => i.id === selectedInterchangeId) || interchanges[0];

  const filteredBerths = currentInterchange.berths.filter((berth: InterchangeBerth) => {
    if (!berthSearchQuery.trim()) return true;
    const q = berthSearchQuery.toLowerCase();
    return (
      berth.berthNumber.toLowerCase().includes(q) ||
      berth.destinationSummary.toLowerCase().includes(q) ||
      berth.services.some((s) => s.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-4">
      {/* Interchange selection tab strip */}
      <div className="bg-white p-3 rounded-xl border border-[#E5E5EB] shadow-xs">
        <div className="text-xs font-semibold text-[#82737F] mb-2 uppercase tracking-wide">
          Select Integrated Transport Hub / Interchange
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {interchanges.map((intc) => {
            const isSelected = intc.id === currentInterchange.id;
            return (
              <button
                key={intc.id}
                onClick={() => setSelectedInterchangeId(intc.id)}
                className={`p-2.5 rounded-lg text-left transition-all border ${
                  isSelected
                    ? 'bg-[#FFD6FA]/40 border-[#6E1D74] text-[#520059] shadow-xs'
                    : 'bg-[#F9F9FF] border-[#E5E5EB] text-[#171C24] hover:border-[#D4C1CF]'
                }`}
              >
                <div className="font-display font-bold text-xs sm:text-sm truncate">
                  {intc.name.replace(' Bus Interchange', '').replace(' Integrated Transport Hub', '')}
                </div>
                <div className="flex items-center gap-1 mt-1">
                  {intc.mrtLines.map((line) => (
                    <span
                      key={line.code}
                      style={{ backgroundColor: line.color }}
                      className="text-[10px] text-white font-bold px-1.5 py-0.2 rounded-xs"
                    >
                      {line.code}
                    </span>
                  ))}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Interchange Details Header */}
      <div className="bg-white p-4 sm:p-5 rounded-xl border border-[#E5E5EB] shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#F0F0F5]">
          <div>
            <div className="flex items-center gap-2">
              <Building2 className="text-[#6E1D74]" size={20} />
              <h2 className="font-display font-bold text-lg sm:text-xl text-[#171C24]">
                {currentInterchange.name}
              </h2>
            </div>
            <p className="text-xs text-[#50434E] mt-1 flex items-center gap-1">
              <MapPin size={13} className="text-[#82737F]" />
              {currentInterchange.address}
            </p>
          </div>

          {/* Connected MRT Lines */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-[#82737F] font-medium">MRT Connections:</span>
            {currentInterchange.mrtLines.map((line) => (
              <div
                key={line.code}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-white text-xs font-semibold shadow-xs"
                style={{ backgroundColor: line.color }}
              >
                <TrainTrack size={12} />
                <span>{line.code}</span>
                <span className="opacity-90 font-normal hidden md:inline">({line.name})</span>
              </div>
            ))}
          </div>
        </div>

        {/* Berth filter search bar */}
        <div className="mt-4 flex items-center gap-2">
          <div className="relative flex-1">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#82737F]"
            />
            <input
              type="text"
              value={berthSearchQuery}
              onChange={(e) => setBerthSearchQuery(e.target.value)}
              placeholder="Search by berth number, bus service (e.g. 147, 65) or destination..."
              className="w-full pl-9 pr-3 py-2 bg-[#F9F9FF] border border-[#E5E5EB] rounded-lg text-xs sm:text-sm focus:outline-none focus:border-[#6E1D74] focus:bg-white transition-colors"
            />
          </div>
          {berthSearchQuery && (
            <button
              onClick={() => setBerthSearchQuery('')}
              className="px-3 py-2 text-xs text-[#50434E] hover:text-[#171C24] font-medium"
            >
              Clear
            </button>
          )}
        </div>

        {/* Berths Directory Grid */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
          {filteredBerths.map((berth: InterchangeBerth) => (
            <div
              key={berth.berthNumber}
              className="p-3.5 rounded-lg border border-[#E5E5EB] bg-gradient-to-br from-white to-[#FAFBFD] hover:border-[#D4C1CF] transition-all"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-service font-bold text-sm text-[#520059] bg-[#F0EEF2] border border-[#E5E0E8] px-2.5 py-0.5 rounded-full">
                  {berth.berthNumber}
                </span>

                {berth.wheelchairFriendly && (
                  <span
                    className="inline-flex items-center gap-1 text-[11px] text-[#0065FF] font-medium"
                    title="Barrier-free Wheelchair Boarding"
                  >
                    <Accessibility size={13} />
                    <span>WAB Berth</span>
                  </span>
                )}
              </div>

              <div className="text-xs text-[#50434E] font-medium mb-3 min-h-[32px]">
                {berth.destinationSummary}
              </div>

              {/* Connecting Services clickable buttons */}
              <div className="flex items-center gap-1.5 flex-wrap pt-2 border-t border-[#F0F0F5]">
                <span className="text-[11px] text-[#82737F] font-medium">Buses:</span>
                {berth.services.map((svc) => (
                  <button
                    key={svc}
                    onClick={() => onSelectService(svc)}
                    className="cursor-pointer"
                    title={`View Service ${svc} route`}
                  >
                    <BusServiceBadge serviceNo={svc} size="sm" />
                  </button>
                ))}
              </div>
            </div>
          ))}

          {filteredBerths.length === 0 && (
            <div className="col-span-full py-8 text-center text-sm text-[#82737F]">
              No berths found matching &quot;{berthSearchQuery}&quot;
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
