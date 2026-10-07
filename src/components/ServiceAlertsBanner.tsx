import React, { useState } from 'react';
import { ServiceAlert } from '../types/transit';
import { AlertTriangle, Info, CheckCircle2, ChevronDown, ChevronUp, BellRing } from 'lucide-react';

interface ServiceAlertsBannerProps {
  alerts: ServiceAlert[];
  onSelectService?: (serviceNo: string) => void;
}

export const ServiceAlertsBanner: React.FC<ServiceAlertsBannerProps> = ({
  alerts,
  onSelectService,
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [filterCategory, setFilterCategory] = useState<'all' | 'Disruption' | 'Diversion' | 'Weather'>('all');

  const activeAlerts = alerts.filter((a) => a.status === 'Active');
  const primaryAlert = activeAlerts[0] || alerts[0];

  const filteredAlerts = alerts.filter((a) => {
    if (filterCategory === 'all') return true;
    return a.category === filterCategory;
  });

  if (!primaryAlert) return null;

  return (
    <div className="rounded-xl border border-[#E5E5EB] bg-white shadow-xs overflow-hidden transition-all">
      {/* Alert Ribbon Top Border: Crimson if Disruption, Amber if Diversion/Weather */}
      <div
        className={`h-1 w-full ${
          primaryAlert.severity === 'high'
            ? 'bg-[#E02020]'
            : primaryAlert.severity === 'medium'
            ? 'bg-[#D97706]'
            : 'bg-[#6E1D74]'
        }`}
      />

      <div className="p-3.5 sm:p-4">
        {/* Main collapsed / banner row */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-2.5">
            <span
              className={`p-1.5 rounded-lg shrink-0 mt-0.5 ${
                primaryAlert.severity === 'high'
                  ? 'bg-[#FEE2E2] text-[#DC2626]'
                  : primaryAlert.severity === 'medium'
                  ? 'bg-[#FEF3C7] text-[#D97706]'
                  : 'bg-[#F0EEF2] text-[#6E1D74]'
              }`}
            >
              <AlertTriangle size={16} />
            </span>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-service text-[11px] font-bold uppercase tracking-wider text-[#6E1D74]">
                  LTA Datamall Service Notice
                </span>
                <span className="text-[11px] text-[#82737F]">· {primaryAlert.timestamp}</span>
                <span
                  className={`text-[10px] font-semibold px-1.5 py-0.2 rounded-xs uppercase ${
                    primaryAlert.status === 'Active'
                      ? 'bg-[#DC2626] text-white'
                      : 'bg-[#00875A] text-white'
                  }`}
                >
                  {primaryAlert.status}
                </span>
              </div>

              <h3 className="font-display font-bold text-sm text-[#171C24] mt-0.5">
                {primaryAlert.title}
              </h3>
              <p className="text-xs text-[#50434E] mt-1 line-clamp-2">
                {primaryAlert.description}
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-[#6E1D74] hover:bg-[#F0EEF2] rounded-lg transition-colors shrink-0"
          >
            <span>{isExpanded ? 'Collapse' : `All Notices (${alerts.length})`}</span>
            {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
        </div>

        {/* Expanded list of alerts */}
        {isExpanded && (
          <div className="mt-4 pt-4 border-t border-[#F0F0F5] space-y-3">
            {/* Filter tags */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
              {(['all', 'Disruption', 'Diversion', 'Weather'] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilterCategory(cat)}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                    filterCategory === cat
                      ? 'bg-[#520059] text-white'
                      : 'bg-[#F0EEF2] text-[#50434E] hover:text-[#171C24]'
                  }`}
                >
                  {cat === 'all' ? 'All Alerts' : cat}
                </button>
              ))}
            </div>

            <div className="space-y-2.5">
              {filteredAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className="p-3 rounded-lg border border-[#E5E5EB] bg-[#FAFBFD] space-y-1.5"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-[#171C24]">{alert.title}</span>
                    <span className="text-[11px] text-[#82737F]">{alert.timestamp}</span>
                  </div>
                  <p className="text-xs text-[#50434E]">{alert.description}</p>
                  <div className="flex items-center gap-1.5 flex-wrap pt-1 text-[11px] text-[#82737F]">
                    <span>Affected:</span>
                    {alert.affectedServices.map((svc) => (
                      <span
                        key={svc}
                        onClick={() => onSelectService && onSelectService(svc)}
                        className="font-service font-semibold text-[#6E1D74] bg-[#FFD6FA]/40 px-1.5 py-0.2 rounded hover:underline cursor-pointer"
                      >
                        {svc}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
