import React, { useState } from 'react';
import { calculateLtaCardFare } from '../data/transitData';
import { CreditCard, Calculator, ArrowRight, ShieldCheck, Zap, Info } from 'lucide-react';

export const FareCalculatorView: React.FC<{
  onInspectService?: (serviceNo: string) => void;
}> = ({ onInspectService }) => {
  const [distanceKm, setDistanceKm] = useState<number>(12.5);
  const [riderType, setRiderType] = useState<'adult' | 'student' | 'senior'>('adult');
  const [transferCount, setTransferCount] = useState<number>(1);

  const fareResult = calculateLtaCardFare(distanceKm, riderType);
  const estimatedCashFare = (fareResult.fare + 0.9).toFixed(2);
  const savedViaSimplyGo = (Number(estimatedCashFare) - fareResult.fare).toFixed(2);

  const PRESET_JOURNEYS = [
    { label: 'Orchard to Jurong East', km: 16.8, time: '38 min', services: ['147', '502'] },
    { label: 'Dhoby Ghaut to HarbourFront', km: 9.2, time: '22 min', services: ['65'] },
    { label: 'Bugis to Chinatown', km: 3.4, time: '12 min', services: ['190', '851'] },
    { label: 'Tampines to Orchard', km: 17.5, time: '42 min', services: ['65'] },
  ];

  return (
    <div className="space-y-4">
      {/* Fare Calculator Card */}
      <div className="bg-white p-4 sm:p-6 rounded-xl border border-[#E5E5EB] shadow-xs">
        <div className="flex items-center gap-2 pb-3 border-b border-[#F0F0F5]">
          <Calculator className="text-[#6E1D74]" size={22} />
          <div>
            <h2 className="font-display font-bold text-lg text-[#171C24]">
              LTA Distance Fare & Transfer Calculator
            </h2>
            <p className="text-xs text-[#50434E]">
              Distance-based fare rules for public buses & MRT train transfers
            </p>
          </div>
        </div>

        {/* Fare Result Hero Box */}
        <div className="mt-4 p-4 rounded-xl bg-gradient-to-br from-[#FAF0FA] to-[#FFF9F5] border border-[#FFA9FD]/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#6E1D74]">
              Card Fare (SimplyGo / EZ-Link)
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="font-service font-bold text-3xl sm:text-4xl text-[#520059] tracking-tight">
                {fareResult.formatted}
              </span>
              <span className="text-xs text-[#50434E]">
                for {distanceKm} km · {riderType.toUpperCase()}
              </span>
            </div>
            <div className="text-xs text-[#00875A] font-medium flex items-center gap-1 mt-1">
              <Zap size={13} />
              <span>You save ${savedViaSimplyGo} compared to standard cash / single-trip tokens</span>
            </div>
          </div>

          <div className="bg-white/90 p-3 rounded-lg border border-[#E5E5EB] text-xs space-y-1 sm:text-right">
            <div className="text-[#82737F]">Transfer rebate applied:</div>
            <div className="font-service font-bold text-sm text-[#00875A]">
              Valid (within 45 min window)
            </div>
            <div className="text-[11px] text-[#50434E]">Max 5 transfers per journey</div>
          </div>
        </div>

        {/* Interactive Controls */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Rider Type Selector */}
          <div>
            <label className="block text-xs font-semibold text-[#50434E] mb-2 uppercase tracking-wide">
              Card Type / Fare Category
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'adult', label: 'Adult Card', desc: 'Standard contactless' },
                { id: 'student', label: 'Student', desc: 'Concession card' },
                { id: 'senior', label: 'Senior', desc: 'Senior citizen pass' },
              ].map((type) => {
                const isSelected = riderType === type.id;
                return (
                  <button
                    key={type.id}
                    onClick={() => setRiderType(type.id as any)}
                    className={`p-2.5 rounded-lg border text-left transition-all ${
                      isSelected
                        ? 'bg-[#FFD6FA]/40 border-[#6E1D74] text-[#520059] shadow-xs'
                        : 'bg-[#F9F9FF] border-[#E5E5EB] text-[#171C24] hover:border-[#D4C1CF]'
                    }`}
                  >
                    <div className="font-bold text-xs">{type.label}</div>
                    <div className="text-[10px] text-[#50434E] mt-0.5">{type.desc}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Distance Slider */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-[#50434E] uppercase tracking-wide">
                Cumulative Journey Distance
              </label>
              <span className="font-service font-bold text-sm text-[#520059]">
                {distanceKm.toFixed(1)} km
              </span>
            </div>
            <input
              type="range"
              min="1.0"
              max="35.0"
              step="0.5"
              value={distanceKm}
              onChange={(e) => setDistanceKm(parseFloat(e.target.value))}
              className="w-full accent-[#6E1D74] cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-[#82737F] mt-1 font-service">
              <span>1.0 km (Short)</span>
              <span>15.0 km (Cross-town)</span>
              <span>35.0 km (Island-wide)</span>
            </div>
          </div>
        </div>

        {/* Presets */}
        <div className="mt-6 pt-5 border-t border-[#F0F0F5]">
          <div className="text-xs font-semibold text-[#82737F] mb-3 uppercase tracking-wide">
            Popular Commuter Corridors (1-Tap Estimate)
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            {PRESET_JOURNEYS.map((preset) => (
              <button
                key={preset.label}
                onClick={() => setDistanceKm(preset.km)}
                className="p-3 rounded-lg border border-[#E5E5EB] bg-[#FAFBFD] hover:border-[#6E1D74] hover:bg-white text-left transition-all group"
              >
                <div className="font-display font-semibold text-xs text-[#171C24] group-hover:text-[#6E1D74] truncate">
                  {preset.label}
                </div>
                <div className="flex items-center justify-between text-[11px] text-[#50434E] mt-1.5">
                  <span className="font-service font-medium">{preset.km} km · {preset.time}</span>
                  <span className="font-service font-bold text-[#520059]">
                    {calculateLtaCardFare(preset.km, riderType).formatted}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Distance Fare Policy Notice */}
      <div className="p-4 rounded-xl bg-[#F0F3FF] border border-[#DFE2EF] flex items-start gap-3 text-xs text-[#272C3C]">
        <Info size={18} className="text-[#6E1D74] shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-bold">LTA Distance-Based Fares Rules:</span>
          <p className="text-[#50434E] leading-relaxed">
            Fares are calculated based on total distance traveled from origin to destination regardless of transfers.
            To enjoy seamless journey fares: transfer within 45 minutes of tapping out, re-enter within 2 hours of starting your journey, and make no more than 5 transfers.
          </p>
        </div>
      </div>
    </div>
  );
};
