import React from 'react';
import { LineChart, Line, ResponsiveContainer, YAxis, AreaChart, Area } from 'recharts';
import { Trend } from '../types';

interface SparkLineProps {
  data: number[];
  trend?: Trend;
  color?: string;
  width?: string | number;
  height?: string | number;
  type?: 'line' | 'area';
  strokeWidth?: number; // Added prop for line thickness
}

const SparkLine: React.FC<SparkLineProps> = ({ 
  data, 
  trend = Trend.UP, 
  color, 
  width = "100%", 
  height = "100%",
  type = 'line',
  strokeWidth = 2
}) => {
  // Determine color based on trend if not provided
  const chartColor = color ? color : (trend === Trend.UP ? "#10b981" : "#f43f5e");
  
  // Format data for Recharts
  const chartData = data.map((val, idx) => ({ i: idx, v: val }));

  // Calculate domain to make the chart look dynamic (zoom in on the range)
  const min = Math.min(...data);
  const max = Math.max(...data);
  const buffer = (max - min) * 0.1;

  if (type === 'area') {
    return (
      <ResponsiveContainer width={width} height={height}>
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id={`gradient-${trend}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={chartColor} stopOpacity={0.3}/>
              <stop offset="95%" stopColor={chartColor} stopOpacity={0}/>
            </linearGradient>
          </defs>
          <YAxis domain={[min - buffer, max + buffer]} hide />
          <Area 
            type="monotone" 
            dataKey="v" 
            stroke={chartColor} 
            strokeWidth={strokeWidth}
            fillOpacity={1} 
            fill={`url(#gradient-${trend})`} 
          />
        </AreaChart>
      </ResponsiveContainer>
    );
  }

  return (
    <ResponsiveContainer width={width} height={height}>
      <LineChart data={chartData}>
        <YAxis domain={[min - buffer, max + buffer]} hide />
        <Line 
          type="monotone" 
          dataKey="v" 
          stroke={chartColor} 
          strokeWidth={strokeWidth} 
          dot={false} 
          isAnimationActive={false} // Disable animation for lighter performance
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default SparkLine;