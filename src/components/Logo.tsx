import React from 'react';

export const Logo: React.FC<{ className?: string; size?: number }> = ({ 
  className = '', 
  size = 40 
}) => {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 200 200"
      width={size}
      height={size}
      className={className}
    >
      {/* 背景のグラデーション定義 */}
      <defs>
        <linearGradient id="shieldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3B82F6" />
          <stop offset="100%" stopColor="#7C3AED" />
        </linearGradient>
        <linearGradient id="innerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#60A5FA" />
          <stop offset="100%" stopColor="#8B5CF6" />
        </linearGradient>
        <filter id="dropShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="3" />
          <feOffset dx="2" dy="2" result="offsetblur" />
          <feComponentTransfer>
            <feFuncA type="linear" slope="0.3" />
          </feComponentTransfer>
          <feMerge>
            <feMergeNode />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* メインのシールド形状 */}
      <path d="M100,15 
              C130,15 160,25 180,40
              L180,95
              C180,140 150,170 100,185
              C50,170 20,140 20,95
              L20,40
              C40,25 70,15 100,15Z" 
            fill="url(#shieldGradient)"
            filter="url(#dropShadow)" />

      {/* 内側のシールド */}
      <path d="M100,35
              C125,35 145,43 160,55
              L160,95
              C160,130 135,155 100,165
              C65,155 40,130 40,95
              L40,55
              C55,43 75,35 100,35Z"
            fill="url(#innerGradient)" />

      {/* Solidityの"S"をイメージした図形 - シールドの中央に配置 */}
      <path d="M80,65
              C80,60 85,55 95,55
              L120,55
              C125,55 130,60 130,65
              L130,75
              C130,80 125,85 120,85
              L90,85
              C85,85 80,90 80,95
              L80,115
              C80,120 85,125 90,125
              L120,125
              C125,125 130,120 130,115
              L130,105
              M80,105
              L130,65"
            stroke="white"
            strokeWidth="8"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none" />

      {/* 光沢効果を追加 */}
      <path d="M40,95 
              C40,130 65,155 100,165
              C135,155 160,130 160,95
              L160,55
              C145,43 125,35 100,35"
            fill="white"
            fillOpacity="0.1" />
    </svg>
  );
};

export default Logo;