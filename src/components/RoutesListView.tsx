import React, { useState } from 'react';
import { ROUTE_CATALOG } from '../data/transitData';
import { RouteDetail } from '../types/transit';
import { BusServiceBadge } from './BusServiceBadge';
import { Search, Clock, Repeat, ArrowRight, Bus } from 'lucide-react';

interface RoutesListViewProps {
  onSelectRoute: (serviceNo: string) => void;
}

export const RoutesListView: React.FC<RoutesListViewProps> = ({ onSelectRoute }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'All' | 'Trunk' | 'Express' | 'Feeder'>('All');

  const routes = Object.values(ROUTE_CATALOG);

  const filteredRoutes = routes.filter((route: RouteDetail) => {
    const matchesSearch =
      route.serviceNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      route.origin.toLowerCase().includes(searchQuery.toLowerCase()) ||
      route.destination.toLowerCase().includes(searchQuery.toLowerCase()) ||
      route.operator.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === 'All' || route.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-4">
      {/* Route Directory Search & Filters */}
      <div className="bg-white p-4 rounded-xl border border-[#E5E5EB] shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="font-display font-bold text-lg text-[#171C24]">
              Public Bus Route Directory
            </h2>
            <p className="text-xs text-[#50434E]">
              Browse SBS Transit, SMRT, Tower Transit & Go-Ahead services
            </p>
          </div>

          {/* Category filter segmented control */}
          <div className="flex items-center p-0.5 bg-[#EAEDFA] rounded-lg">
            {(['All', 'Trunk', 'Express', 'Feeder'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
                  selectedCategory === cat
                    ? 'bg-white text-[#520059] shadow-xs'
                    : 'text-[#50434E] hover:text-[#171C24]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Search input field */}
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#82737F]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search service number (e.g. 147, 65), destination, or operator..."
            className="w-full pl-9 pr-3 py-2 bg-[#F9F9FF] border border-[#E5E5EB] rounded-lg text-xs sm:text-sm focus:outline-none focus:border-[#6E1D74] focus:bg-white transition-colors"
          />
        </div>

        {/* Quick popular service buttons */}
        <div className="flex items-center gap-1.5 flex-wrap pt-1 text-xs text-[#82737F]">
          <span>Popular routes:</span>
          {['147', '65', '190', '7', '502'].map((s) => (
            <button
              key={s}
              onClick={() => onSelectRoute(s)}
              className="font-service font-bold text-[#520059] bg-[#FFD6FA]/50 border border-[#FFA9FD] px-2 py-0.5 rounded-full hover:bg-[#FFD6FA] transition-colors"
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Routes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {filteredRoutes.map((route: RouteDetail) => (
          <div
            key={route.serviceNo}
            onClick={() => onSelectRoute(route.serviceNo)}
            className="p-4 bg-white rounded-xl border border-[#E5E5EB] shadow-xs hover:border-[#D4C1CF] transition-all cursor-pointer group"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <BusServiceBadge
                  serviceNo={route.serviceNo}
                  category={route.category}
                  size="lg"
                />
                <div>
                  <div className="text-xs text-[#82737F]">
                    {route.operator} · {route.category}
                  </div>
                  <h3 className="font-display font-bold text-sm text-[#171C24] group-hover:text-[#6E1D74] transition-colors">
                    {route.origin} <ArrowRight size={13} className="inline mx-0.5 text-[#82737F]" /> {route.destination}
                  </h3>
                </div>
              </div>

              <span className="text-xs font-semibold text-[#6E1D74] opacity-0 group-hover:opacity-100 transition-opacity">
                Inspect →
              </span>
            </div>

            <div className="mt-3 pt-3 border-t border-[#F0F0F5] flex items-center justify-between text-xs text-[#50434E]">
              <span className="flex items-center gap-1">
                <Clock size={12} className="text-[#6E1D74]" />
                {route.operatingHours}
              </span>
              <span className="flex items-center gap-1">
                <Repeat size={12} className="text-[#D9531E]" />
                Freq: {route.frequencyRange}
              </span>
              <span className="font-service text-[11px] text-[#82737F]">
                {route.direction1.stops.length} stops
              </span>
            </div>
          </div>
        ))}

        {filteredRoutes.length === 0 && (
          <div className="col-span-full py-12 text-center text-sm text-[#82737F] bg-white rounded-xl border border-[#E5E5EB]">
            No services found matching &quot;{searchQuery}&quot;
          </div>
        )}
      </div>
    </div>
  );
};
