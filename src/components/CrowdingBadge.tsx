import React from 'react';
import { CrowdingLevel } from '../types/transit';
import { Accessibility } from 'lucide-react';

interface CrowdingBadgeProps {
  load: CrowdingLevel;
  showText?: boolean;
  size?: 'sm' | 'md';
}

export const CrowdingBadge: React.FC<CrowdingBadgeProps> = ({
  load,
  showText = true,
  size = 'md',
}) => {
  const config = {
    SEA: {
      label: 'Seats Avail',
      shortLabel: 'Seats',
      textColor: 'text-[#00875A]',
      dotBg: 'bg-[#00875A]',
      badgeBg: 'bg-[#E6F4EA] border-[#B7E1CD]',
    },
    SDA: {
      label: 'Standing Avail',
      shortLabel: 'Standing',
      textColor: 'text-[#D97706]',
      dotBg: 'bg-[#D97706]',
      badgeBg: 'bg-[#FEF3C7] border-[#FDE68A]',
    },
    LSD: {
      label: 'Limited Standing',
      shortLabel: 'Full',
      textColor: 'text-[#DC2626]',
      dotBg: 'bg-[#DC2626]',
      badgeBg: 'bg-[#FEE2E2] border-[#FECACA]',
    },
  }[load];

  const sizeClasses = size === 'sm' ? 'text-[10px] px-1.5 py-0.5' : 'text-xs px-2 py-0.5';

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-full border ${config.badgeBg} ${config.textColor} ${sizeClasses}`}
      title={config.label}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dotBg} shrink-0 animate-pulse`} />
      {showText && <span className="font-body leading-none">{config.shortLabel}</span>}
    </span>
  );
};

export const WabBadge: React.FC<{ size?: 'sm' | 'md' }> = ({ size = 'md' }) => {
  const iconSize = size === 'sm' ? 12 : 14;
  return (
    <span
      className="inline-flex items-center justify-center p-1 rounded-full bg-[#EFF6FF] border border-[#BFDBFE] text-[#0065FF]"
      title="Wheelchair Accessible Bus (WAB)"
      aria-label="Wheelchair Accessible"
    >
      <Accessibility size={iconSize} strokeWidth={2.2} />
    </span>
  );
};
