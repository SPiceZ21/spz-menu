import React from 'react';

export const DotGauge: React.FC<{ value: number, min: number, max: number, segments?: number }> = ({ value, min, max, segments = 12 }) => {
  const ratio = Math.max(0, Math.min(1, (value - min) / (max - min)));
  const pos = Math.floor(ratio * segments);
  const left = "─".repeat(pos);
  const right = "─".repeat(Math.max(0, segments - pos));
  
  return (
    <span style={{ color: 'rgba(255,255,255,0.4)', letterSpacing: '-1.5px', fontFamily: 'monospace' }}>
      ○<span style={{ color: '#fff' }}>{left}●</span>{right}
    </span>
  );
};
