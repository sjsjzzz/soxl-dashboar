import React from 'react';
import { StockTicker } from '../types';
import TrendLine from './TrendLine';

interface HeatmapProps {
  tickers: StockTicker[];
}

const Heatmap: React.FC<HeatmapProps> = ({ tickers }) => {
  return (
    <div className="grid grid-cols-4 gap-2 h-full">
      {tickers.map((ticker) => {
        const isPositive = ticker.changePercent >= 0;
        const colorClass = isPositive 
          ? 'bg-emerald-50 border-emerald-100 text-emerald-800' 
          : 'bg-rose-50 border-rose-100 text-rose-800';
        
        return (
          <div 
            key={ticker.symbol} 
            className={`relative flex flex-col items-center justify-center p-2 rounded-lg border ${colorClass} transition-all hover:shadow-md cursor-default overflow-hidden`}
          >
            <div className="relative z-10 flex flex-col items-center">
                <span className="text-xs font-bold opacity-80">{ticker.symbol}</span>
                <span className="text-sm font-mono font-bold">
                {isPositive ? '+' : ''}{ticker.changePercent.toFixed(1)}%
                </span>
            </div>
            
            {/* Background TrendLine */}
            <div className="absolute bottom-0 left-0 right-0 opacity-30">
                <TrendLine trend={ticker.trend} width={80} height={25} className="w-full h-full" />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Heatmap;