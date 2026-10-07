import React from 'react';
import { ServiceCategory } from '../types/transit';

interface BusServiceBadgeProps {
  serviceNo: string;
  category?: ServiceCategory;
  size?: 'sm' | 'md' | 'lg';
  isBerth?: boolean;
  berthLabel?: string;
  className?: string;
}

export const BusServiceBadge: React.FC<BusServiceBadgeProps> = ({
  serviceNo,
  category = 'Trunk',
  size = 'md',
  isBerth = false,
  berthLabel,
  className = '',
}) => {
  // Brand color routing: Trunk (#6E1D74 SBS purple), Express (#D9531E orange), Feeder (#0E7490 cyan/teal)
  let bgClass = 'bg-[#6E1D74] text-white';
  if (category === 'Express') {
    bgClass = 'bg-[#D9531E] text-white';
  } else if (category === 'Feeder') {
    bgClass = 'bg-[#1D6052] text-white';
  } else if (category === 'CityDirect') {
    bgClass = 'bg-[#272C3C] text-white';
  }

  const sizeClasses = {
    sm: 'text-xs px-2.5 py-0.5 tracking-tight min-w-[36px]',
    md: 'text-sm px-3.5 py-1 tracking-tight min-w-[48px]',
    lg: 'text-lg px-4 py-1.5 font-bold tracking-tight min-w-[62px]',
  };

  return (
    <div className={`inline-flex items-center gap-1.5 ${className}`}>
      <span
        className={`font-service font-bold rounded-full inline-flex items-center justify-center shadow-xs transition-transform active:scale-95 ${bgClass} ${sizeClasses[size]}`}
      >
        {serviceNo}
      </span>
      {berthLabel && (
        <span className="font-service text-[11px] font-semibold text-[#6E1D74] bg-[#F0EEF2] border border-[#E5E0E8] px-2 py-0.5 rounded-full">
          {berthLabel}
        </span>
      )}
    </div>
  );
};
