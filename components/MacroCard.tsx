import React from 'react';
import { ArrowUpRight, ArrowDownRight, Minus, Database, Info } from 'lucide-react';
import { Trend } from '../types';
import TrendLine from './TrendLine';

interface MacroCardProps {
  title: string;
  value: string;
  change?: string;
  trend?: Trend;
  source?: string;
  impact?: string; // New: Explanation text
  children?: React.ReactNode;
}

const MacroCard: React.FC<MacroCardProps> = ({ title, value, change, trend, source, impact, children }) => {
  const getTrendColor = (t?: Trend) => {
    if (t === Trend.UP) return 'text-emerald-600';
    if (t === Trend.DOWN) return 'text-rose-600';
    return 'text-slate-500';
  };

  const TrendIcon = () => {
    if (trend === Trend.UP) return <ArrowUpRight className="w-4 h-4 text-emerald-600" />;
    if (trend === Trend.DOWN) return <ArrowDownRight className="w-4 h-4 text-rose-600" />;
    return <Minus className="w-4 h-4 text-slate-400" />;
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow relative overflow-hidden h-full min-h-[150px]">
      
      <div className="flex justify-between items-start mb-2 relative z-10">
        <h3 className="text-slate-500 text-xs font-bold uppercase tracking-wide">{title}</h3>
        {children && <div className="text-xs text-slate-400">Index</div>}
      </div>
      
      {children ? (
        <div className="flex-1 flex items-center justify-center">
            {children}
        </div>
      ) : (
        <div className="flex flex-col gap-1 relative z-10">
          <div className="flex justify-between items-end">
             <span className="text-2xl font-bold font-mono text-slate-900 tracking-tight">{value}</span>
             <TrendLine trend={trend} width={60} height={30} />
          </div>
          {change && (
            <div className={`flex items-center gap-1 text-sm font-bold font-mono ${getTrendColor(trend)}`}>
              <TrendIcon />
              {change}
            </div>
          )}
        </div>
      )}

      {/* Impact / Explanation Text */}
      {impact && (
        <div className="mt-3 pt-2 border-t border-slate-100 relative z-10">
            <p className="text-[10px] text-slate-600 font-medium leading-snug flex items-start gap-1">
                <Info className="w-3 h-3 text-blue-500 mt-0.5 flex-shrink-0" />
                {impact}
            </p>
        </div>
      )}

      {/* Source Indicator */}
      {source && (
        <div className="absolute bottom-2 right-3 flex items-center gap-1 opacity-40">
            <Database className="w-2.5 h-2.5 text-slate-500" />
            <span className="text-[9px] text-slate-500 font-medium">{source}</span>
        </div>
      )}
    </div>
  );
};

export default MacroCard;