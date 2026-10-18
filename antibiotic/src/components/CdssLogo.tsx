import React from 'react';

interface CdssLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const CdssLogo: React.FC<CdssLogoProps> = ({ className = '', size = 'md' }) => {
  const sizeMap = {
    sm: 'w-6 h-6',
    md: 'w-9 h-9',
    lg: 'w-11 h-11',
    xl: 'w-14 h-14'
  };

  const dim = sizeMap[size] || sizeMap.md;

  return (
    <div className={`relative shrink-0 flex items-center justify-center ${dim} ${className}`}>
      <svg
        viewBox="0 0 120 120"
        className="w-full h-full drop-shadow-md"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="cdssLogoGradPrimary" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0d9488" />
            <stop offset="50%" stopColor="#0284c7" />
            <stop offset="100%" stopColor="#2563eb" />
          </linearGradient>
          <linearGradient id="cdssLogoGradAccent" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#14b8a6" />
            <stop offset="100%" stopColor="#38bdf8" />
          </linearGradient>
          <filter id="cdssLogoGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="#0d9488" floodOpacity="0.4" />
          </filter>
        </defs>

        {/* Outer Hexagonal Clinical Shield */}
        <path
          d="M 60 6 L 104 28 C 104 68 84 100 60 114 C 36 100 16 68 16 28 Z"
          fill="url(#cdssLogoGradPrimary)"
          filter="url(#cdssLogoGlow)"
        />

        {/* Inner Protective Dark Shield */}
        <path
          d="M 60 14 L 96 32 C 96 66 78 94 60 106 C 42 94 24 66 24 32 Z"
          fill="#031b26"
          opacity="0.9"
        />

        {/* Subtle Grid Rings */}
        <circle cx="60" cy="58" r="30" stroke="url(#cdssLogoGradAccent)" strokeWidth="1" strokeDasharray="2 3" opacity="0.35" />
        <circle cx="60" cy="58" r="20" stroke="url(#cdssLogoGradAccent)" strokeWidth="0.75" opacity="0.25" />

        {/* Medical Cross Base */}
        <rect x="54" y="34" width="12" height="48" rx="3.5" fill="url(#cdssLogoGradAccent)" />
        <rect x="36" y="52" width="48" height="12" rx="3.5" fill="url(#cdssLogoGradAccent)" />

        {/* Dynamic ECG Rhythm Waveform */}
        <path
          d="M 28 58 L 44 58 L 49 50 L 53 70 L 60 38 L 67 76 L 71 52 L 76 58 L 92 58"
          stroke="#ffffff"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Intelligence Nodes */}
        <circle cx="60" cy="38" r="3.5" fill="#38bdf8" stroke="#ffffff" strokeWidth="1.5" />
        <circle cx="60" cy="58" r="2.5" fill="#ffffff" />
        <circle cx="36" cy="58" r="2.5" fill="#14b8a6" />
        <circle cx="84" cy="58" r="2.5" fill="#38bdf8" />
        <circle cx="60" cy="78" r="2.5" fill="#14b8a6" />
      </svg>
    </div>
  );
};
