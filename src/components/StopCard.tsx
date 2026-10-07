import React from 'react';
import { BusStop, BusArrivalData } from '../types/transit';
import { BusServiceBadge } from './BusServiceBadge';
import { EtaTracker } from './EtaTracker';
import { Bookmark, BookmarkCheck, Navigation, ChevronRight, TrainTrack, MapPin } from 'lucide-react';

interface StopCardProps {
  stop: BusStop;
  isBookmarked: boolean;
  onToggleBookmark: (stopId: string) => void;
  onSelectService: (serviceNo: string, stop: BusStop) => void;
  onOpenMapLocation?: (stop: BusStop) => void;
}

export const StopCard: React.FC<StopCardProps> = ({
  stop,
  isBookmarked,
  onToggleBookmark,
  onSelectService,
  onOpenMapLocation,
}) => {
  return (
    <article className="bg-white rounded-xl border border-[#E5E5EB] shadow-xs hover:border-[#D4C1CF] transition-all overflow-hidden">
      {/* Stop Card Header */}
      <div className="p-4 bg-gradient-to-r from-white to-[#FAFBFD] border-b border-[#F0F0F5] flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            {/* 5-digit bus stop code badge */}
            <span className="font-service font-semibold text-xs tracking-wider text-[#520059] bg-[#FFD6FA]/60 border border-[#FFA9FD]/80 px-2 py-0.5 rounded-md">
              {stop.code}
            </span>

            {/* Road name */}
            <span className="text-xs font-medium text-[#50434E] truncate">
              {stop.road}
            </span>

            {stop.nearbyMrt && (
              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#272C3C] bg-[#EAEDFA] px-2 py-0.5 rounded-md">
                <TrainTrack size={12} className="text-[#6E1D74]" />
                {stop.nearbyMrt}
              </span>
            )}
          </div>

          <h3 className="font-display font-bold text-base text-[#171C24] leading-snug truncate">
            {stop.name}
          </h3>
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-1 shrink-0">
          {onOpenMapLocation && (
            <button
              onClick={() => onOpenMapLocation(stop)}
              className="p-2 text-[#50434E] hover:text-[#6E1D74] hover:bg-[#F0EEF2] rounded-lg transition-colors"
              title="Locate on map"
              aria-label="Locate on map"
            >
              <MapPin size={17} />
            </button>
          )}

          <button
            onClick={() => onToggleBookmark(stop.id)}
            className={`p-2 rounded-lg transition-colors ${
              isBookmarked
                ? 'text-[#D9531E] bg-[#FFDBCF]/40 hover:bg-[#FFDBCF]/70'
                : 'text-[#82737F] hover:text-[#520059] hover:bg-[#F0EEF2]'
            }`}
            title={isBookmarked ? 'Remove bookmark' : 'Bookmark bus stop'}
            aria-label={isBookmarked ? 'Remove bookmark' : 'Bookmark bus stop'}
          >
            {isBookmarked ? (
              <BookmarkCheck size={18} className="fill-[#D9531E]" />
            ) : (
              <Bookmark size={18} />
            )}
          </button>
        </div>
      </div>

      {/* Services List separated by hairline dividers */}
      <div className="divide-y divide-[#F0F0F5]">
        {stop.services.map((service) => (
          <div
            key={service.serviceNo}
            onClick={() => onSelectService(service.serviceNo, stop)}
            className="p-3.5 flex items-center justify-between gap-3 hover:bg-[#FAF9FB] transition-colors cursor-pointer group"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                onSelectService(service.serviceNo, stop);
              }
            }}
          >
            {/* Left: Service badge & destination */}
            <div className="flex items-center gap-3 min-w-0">
              <BusServiceBadge
                serviceNo={service.serviceNo}
                category={service.category}
                size="md"
              />

              <div className="min-w-0">
                <div className="flex items-center gap-1.5 text-xs text-[#50434E]">
                  <span className="font-medium truncate max-w-[150px] sm:max-w-[200px]">
                    to {service.destinationName}
                  </span>
                </div>
                <div className="text-[11px] text-[#82737F] flex items-center gap-1 mt-0.5">
                  <span>{service.operator}</span>
                  <span>·</span>
                  <span className="text-[#6E1D74] group-hover:underline inline-flex items-center gap-0.5">
                    Route info <ChevronRight size={11} />
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Real-time arrivals tracker */}
            <div className="shrink-0 flex items-center gap-1.5">
              <EtaTracker
                nextBus={service.nextBus}
                nextBus2={service.nextBus2}
                nextBus3={service.nextBus3}
              />
            </div>
          </div>
        ))}
      </div>
    </article>
  );
};
