/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  INITIAL_BUS_STOPS,
  ROUTE_CATALOG,
  TRANSIT_INTERCHANGES,
  SERVICE_ALERTS,
} from './data/transitData';
import { BusStop, RouteDetail } from './types/transit';
import { Header } from './components/Header';
import { StopCard } from './components/StopCard';
import { RouteInspectorModal } from './components/RouteInspectorModal';
import { InterchangeView } from './components/InterchangeView';
import { TransitMapView } from './components/TransitMapView';
import { FareCalculatorView } from './components/FareCalculatorView';
import { ServiceAlertsBanner } from './components/ServiceAlertsBanner';
import { RoutesListView } from './components/RoutesListView';
import { MobileBottomNav } from './components/MobileBottomNav';
import {
  Search,
  Bookmark,
  Building2,
  TrainTrack,
  Bus,
  Wifi,
  Battery,
  Signal,
  MapPin,
  Clock,
  Sparkles,
  Info,
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<
    'stops' | 'routes' | 'interchanges' | 'map' | 'fares' | 'alerts'
  >('stops');

  const [busStops, setBusStops] = useState<BusStop[]>(INITIAL_BUS_STOPS);
  const [searchQuery, setSearchQuery] = useState('');
  const [stopFilter, setStopFilter] = useState<'all' | 'saved' | 'interchange' | 'mrt'>('all');

  // Bookmarked bus stop IDs
  const [bookmarkedStopIds, setBookmarkedStopIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('sg_transit_bookmarks');
      return saved ? JSON.parse(saved) : ['B01112', 'B28009'];
    } catch {
      return ['B01112', 'B28009'];
    }
  });

  // Selected route for inspector modal
  const [inspectedRouteNo, setInspectedRouteNo] = useState<string | null>(null);
  const [inspectedStopCode, setInspectedStopCode] = useState<string | undefined>(undefined);

  // Selected stop for map locator
  const [selectedMapStopId, setSelectedMapStopId] = useState<string | undefined>(undefined);

  // Mobile Device Mockup vs Desktop Dashboard mode
  const [isMobileDeviceView, setIsMobileDeviceView] = useState<boolean>(false);

  // Live timer telemetry simulation
  const [lastUpdatedSecondsAgo, setLastUpdatedSecondsAgo] = useState(4);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Save bookmarks
  useEffect(() => {
    try {
      localStorage.setItem('sg_transit_bookmarks', JSON.stringify(bookmarkedStopIds));
    } catch (e) {
      console.error(e);
    }
  }, [bookmarkedStopIds]);

  // Live telemetry timer (seconds elapsed counter + simulated ETA countdown)
  useEffect(() => {
    const timer = setInterval(() => {
      setLastUpdatedSecondsAgo((prev) => {
        if (prev >= 25) {
          // Trigger a subtle data step
          triggerLiveTelemetryUpdate();
          return 0;
        }
        return prev + 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const triggerLiveTelemetryUpdate = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setBusStops((prevStops) =>
        prevStops.map((stop) => ({
          ...stop,
          services: stop.services.map((svc) => {
            // Randomly simulate real progression
            const nextMinutes = svc.nextBus.etaMinutes <= 0 ? 0 : svc.nextBus.etaMinutes;
            return {
              ...svc,
              nextBus: {
                ...svc.nextBus,
                etaMinutes: nextMinutes,
              },
            };
          }),
        }))
      );
      setLastUpdatedSecondsAgo(0);
      setIsRefreshing(false);
    }, 400);
  };

  const handleToggleBookmark = (stopId: string) => {
    setBookmarkedStopIds((prev) =>
      prev.includes(stopId) ? prev.filter((id) => id !== stopId) : [...prev, stopId]
    );
  };

  const handleSelectService = (serviceNo: string, stop?: BusStop) => {
    setInspectedRouteNo(serviceNo);
    if (stop) {
      setInspectedStopCode(stop.code);
    }
  };

  const handleOpenMapLocation = (stop: BusStop) => {
    setSelectedMapStopId(stop.id);
    setActiveTab('map');
  };

  // Filtered bus stops
  const filteredBusStops = busStops.filter((stop) => {
    // Search query matches stop code, stop name, road, or service number
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      stop.code.toLowerCase().includes(q) ||
      stop.name.toLowerCase().includes(q) ||
      stop.road.toLowerCase().includes(q) ||
      stop.services.some((s) => s.serviceNo.toLowerCase().includes(q));

    // Category filter
    let matchesCategory = true;
    if (stopFilter === 'saved') {
      matchesCategory = bookmarkedStopIds.includes(stop.id);
    } else if (stopFilter === 'interchange') {
      matchesCategory = !!stop.isInterchange;
    } else if (stopFilter === 'mrt') {
      matchesCategory = !!stop.nearbyMrt;
    }

    return matchesSearch && matchesCategory;
  });

  const inspectedRouteDetail = inspectedRouteNo
    ? ROUTE_CATALOG[inspectedRouteNo] || {
        serviceNo: inspectedRouteNo,
        operator: 'SBS Transit',
        category: 'Trunk',
        origin: 'Interchange A',
        destination: 'Interchange B',
        operatingHours: '05:30 - 23:45',
        frequencyRange: '6 - 12 mins',
        direction1: {
          origin: 'Direction 1',
          destination: 'Direction 2',
          stops: [
            { stopCode: '01112', stopName: 'Opp Orchard Stn/ION', roadName: 'Orchard Turn', fareStage: 1, cumulativeKm: 0.0 },
            { stopCode: '08057', stopName: 'Dhoby Ghaut Stn Exit B', roadName: 'Orchard Rd', fareStage: 3, cumulativeKm: 2.1 },
            { stopCode: '28009', stopName: 'Jurong East Int', roadName: 'Jurong Gateway Rd', fareStage: 12, cumulativeKm: 14.5 },
          ],
        },
      }
    : null;

  // Main interactive screen contents
  const renderScreenContent = () => {
    switch (activeTab) {
      case 'routes':
        return <RoutesListView onSelectRoute={handleSelectService} />;

      case 'interchanges':
        return (
          <InterchangeView
            interchanges={TRANSIT_INTERCHANGES}
            onSelectService={handleSelectService}
          />
        );

      case 'map':
        return (
          <TransitMapView
            busStops={busStops}
            selectedStopId={selectedMapStopId}
            onSelectStop={(stop) => {
              setSelectedMapStopId(stop.id);
            }}
            onSelectService={handleSelectService}
          />
        );

      case 'fares':
        return <FareCalculatorView onInspectService={handleSelectService} />;

      case 'alerts':
        return (
          <div className="space-y-4">
            <ServiceAlertsBanner
              alerts={SERVICE_ALERTS}
              onSelectService={handleSelectService}
            />
          </div>
        );

      case 'stops':
      default:
        return (
          <div className="space-y-4">
            {/* Live Service Alerts Banner */}
            <ServiceAlertsBanner
              alerts={SERVICE_ALERTS}
              onSelectService={handleSelectService}
            />

            {/* Stops Search & Filter Section */}
            <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-[#E5E5EB] shadow-xs space-y-3">
              {/* Search Bar with Singapore high-contrast styling */}
              <div className="relative">
                <Search
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[#82737F]"
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search 5-digit stop code (01112), road (Orchard), or bus (147, 65)..."
                  className="w-full pl-10 pr-9 py-2.5 bg-[#F9F9FF] border border-[#E5E5EB] rounded-lg text-xs sm:text-sm focus:outline-none focus:border-[#6E1D74] focus:bg-white transition-colors"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-[#82737F] hover:text-[#171C24]"
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* Quick Filter Segmented Buttons */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
                {[
                  { id: 'all', label: `All Stops (${busStops.length})` },
                  {
                    id: 'saved',
                    label: `Saved (${bookmarkedStopIds.length})`,
                    icon: Bookmark,
                  },
                  { id: 'interchange', label: 'Interchanges', icon: Building2 },
                  { id: 'mrt', label: 'Near MRT', icon: TrainTrack },
                ].map((item) => {
                  const isSelected = stopFilter === item.id;
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setStopFilter(item.id as any)}
                      className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-all flex items-center gap-1.5 border ${
                        isSelected
                          ? 'bg-[#520059] border-[#520059] text-white shadow-xs'
                          : 'bg-[#F9F9FF] border-[#E5E5EB] text-[#50434E] hover:border-[#D4C1CF]'
                      }`}
                    >
                      {Icon && <Icon size={13} />}
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Commuter quick info hint */}
              <div className="flex items-center justify-between text-[11px] text-[#82737F] pt-1">
                <span>
                  Showing {filteredBusStops.length} stop{filteredBusStops.length === 1 ? '' : 's'}
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00875A]" />
                  <span>LTA Datamall Telemetry Active</span>
                </span>
              </div>
            </div>

            {/* List of Bus Stop Cards */}
            <div className="space-y-4">
              {filteredBusStops.map((stop) => (
                <StopCard
                  key={stop.id}
                  stop={stop}
                  isBookmarked={bookmarkedStopIds.includes(stop.id)}
                  onToggleBookmark={handleToggleBookmark}
                  onSelectService={handleSelectService}
                  onOpenMapLocation={handleOpenMapLocation}
                />
              ))}

              {filteredBusStops.length === 0 && (
                <div className="py-12 px-4 text-center bg-white rounded-xl border border-[#E5E5EB] space-y-2">
                  <Bus size={32} className="mx-auto text-[#82737F] opacity-40" />
                  <h3 className="font-display font-bold text-base text-[#171C24]">
                    No bus stops found
                  </h3>
                  <p className="text-xs text-[#50434E] max-w-sm mx-auto">
                    No results for &quot;{searchQuery}&quot;. Try searching with a 5-digit postal stop code like{' '}
                    <span className="font-service font-semibold text-[#520059]">01112</span>,{' '}
                    <span className="font-service font-semibold text-[#520059]">08057</span>, or service{' '}
                    <span className="font-service font-semibold text-[#520059]">147</span>.
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setStopFilter('all');
                    }}
                    className="mt-2 px-4 py-1.5 bg-[#520059] text-white text-xs font-semibold rounded-lg hover:bg-[#6E1D74] transition-colors"
                  >
                    Reset Filters
                  </button>
                </div>
              )}
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F7FA] text-[#171C24] flex flex-col font-body">
      {/* Top Bar Header */}
      <Header
        activeTab={activeTab}
        onTabChange={setActiveTab}
        isMobileDeviceView={isMobileDeviceView}
        onToggleDeviceView={() => setIsMobileDeviceView(!isMobileDeviceView)}
        isRefreshing={isRefreshing}
        onRefresh={triggerLiveTelemetryUpdate}
        lastUpdatedSecondsAgo={lastUpdatedSecondsAgo}
      />

      {/* Main Body */}
      <main className="flex-1 flex flex-col items-center justify-start pb-20 md:pb-12">
        {isMobileDeviceView ? (
          /* Mobile Smartphone Frame Simulation Mode */
          <div className="py-6 px-3 w-full flex flex-col items-center">
            {/* Phone Frame Device Container */}
            <div className="w-full max-w-[420px] bg-black rounded-[46px] p-3 shadow-2xl border-4 border-[#2C303A] relative">
              {/* Phone Speaker & Dynamic Island */}
              <div className="absolute top-5 left-1/2 -translate-x-1/2 w-28 h-5 bg-black rounded-full z-50 flex items-center justify-end pr-2.5">
                <div className="w-2.5 h-2.5 bg-[#171C24] rounded-full border border-[#2C303A]" />
              </div>

              {/* Screen Inner */}
              <div className="w-full bg-[#F7F7FA] rounded-[36px] overflow-hidden flex flex-col min-h-[780px] max-h-[850px] relative border border-[#E5E5EB]">
                {/* Mobile Status Bar */}
                <div className="h-11 px-6 pt-2 flex items-center justify-between text-xs font-semibold text-[#171C24] bg-white border-b border-[#F0F0F5] shrink-0">
                  <span className="font-service text-xs font-bold">09:41</span>
                  <div className="flex items-center gap-1.5 text-[#171C24]">
                    <Signal size={13} />
                    <Wifi size={13} />
                    <Battery size={15} />
                  </div>
                </div>

                {/* Mobile App Bar */}
                <div className="px-4 py-2.5 bg-gradient-to-r from-[#520059] to-[#6E1D74] text-white flex items-center justify-between shrink-0 shadow-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded bg-white text-[#520059] font-service font-bold text-xs flex items-center justify-center">
                      SG
                    </span>
                    <span className="font-display font-bold text-sm">
                      {activeTab === 'stops'
                        ? 'Live Bus Arrivals'
                        : activeTab === 'routes'
                        ? 'Route Directory'
                        : activeTab === 'interchanges'
                        ? 'Interchange Hubs'
                        : activeTab === 'map'
                        ? 'Transit Schematic Map'
                        : activeTab === 'fares'
                        ? 'LTA Fares Calculator'
                        : 'LTA Alerts'}
                    </span>
                  </div>

                  <span className="text-[10px] font-service text-[#FFD6FA] bg-white/10 px-2 py-0.5 rounded-full">
                    GPS Live
                  </span>
                </div>

                {/* Mobile Scrollable Screen Content */}
                <div className="flex-1 overflow-y-auto p-3 space-y-3 pb-24">
                  {renderScreenContent()}
                </div>

                {/* Mobile Phone Bottom Home Bar */}
                <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-32 h-1 bg-black/60 rounded-full z-50 pointer-events-none" />

                {/* Mobile Bottom Thumb Navigation */}
                <MobileBottomNav
                  activeTab={activeTab}
                  onTabChange={setActiveTab}
                  unreadAlertsCount={SERVICE_ALERTS.filter((a) => a.status === 'Active').length}
                />
              </div>
            </div>

            <p className="text-xs text-[#82737F] mt-3 flex items-center gap-1">
              <Sparkles size={13} className="text-[#6E1D74]" />
              Smartphone Commuter View (390px thumb zone standard). Toggle top-right for full desktop dashboard.
            </p>
          </div>
        ) : (
          /* Desktop / Tablet Responsive View */
          <div className="w-full max-w-7xl px-4 sm:px-6 pt-6">
            {renderScreenContent()}
          </div>
        )}
      </main>

      {/* Floating Bottom Navigation Bar for Real Mobile Devices (when not in frame preview) */}
      {!isMobileDeviceView && (
        <MobileBottomNav
          activeTab={activeTab}
          onTabChange={setActiveTab}
          unreadAlertsCount={SERVICE_ALERTS.filter((a) => a.status === 'Active').length}
        />
      )}

      {/* Route Inspector Modal */}
      {inspectedRouteDetail && (
        <RouteInspectorModal
          route={inspectedRouteDetail}
          initialStopCode={inspectedStopCode}
          onClose={() => {
            setInspectedRouteNo(null);
            setInspectedStopCode(undefined);
          }}
          onSelectStopCode={(stopCode) => {
            setActiveTab('stops');
            setSearchQuery(stopCode);
          }}
        />
      )}
    </div>
  );
}
