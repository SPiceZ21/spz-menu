import React from 'react';

export const ClassBadge: React.FC<{ tier: string, size?: number }> = ({ tier, size = 32 }) => {
  const getBadgeColor = (t: string) => {
    switch (t.toUpperCase()) {
      case 'C': return '#185FA5'; // blue
      case 'B': return '#8E44AD'; // purple
      case 'A': return '#FF6B00'; // orange
      case 'S': return '#CC2200'; // red
      default: return '#185FA5';
    }
  };

  return (
    <div style={{
      width: size, height: size,
      backgroundColor: getBadgeColor(tier),
      color: '#fff',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontWeight: 700, fontSize: size * 0.6,
      fontFamily: 'SPZ, sans-serif',
      boxSizing: 'border-box'
    }}>
      {tier.toUpperCase()}
    </div>
  );
};
