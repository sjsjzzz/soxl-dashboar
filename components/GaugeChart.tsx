import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface GaugeChartProps {
  value: number; // 0 to 100
  label: string;
}

const GaugeChart: React.FC<GaugeChartProps> = ({ value, label }) => {
  const data = [
    { name: 'Value', value: value },
    { name: 'Remainder', value: 100 - value },
  ];

  // Determine color based on value
  let color = '#3b82f6'; // Neutral Blue
  if (value > 75) color = '#10b981'; // Extreme Greed
  else if (value > 55) color = '#34d399'; // Greed
  else if (value < 25) color = '#e11d48'; // Extreme Fear
  else if (value < 45) color = '#f43f5e'; // Fear

  const cx = "50%";
  const cy = "100%"; // Bottom half
  const iR = 40;
  const oR = 70;

  // Add actionable insight based on score
  let comment = "Wait & See";
  if (value > 80) comment = "⚠️ Extreme Greed: Profit Taking";
  else if (value > 60) comment = "🔥 Momentum: Buy the Dip";
  else if (value > 40) comment = "⚖️ Neutral: Box Trading";
  else if (value > 20) comment = "😨 Fear: Accumulate Slowly";
  else comment = "💎 Extreme Fear: Strong Buy";

  return (
    <div className="relative h-28 w-full flex flex-col items-center justify-end">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            dataKey="value"
            startAngle={180}
            endAngle={0}
            data={data}
            cx={cx}
            cy={cy}
            innerRadius={iR}
            outerRadius={oR}
            stroke="none"
          >
            <Cell fill={color} />
            <Cell fill="#e2e8f0" /> {/* Light gray for empty part */}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute bottom-0 flex flex-col items-center">
        <span className="text-3xl font-bold font-mono text-slate-800 leading-none mb-1">{value}</span>
        <span className="text-xs text-slate-500 font-bold uppercase">{label}</span>
        <span className="text-[10px] text-blue-600 font-bold bg-blue-50 px-2 py-0.5 rounded-full mt-1 border border-blue-100 whitespace-nowrap">
           {comment}
        </span>
      </div>
    </div>
  );
};

export default GaugeChart;