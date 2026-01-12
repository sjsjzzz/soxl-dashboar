import React from 'react';

interface RsiBarProps {
  value: number;
}

const RsiBar: React.FC<RsiBarProps> = ({ value }) => {
  // Calculate position percentage (0-100)
  const percent = Math.min(Math.max(value, 0), 100);
  
  // Determine color zone
  let statusColor = "bg-slate-400";
  let statusText = "Neutral";
  if (value >= 70) {
    statusColor = "bg-rose-500";
    statusText = "Overbought";
  } else if (value <= 30) {
    statusColor = "bg-emerald-500";
    statusText = "Oversold";
  }

  return (
    <div className="w-full">
      <div className="flex justify-between items-end mb-1">
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">RSI (14) Indicator</span>
        <span className={`text-xs font-mono font-bold ${value >= 70 ? 'text-rose-600' : value <= 30 ? 'text-emerald-600' : 'text-slate-600'}`}>
          {value} <span className="text-[10px] font-sans opacity-70">({statusText})</span>
        </span>
      </div>
      
      <div className="relative h-2.5 bg-slate-200 rounded-full w-full overflow-hidden">
        {/* Zones */}
        <div className="absolute top-0 bottom-0 left-0 w-[30%] bg-emerald-100 border-r border-emerald-200"></div>
        <div className="absolute top-0 bottom-0 right-0 w-[30%] bg-rose-100 border-l border-rose-200"></div>
        
        {/* Indicator Line */}
        <div 
          className={`absolute top-0 bottom-0 w-1.5 ${statusColor} rounded-full transition-all duration-1000 ease-out shadow-[0_0_4px_rgba(0,0,0,0.2)]`}
          style={{ left: `calc(${percent}% - 3px)` }}
        ></div>
      </div>
      
      <div className="flex justify-between mt-1 text-[9px] text-slate-400 font-mono">
        <span>0</span>
        <span className="text-emerald-600 font-bold">30</span>
        <span>50</span>
        <span className="text-rose-600 font-bold">70</span>
        <span>100</span>
      </div>
    </div>
  );
};

export default RsiBar;