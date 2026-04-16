import React from 'react';
import '../index.css';

interface SpzPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

export const SpzPanel: React.FC<SpzPanelProps> = ({ className = '', children, ...props }) => {
  return (
    <div className={`spz-panel ${className}`} {...props}>
      {children}
    </div>
  );
};
