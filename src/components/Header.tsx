import { RefreshCw, Smartphone, Monitor, Clock, Code2 } from 'lucide-react';

interface HeaderProps {
  activeTab: 'stops' | 'routes' | 'interchanges' | 'map' | 'fares' | 'alerts';
  onTabChange: (tab: 'stops' | 'routes' | 'interchanges' | 'map' | 'fares' | 'alerts') => void;
  isMobileDeviceView: boolean;
  onToggleDeviceView: () => void;
  isRefreshing: boolean;
  onRefresh: () => void;
  lastUpdatedSecondsAgo: number;
  onOpenDiagnostics?: () => void;
  isLtaKeyConfigured?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onTabChange,
  isMobileDeviceView,
  onToggleDeviceView,
  isRefreshing,
  onRefresh,
  lastUpdatedSecondsAgo,
  onOpenDiagnostics,
  isLtaKeyConfigured = false,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white border-b border-[#E5E5EB] shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Brand title wordmark (single text element) */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-[#520059] flex items-center justify-center text-white font-service font-bold text-sm shadow-xs">
            SG
          </div>
          <span className="font-display font-bold text-lg sm:text-xl tracking-tight text-[#171C24] whitespace-nowrap">
            TransitSG
          </span>
        </div>

        {/* Zone 2: Navigation Links (single-line text with active/hover states) */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-[#50434E]">
          <button
            onClick={() => onTabChange('stops')}
            className={`whitespace-nowrap transition-colors py-1 ${
              activeTab === 'stops'
                ? 'text-[#520059] font-bold border-b-2 border-[#520059]'
                : 'hover:text-[#171C24]'
            }`}
          >
            Live Stops
          </button>
          <button
            onClick={() => onTabChange('routes')}
            className={`whitespace-nowrap transition-colors py-1 ${
              activeTab === 'routes'
                ? 'text-[#520059] font-bold border-b-2 border-[#520059]'
                : 'hover:text-[#171C24]'
            }`}
          >
            Routes
          </button>
          <button
            onClick={() => onTabChange('interchanges')}
            className={`whitespace-nowrap transition-colors py-1 ${
              activeTab === 'interchanges'
                ? 'text-[#520059] font-bold border-b-2 border-[#520059]'
                : 'hover:text-[#171C24]'
            }`}
          >
            Interchanges
          </button>
          <button
            onClick={() => onTabChange('map')}
            className={`whitespace-nowrap transition-colors py-1 ${
              activeTab === 'map'
                ? 'text-[#520059] font-bold border-b-2 border-[#520059]'
                : 'hover:text-[#171C24]'
            }`}
          >
            Transit Map
          </button>
          <button
            onClick={() => onTabChange('fares')}
            className={`whitespace-nowrap transition-colors py-1 ${
              activeTab === 'fares'
                ? 'text-[#520059] font-bold border-b-2 border-[#520059]'
                : 'hover:text-[#171C24]'
            }`}
          >
            Fares
          </button>
          <button
            onClick={() => onTabChange('alerts')}
            className={`whitespace-nowrap transition-colors py-1 ${
              activeTab === 'alerts'
                ? 'text-[#520059] font-bold border-b-2 border-[#520059]'
                : 'hover:text-[#171C24]'
            }`}
          >
            Alerts
          </button>
        </nav>

        {/* Zone 3: Primary Actions */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Live telemetry tick timer */}
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-[#82737F] font-service tabular-nums">
            <span className="w-2 h-2 rounded-full bg-[#00875A] animate-pulse" />
            <span>Updated {lastUpdatedSecondsAgo}s ago</span>
          </div>

          {/* API Health & Diagnostics Button */}
          {onOpenDiagnostics && (
            <button
              onClick={onOpenDiagnostics}
              className="p-2 sm:px-2.5 sm:py-1.5 rounded-lg border border-[#E5E5EB] bg-white hover:bg-[#FAF9FB] hover:border-[#6E1D74] text-xs font-semibold flex items-center gap-1.5 text-[#50434E] transition-colors"
              title="Inspect LTA DataMall v3 API & /api/health endpoint"
            >
              <Code2
                size={14}
                className={isLtaKeyConfigured ? 'text-[#00875A]' : 'text-[#D97706]'}
              />
              <span className="hidden sm:inline">
                {isLtaKeyConfigured ? 'LTA Active' : 'API Health'}
              </span>
            </button>
          )}

          {/* Refresh Action */}
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="p-2 sm:px-3 sm:py-1.5 rounded-lg border border-[#E5E5EB] bg-[#F9F9FF] hover:bg-[#F0EEF2] text-[#520059] font-medium text-xs flex items-center gap-1.5 transition-colors disabled:opacity-50"
            title="Refresh bus telemetry"
            aria-label="Refresh bus telemetry"
          >
            <RefreshCw size={14} className={isRefreshing ? 'animate-spin' : ''} />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          {/* Mobile frame preview toggle */}
          <button
            onClick={onToggleDeviceView}
            className={`p-2 rounded-lg border text-xs font-medium flex items-center gap-1.5 transition-colors ${
              isMobileDeviceView
                ? 'bg-[#FFD6FA] border-[#6E1D74] text-[#520059]'
                : 'bg-white border-[#E5E5EB] text-[#50434E] hover:text-[#171C24]'
            }`}
            title={isMobileDeviceView ? 'Switch to Full Desktop View' : 'Preview Smartphone Commuter View'}
            aria-label="Toggle device view"
          >
            {isMobileDeviceView ? (
              <>
                <Monitor size={15} />
                <span className="hidden sm:inline">Desktop View</span>
              </>
            ) : (
              <>
                <Smartphone size={15} />
                <span className="hidden sm:inline">Mobile Frame</span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
