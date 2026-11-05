import React from 'react';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({ size = 'md', className = '', onClick }) => {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12',
  };

  const textSizes = {
    sm: 'text-sm leading-tight',
    md: 'text-base leading-tight',
    lg: 'text-xl leading-tight',
  };

  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-2.5 select-none ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      {/* SVG House with rising chart bar graph and arrow matching the design */}
      <div className={`${iconSizes[size]} shrink-0 relative flex items-center justify-center`}>
        <svg
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-xs"
        >
          {/* House Roof and Frame */}
          <path
            d="M8 22L24 8L40 22V40C40 41.1 39.1 42 38 42H10C8.9 42 8 41.1 8 40V22Z"
            stroke="#1b5e3a"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="#ffffff"
          />
          {/* Internal Chart Bars */}
          {/* Bar 1 (Red/Coral) */}
          <rect x="14" y="30" width="4.5" height="8" rx="1.5" fill="#e11d48" />
          {/* Bar 2 (Blue) */}
          <rect x="21" y="24" width="4.5" height="14" rx="1.5" fill="#0284c7" />
          {/* Bar 3 (Emerald Green) */}
          <rect x="28" y="18" width="4.5" height="20" rx="1.5" fill="#16a34a" />
          {/* Rising Arrow Trend Line */}
          <path
            d="M13 28L23 20L28 23L35 15M35 15H30M35 15V20"
            stroke="#16a34a"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      <div className="flex flex-col">
        <span className={`font-black tracking-tight text-stone-900 ${textSizes[size]}`}>
          FAMÍLIA
        </span>
        <span
          className={`font-black tracking-wider text-emerald-800 ${
            size === 'sm' ? 'text-[11px]' : size === 'md' ? 'text-xs' : 'text-sm'
          }`}
        >
          FINANÇAS
        </span>
      </div>
    </div>
  );
};
