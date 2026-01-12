import React, { useState, useEffect } from 'react';
import { Clock, Calendar, Zap, TrendingUp, AlertCircle, Info, CheckCircle2, ChevronRight, BarChart2, Lightbulb, RefreshCw, Flag } from 'lucide-react';
import MacroCard from './components/MacroCard';
import GaugeChart from './components/GaugeChart';
import Heatmap from './components/Heatmap';
import RsiBar from './components/RsiBar';
import TrendLine from './components/TrendLine';
import { 
  FEAR_GREED_DATA, KRW_USD_DATA, NASDAQ_DATA, US_TREASURY_DATA,
  SOX_INDEX, SOXL_ETF, VIX_DATA, 
  CONSTITUENTS, WEEKLY_FOCUS, WEEKLY_SCHEDULE, KEY_POINTS, IMPACT_ANALYSIS
} from './constants';
import { Trend } from './types';

const App: React.FC = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('ko-KR', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('ko-KR', { month: 'long', day: 'numeric', weekday: 'long' });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-100 pb-12">
      
      {/* HEADER */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-1.5 bg-blue-600 rounded-md shadow-sm">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
                SOXL Quant Morning Brief
                <span className="text-[10px] bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full uppercase font-bold tracking-wide">US Trader Edition</span>
              </h1>
              <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-[10px] text-slate-500 font-medium bg-slate-100 px-1.5 py-0.5 rounded flex items-center gap-1">
                    <RefreshCw className="w-3 h-3" />
                    Data Snapshot: Real-time Simulation ($53.95)
                  </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4 mt-2 md:mt-0">
            <div className="flex items-center gap-2 bg-slate-100 px-3 py-1 rounded-full text-xs font-medium text-slate-600">
               <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
               US Market Open
            </div>
            <div className="text-right flex items-center gap-3">
              <span className="text-sm font-medium text-slate-500">{formatDate(time)}</span>
              <span className="text-xl font-mono font-bold text-blue-600 w-24 text-center">{formatTime(time)}</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 md:p-6 space-y-8">
        
        {/* 1. WEEKLY FOCUS BANNER */}
        <section className="bg-orange-50 border border-orange-200 rounded-2xl p-5 md:p-6 shadow-sm">
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between mb-4 border-b border-orange-200/60 pb-4">
                <h2 className="text-lg md:text-xl font-bold text-orange-900 flex items-center gap-2">
                    <AlertCircle className="w-6 h-6 text-orange-600" />
                    {WEEKLY_FOCUS.title}
                </h2>
                <span className="px-3 py-1 bg-white text-orange-700 text-xs font-bold rounded-full border border-orange-200 shadow-sm">
                    US Market Focus
                </span>
            </div>
            <p className="text-slate-700 mb-4 leading-relaxed font-medium">
                {WEEKLY_FOCUS.description}
            </p>
            <div className="bg-white rounded-xl p-4 border border-orange-100">
                <ul className="space-y-2">
                    {WEEKLY_FOCUS.notes.map((note, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-slate-600">
                            <span className="w-1.5 h-1.5 rounded-full bg-orange-400 mt-1.5 flex-shrink-0"></span>
                            {note}
                        </li>
                    ))}
                </ul>
            </div>
        </section>

        {/* 2. MACRO INDICATORS (US Centric) */}
        <section className="space-y-6">
          <h3 className="text-slate-800 font-bold text-lg flex items-center gap-2">
              <BarChart2 className="w-5 h-5 text-blue-600" />
              핵심 매크로 지표 (US Trader View)
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <MacroCard title="Fear & Greed" value="" source={FEAR_GREED_DATA.source}>
              <GaugeChart value={FEAR_GREED_DATA.score} label={FEAR_GREED_DATA.sentiment} />
            </MacroCard>
            
            <MacroCard 
              title="나스닥 100" 
              value={NASDAQ_DATA.price.toLocaleString()} 
              change={`${NASDAQ_DATA.changePercent! > 0 ? '+' : ''}${NASDAQ_DATA.changePercent}%`} 
              trend={NASDAQ_DATA.trend} 
              source={NASDAQ_DATA.source}
              impact={NASDAQ_DATA.impact}
            />
            
            {/* Replaced KOSPI with US 10Y Yield */}
            <MacroCard 
              title="미국 10년물 국채 금리" 
              value={`${US_TREASURY_DATA.price.toFixed(2)}%`} 
              change={`${US_TREASURY_DATA.changePercent}%`} 
              trend={US_TREASURY_DATA.trend} 
              source={US_TREASURY_DATA.source}
              impact={US_TREASURY_DATA.impact}
            />

            {/* Kept Exchage Rate but simplified */}
            <MacroCard 
              title="USD/KRW 환율" 
              value={`₩${KRW_USD_DATA.price.toFixed(2)}`} 
              change={`+${KRW_USD_DATA.changePercent}%`} 
              trend={KRW_USD_DATA.trend} 
              source={KRW_USD_DATA.source}
              impact={KRW_USD_DATA.impact}
            />
          </div>
        </section>

        {/* 3. SEMICONDUCTOR CORE (SOXL with RSI & TrendLine) */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left: SOXL & SOX (7 Cols) */}
          <div className="lg:col-span-7 space-y-4">
            
            {/* SOXL MAIN CARD */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Zap className="w-32 h-32 text-blue-600" />
              </div>
              
              <div className="flex justify-between items-start relative z-10 mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-3xl font-black text-slate-900 tracking-tighter">SOXL</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-700 border border-blue-200">3X BULL ETF</span>
                  </div>
                  <div className="text-slate-500 text-sm font-medium">Direxion Daily Semiconductor Bull</div>
                </div>
                <div className="text-right">
                  <div className="text-5xl font-mono font-bold text-slate-900 tracking-tighter tabular-nums">
                    {SOXL_ETF.price.toFixed(2)}
                  </div>
                  <div className={`text-lg font-mono font-bold flex items-center justify-end gap-1 ${SOXL_ETF.changePercent! >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {SOXL_ETF.changePercent! >= 0 ? '+' : ''}{SOXL_ETF.change} ({SOXL_ETF.changePercent}%)
                  </div>
                </div>
              </div>

              {/* TrendLine for SOXL */}
              <div className="mb-6 flex justify-end border-b border-slate-50 pb-4">
                  <TrendLine trend={SOXL_ETF.trend} width={180} height={50} className="opacity-90" />
              </div>

              {/* RSI Indicator */}
              <div className="mt-2 relative z-10">
                <RsiBar value={SOXL_ETF.rsi || 50} />
              </div>

              {/* Pre-Market Section */}
              <div className="mt-6 pt-4 border-t border-slate-100 relative z-10">
                <div className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <div className="flex items-center gap-2 text-slate-600">
                    <Clock className="w-4 h-4 text-blue-500" />
                    <span className="text-sm font-bold">프리마켓 (Pre-market)</span>
                  </div>
                  <div className="flex items-baseline gap-3">
                    <span className="text-2xl font-mono font-bold text-slate-900">{SOXL_ETF.preMarketPrice?.toFixed(2)}</span>
                    <span className={`px-2 py-1 rounded text-xs font-bold ${SOXL_ETF.preMarketChangePercent! >= 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                      {SOXL_ETF.preMarketChangePercent! >= 0 ? 'GAP UP' : 'GAP DOWN'} {SOXL_ETF.preMarketChangePercent}%
                    </span>
                  </div>
                </div>
                <div className="text-right mt-2 text-[9px] text-slate-400">
                  Source: {SOXL_ETF.source}
                </div>
              </div>
            </div>

            {/* SOX Index Small Card with TrendLine */}
            <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col justify-between shadow-sm h-[130px]">
              <div className="flex items-center justify-between">
                 <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-xs">SOX</div>
                    <div>
                        <div className="text-slate-500 text-xs font-bold uppercase">필라델피아 반도체</div>
                        <div className="text-xl font-mono font-bold text-slate-900 mt-0.5">{SOX_INDEX.price.toLocaleString()}</div>
                    </div>
                 </div>
                 <div className="flex flex-col items-end gap-1">
                     <div className={`text-sm font-mono font-bold px-2 py-0.5 rounded ${SOX_INDEX.changePercent > 0 ? 'text-emerald-600 bg-emerald-50' : 'text-rose-600 bg-rose-50'}`}>
                          {SOX_INDEX.changePercent > 0 ? '+' : ''}{SOX_INDEX.changePercent}%
                     </div>
                 </div>
              </div>
              
              {/* Added Impact text for SOX */}
              <div className="mt-2 pt-2 border-t border-slate-50 flex justify-between items-center">
                 <p className="text-[10px] text-slate-600 flex items-center gap-1">
                    <Info className="w-3 h-3 text-indigo-400" />
                    {SOX_INDEX.impact}
                 </p>
                 <TrendLine trend={SOX_INDEX.trend} width={50} height={20} />
              </div>
            </div>
          </div>

          {/* Right: Heatmap & VIX (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            
            {/* VIX Volatility Context with TrendLine */}
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm relative">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-slate-500 text-xs uppercase font-bold flex items-center gap-1">
                  <TrendingUp className="w-4 h-4" /> 시장 변동성 (VIX)
                </h3>
                <div className="flex items-center gap-2">
                  <TrendLine trend={VIX_DATA.trend} width={40} height={20} />
                  <span className={`font-mono font-bold ${VIX_DATA.trend === Trend.DOWN ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {VIX_DATA.price} ({VIX_DATA.changePercent > 0 ? '+' : ''}{VIX_DATA.changePercent}%)
                  </span>
                </div>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div 
                   className="bg-gradient-to-r from-emerald-400 via-yellow-400 to-rose-400 h-full rounded-full opacity-80 transition-all duration-500"
                   style={{ width: `${(VIX_DATA.price / 40) * 100}%` }}
                ></div>
              </div>
              <div className="mt-3">
                 <p className="text-[10px] text-slate-600 flex items-center gap-1">
                    <Info className="w-3 h-3 text-blue-500" />
                    {VIX_DATA.impact}
                 </p>
              </div>
            </div>

            {/* Constituents Heatmap */}
            <div className="bg-white border border-slate-200 rounded-xl p-4 flex-grow flex flex-col shadow-sm">
              <h3 className="text-slate-500 text-xs uppercase font-bold mb-3 flex justify-between items-center">
                 <span>주요 종목 현황</span>
                 <span className="text-[10px] text-slate-400">Source: Yahoo Fin</span>
              </h3>
              <div className="flex-grow">
                <Heatmap tickers={CONSTITUENTS} />
              </div>
            </div>
          </div>
        </section>

        {/* 4. DAILY SCHEDULE (US & Semi Focused) */}
        <section>
          <h3 className="text-slate-800 font-bold text-lg mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              미국 증시 & 반도체 캘린더
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3">
              {WEEKLY_SCHEDULE.map((day, idx) => (
                  <div key={idx} className="bg-white border border-slate-200 rounded-xl p-3 flex flex-col h-full shadow-sm hover:border-blue-300 transition-colors">
                      <div className="flex justify-between items-center mb-3 pb-2 border-b border-slate-100">
                          <span className="font-bold text-slate-800">{day.date} ({day.day})</span>
                          {day.tags && (
                              <span className="text-[10px] font-bold bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded">
                                  {day.tags[0]}
                              </span>
                          )}
                      </div>
                      
                      <div className="flex-grow space-y-2 mb-3">
                          {day.events.map((evt, i) => (
                              <div key={i} className="text-xs text-slate-600 font-medium leading-tight flex items-start gap-1">
                                  <span className="text-slate-400 mt-0.5">•</span>
                                  {evt}
                              </div>
                          ))}
                      </div>

                      {day.earnings && (
                          <div className="mt-auto pt-2 border-t border-slate-50">
                              <div className="text-[10px] text-slate-400 font-bold mb-1 uppercase">Earnings</div>
                              {day.earnings.map((earn, i) => (
                                  <div key={i} className="flex justify-between items-center text-xs mb-1">
                                      <span className="font-bold text-slate-700">{earn.name}</span>
                                      <span className={`text-[9px] px-1 rounded ${earn.time === 'BMO' ? 'bg-orange-100 text-orange-700' : 'bg-indigo-100 text-indigo-700'}`}>
                                          {earn.time}
                                      </span>
                                  </div>
                              ))}
                          </div>
                      )}
                  </div>
              ))}
          </div>
        </section>

        {/* 5. KEY POINTS SUMMARY (With Impact Bubble) */}
        <section className="bg-blue-50 border border-blue-100 rounded-2xl p-5">
            <h3 className="text-blue-900 font-bold text-lg mb-4 flex items-center gap-2">
                <Info className="w-5 h-5 text-blue-600" />
                관전 포인트 요약 (Trader's Note)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {KEY_POINTS.map((point, idx) => (
                    <div key={idx} className="bg-white p-4 rounded-xl border border-blue-100 shadow-sm flex flex-col">
                        <h4 className="font-bold text-blue-800 text-sm mb-2 flex items-center gap-1.5">
                            <CheckCircle2 className="w-4 h-4 text-blue-500" />
                            {point.title}
                        </h4>
                        <p className="text-sm text-slate-600 leading-relaxed mb-4 flex-grow">
                            {point.content}
                        </p>
                        
                        {/* Impact Explanation Box */}
                        <div className="bg-slate-50 border border-slate-100 rounded-lg p-3 text-xs">
                          <div className="flex items-center gap-1.5 font-bold text-slate-700 mb-1.5">
                            <Lightbulb className="w-3 h-3 text-amber-500" />
                            <span>Action Plan</span>
                          </div>
                          <p className="text-slate-600 whitespace-pre-line leading-relaxed">
                            {point.impact}
                          </p>
                        </div>
                    </div>
                ))}
            </div>
        </section>

        {/* 6. IMPACT ANALYSIS (SOXL vs TQQQ) */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* SOXL Analysis */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm border-l-4 border-l-blue-500">
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
               <span className="w-2 h-2 bg-blue-500 transform rotate-45"></span>
               {IMPACT_ANALYSIS.soxl.title}
            </h3>
            <ul className="space-y-3">
              {IMPACT_ANALYSIS.soxl.items.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-slate-700">
                   <ChevronRight className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                   <span className="leading-snug">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* TQQQ Analysis */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm border-l-4 border-l-rose-500">
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
               <span className="w-2 h-2 bg-rose-500 transform rotate-45"></span>
               {IMPACT_ANALYSIS.tqqq.title}
            </h3>
             <ul className="space-y-3">
              {IMPACT_ANALYSIS.tqqq.items.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-slate-700">
                   <ChevronRight className="w-4 h-4 text-rose-500 mt-0.5 flex-shrink-0" />
                   <span className="leading-snug">{item}</span>
                </li>
              ))}
            </ul>
          </div>

        </section>

      </main>
    </div>
  );
};

export default App;