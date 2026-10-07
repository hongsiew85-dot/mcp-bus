import React from 'react';
import { Bus, MapPin, Building2, Calculator, BellRing, Compass } from 'lucide-react';

interface MobileBottomNavProps {
  activeTab: 'stops' | 'routes' | 'interchanges' | 'map' | 'fares' | 'alerts';
  onTabChange: (tab: 'stops' | 'routes' | 'interchanges' | 'map' | 'fares' | 'alerts') => void;
  unreadAlertsCount?: number;
}

interface TabItem {
  id: 'stops' | 'routes' | 'interchanges' | 'map' | 'fares' | 'alerts';
  label: string;
  icon: React.ElementType;
  badge?: number;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  onTabChange,
  unreadAlertsCount = 1,
}) => {
  const tabs: TabItem[] = [
    { id: 'stops', label: 'Live Stops', icon: Bus },
    { id: 'routes', label: 'Routes', icon: Compass },
    { id: 'interchanges', label: 'Hubs', icon: Building2 },
    { id: 'map', label: 'Map', icon: MapPin },
    { id: 'fares', label: 'Fares', icon: Calculator },
    { id: 'alerts', label: 'Alerts', icon: BellRing, badge: unreadAlertsCount },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#E5E5EB] shadow-lg md:hidden">
      <div className="grid grid-cols-6 items-center h-16 max-w-lg mx-auto px-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center justify-center h-full min-h-[44px] transition-colors relative ${
                isActive ? 'text-[#520059]' : 'text-[#82737F] hover:text-[#50434E]'
              }`}
            >
              <div className="relative">
                <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                {tab.badge !== undefined && tab.badge > 0 && !isActive && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#DC2626]" />
                )}
              </div>
              <span
                className={`text-[10px] tracking-tight mt-1 truncate ${
                  isActive ? 'font-bold text-[#520059]' : 'font-medium'
                }`}
              >
                {tab.label}
              </span>
              {isActive && (
                <span className="w-1 h-1 rounded-full bg-[#520059] mt-0.5" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
