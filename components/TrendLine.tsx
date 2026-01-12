import React from 'react';
import { Trend } from '../types';

interface TrendLineProps {
  trend?: Trend;
  width?: number;
  height?: number;
  className?: string;
}

const TrendLine: React.FC<TrendLineProps> = ({ trend, width = 80, height = 30, className = "opacity-50" }) => {
  // Simple SVG sparkline simulation
  const color = trend === Trend.UP ? "#10b981" : trend === Trend.DOWN ? "#f43f5e" : "#94a3b8";
  
  // Different paths based on trend
  const pathD = trend === Trend.UP 
    ? "M0 25 Q 10 20, 20 22 T 40 15 T 60 5 T 80 2" 
    : trend === Trend.DOWN
    ? "M0 5 Q 10 10, 20 8 T 40 18 T 60 22 T 80 28"
    : "M0 15 Q 20 10, 40 20 T 80 15";

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} fill="none" className={className}>
      <path d={pathD} stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" />
    </svg>
  );
};

export default TrendLine;