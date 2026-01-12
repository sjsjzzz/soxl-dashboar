import React, { useState, useEffect } from 'react';
import { Zap, AlertCircle, RefreshCw, BarChart2, Calendar, TrendingUp, Activity, Loader2, ArrowRight, BrainCircuit, Bot, Newspaper, Clock, ExternalLink, Globe, Cpu } from 'lucide-react';
import MacroCard from './components/MacroCard';
import GaugeChart from './components/GaugeChart';
import Heatmap from './components/Heatmap';
import RsiBar from './components/RsiBar';
import SparkLine from './components/SparkLine';
import { GoogleGenAI, Type } from "@google/genai";
import { 
  FEAR_GREED_DATA, WEEKLY_FOCUS as INITIAL_FOCUS, WEEKLY_SCHEDULE as INITIAL_SCHEDULE, IMPACT_ANALYSIS, MARKET_NEWS as INITIAL_NEWS,
  CONSTITUENTS as INITIAL_CONSTITUENTS,
  SOXL_ETF as INITIAL_SOXL,
  SOX_INDEX as INITIAL_SOX,
  NASDAQ_DATA as INITIAL_NDX,
  US_TREASURY_DATA as INITIAL_TNX,
  KRW_USD_DATA as INITIAL_KRW,
  VIX_DATA as INITIAL_VIX,
  BITCOIN_DATA as INITIAL_BTC,
  KOSPI_DATA as INITIAL_KOSPI
} from './constants';
import { Trend, WeeklyFocus, NewsItem, DailySchedule, EarningsEvent } from './types';

const App: React.FC = () => {
  const [time, setTime] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Data States
  const [soxl, setSoxl] = useState(INITIAL_SOXL);
  const [sox, setSox] = useState(INITIAL_SOX);
  const [ndx, setNdx] = useState(INITIAL_NDX);
  const [tnx, setTnx] = useState(INITIAL_TNX);
  const [krw, setKrw] = useState(INITIAL_KRW);
  const [vix, setVix] = useState(INITIAL_VIX);
  const [btc, setBtc] = useState(INITIAL_BTC);
  const [kospi, setKospi] = useState(INITIAL_KOSPI);
  const [constituents, setConstituents] = useState(INITIAL_CONSTITUENTS);
  
  // AI Insight State (Dynamic)
  const [weeklyFocus, setWeeklyFocus] = useState<WeeklyFocus>(INITIAL_FOCUS);
  const [marketNews, setMarketNews] = useState<NewsItem[]>(INITIAL_NEWS);
  const [weeklySchedule, setWeeklySchedule] = useState<DailySchedule[]>(INITIAL_SCHEDULE);

  // Clock
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch Real Stock Data
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/stocks');
      if (!response.ok) throw new Error('API request failed');
      
      const data = await response.json();
      
      if (data.market) {
        setSoxl(prev => ({ ...prev, ...data.market.soxl, trend: data.market.soxl.changePercent >= 0 ? Trend.UP : Trend.DOWN }));
        setSox(prev => ({ ...prev, ...data.market.sox, trend: data.market.sox.changePercent >= 0 ? Trend.UP : Trend.DOWN }));
        setNdx(prev => ({ ...prev, ...data.market.ndx, trend: data.market.ndx.changePercent >= 0 ? Trend.UP : Trend.DOWN }));
        setTnx(prev => ({ ...prev, ...data.market.tnx, trend: data.market.tnx.changePercent >= 0 ? Trend.UP : Trend.DOWN }));
        setKrw(prev => ({ ...prev, ...data.market.krw, trend: data.market.krw.changePercent >= 0 ? Trend.UP : Trend.DOWN }));
        setVix(prev => ({ ...prev, ...data.market.vix, trend: data.market.vix.changePercent >= 0 ? Trend.UP : Trend.DOWN }));
        setBtc(prev => ({ ...prev, ...data.market.btc, trend: data.market.btc.changePercent >= 0 ? Trend.UP : Trend.DOWN }));
        setKospi(prev => ({ ...prev, ...data.market.kospi, trend: data.market.kospi.changePercent >= 0 ? Trend.UP : Trend.DOWN }));

        setConstituents(prev => prev.map(item => {
          const liveData = data.constituents.find((c: any) => c.symbol === item.symbol);
          if (liveData) {
            return {
              ...item,
              price: liveData.price,
              changePercent: liveData.changePercent,
              trend: liveData.changePercent >= 0 ? Trend.UP : Trend.DOWN
            };
          }
          return item;
        }));

        setLastUpdated(new Date().toLocaleTimeString());
      }
    } catch (err) {
      console.error(err);
      setError("실시간 주가 데이터를 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // AI Analysis Logic (With Google Search Grounding)
  const runAiAnalysis = async () => {
    setAiLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      // Prompt optimized for Search Grounding
      const prompt = `
        You are a Wall Street Quant Analyst for SOXL (3x Semiconductor Bull ETF).
        
        Task 1: Search for exactly 6 REAL-TIME news items (last 24h).
        - 3 General Macro News (category: 'macro'): e.g., Fed rates, Inflation, Geopolitics, Wars, Legal issues.
        - 3 Semiconductor Specific News (category: 'sector'): e.g., Nvidia, TSMC, Broadcom, Chips Act, AI demand.
        - Fact check all numbers.
        
        Task 2: Find the Economic Calendar & Earnings for the NEXT 5 DAYS (Today + 4 days).
        - Ensure exact dates, days of week (Mon, Tue, etc.), and consensus numbers.
        - Focus on events impacting Tech/Semiconductors.

        Task 3: Generate a weekly strategy based on the above.

        Return a JSON object with this schema:
        {
          "weeklyFocus": {
            "title": "Strategy Title",
            "description": "Market sentiment summary",
            "notes": [{"label": "Macro", "text": "..."}, {"label": "Action", "text": "..."}]
          },
          "news": [
            { "id": 1, "category": "macro", "source": "Source", "time": "2h ago", "title": "Headline", "sentiment": "negative", "impact": "Impact on SOXL", "url": "link" },
            { "id": 4, "category": "sector", "source": "Source", "time": "1h ago", "title": "Headline", "sentiment": "positive", "impact": "Impact on SOXL", "url": "link" }
          ],
          "schedule": [
             { 
               "date": "10/14 (Mon)", "day": "Monday", "tags": ["CPI"], "events": ["Event 1", "Event 2"], 
               "earnings": [{ "name": "Oracle", "symbol": "ORCL", "time": "AMC", "dayOfWeek": "Mon", "comment": "Note..." }] 
             }
          ]
        }
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          tools: [{ googleSearch: {} }], // ENABLE GOOGLE SEARCH
          responseMimeType: "application/json"
        }
      });

      const text = response.text;
      
      if (text) {
        const result = JSON.parse(text);
        
        // Update State with Real Data
        if (result.weeklyFocus) setWeeklyFocus(result.weeklyFocus);
        
        if (result.news && Array.isArray(result.news)) {
           // Extract grounding metadata if available (URLs)
           const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
           const newsWithLinks = result.news.map((item: NewsItem, index: number) => {
              let url = item.url;
              if (!url && groundingChunks) {
                 const webChunk = groundingChunks.find((c:any) => c.web?.uri);
                 if (webChunk) url = webChunk.web.uri;
              }
              return { ...item, id: index + 1, url };
           });
           setMarketNews(newsWithLinks);
        }

        if (result.schedule && Array.isArray(result.schedule)) {
            setWeeklySchedule(result.schedule);
        }
      }

    } catch (e) {
      console.error("AI Analysis Failed", e);
      alert("AI 분석(검색) 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setAiLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('ko-KR', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('ko-KR', { month: 'long', day: 'numeric', weekday: 'long' });
  };

  // Helper to render a single news item
  const renderNewsItem = (news: NewsItem) => (
    <div key={news.id} className="group cursor-pointer border-b border-slate-100 pb-3 last:border-0 last:pb-0">
        <div className="flex items-center justify-between mb-1">
            <span className={`text-[10px] font-bold uppercase tracking-wide flex items-center gap-1 ${news.sentiment === 'negative' ? 'text-rose-400' : 'text-slate-400'}`}>
                {news.source} <span className="w-0.5 h-0.5 bg-slate-300 rounded-full"></span> {news.time}
            </span>
            {news.url && <ExternalLink className="w-3 h-3 text-slate-300 group-hover:text-blue-400" />}
        </div>
        <h4 className="text-sm font-bold text-slate-900 leading-snug mb-1.5 group-hover:text-blue-600 transition-colors">
            {news.title}
        </h4>
        <div className="text-xs font-medium text-slate-600 bg-slate-100 px-2 py-1.5 rounded flex items-start gap-1.5 leading-snug">
           <span className="mt-0.5 flex-shrink-0">👉</span> 
           <span className="text-slate-700">{news.impact}</span>
        </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-100 pb-12">
      
      {/* HEADER */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 flex flex-col md:flex-row justify-between items-center gap-3 md:gap-0">
          <div className="flex items-center gap-3">
            <div className="p-1.5 bg-blue-600 rounded-lg shadow-lg shadow-blue-500/30">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-800 tracking-tight flex items-center gap-2">
                SOXL Quant Morning Brief
                <span className="text-[10px] bg-blue-50 text-blue-600 border border-blue-200 px-2 py-0.5 rounded-full uppercase font-bold tracking-wide">Real-time</span>
              </h1>
              <div className="flex items-center gap-2 mt-0.5">
                  <button 
                    onClick={fetchData}
                    disabled={loading}
                    className="text-[10px] font-medium px-2 py-0.5 rounded flex items-center gap-1 border bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200 transition-colors"
                  >
                    {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : <RefreshCw className="w-3 h-3" />}
                    {loading ? 'Updating...' : 'Refresh Now'}
                  </button>
                  {lastUpdated && <span className="text-[10px] text-slate-400">Updated: {lastUpdated}</span>}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right flex items-center gap-3 bg-white px-4 py-1.5 rounded-lg border border-slate-200 shadow-sm">
              <span className="text-sm font-medium text-slate-500">{formatDate(time)}</span>
              <span className="text-xl font-mono font-bold text-blue-600 w-24 text-center">{formatTime(time)}</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 md:p-6 space-y-6">
        
        {error && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-2 rounded-lg text-sm flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                {error}
            </div>
        )}

        {/* 1. WEEKLY FOCUS BANNER (AI Powered) */}
        <section className="bg-white border border-indigo-200 rounded-2xl p-5 md:p-6 relative overflow-hidden group shadow-sm hover:shadow-md transition-all">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-indigo-500"></div>
            <div className="flex flex-col lg:flex-row gap-6">
               <div className="lg:w-2/5 flex flex-col justify-center">
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className="px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-full border border-indigo-100">
                              Weekly Strategy
                          </span>
                          <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Gemini Powered</span>
                        </div>
                        <button 
                          onClick={runAiAnalysis}
                          disabled={aiLoading}
                          className="flex items-center gap-1 text-[10px] bg-slate-800 text-white px-3 py-1.5 rounded hover:bg-slate-700 transition-colors disabled:opacity-50 shadow-sm font-bold"
                        >
                          {aiLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Bot className="w-3 h-3" />}
                          {aiLoading ? "Searching & Analyzing..." : "Update with Live AI"}
                        </button>
                    </div>
                    <h2 className="text-xl font-bold text-slate-800 leading-tight mb-3">
                        {weeklyFocus.title}
                    </h2>
                    <p className="text-slate-600 text-sm leading-relaxed font-medium">
                        {weeklyFocus.description}
                    </p>
               </div>
               
               <div className="lg:w-3/5 bg-slate-50 rounded-xl p-4 border border-slate-200 flex flex-col justify-center gap-3 relative">
                    <BrainCircuit className="absolute top-4 right-4 w-32 h-32 text-indigo-50 -z-0 opacity-50" />
                    
                    {weeklyFocus.notes.map((note, idx) => (
                        <div key={idx} className="flex items-start gap-3 p-2 rounded-lg hover:bg-white transition-colors relative z-10">
                            <div className="w-24 flex-shrink-0 text-[10px] font-bold uppercase text-slate-500 mt-1 text-right border-r border-slate-200 pr-3">
                                {note.label}
                            </div>
                            <div className="text-sm text-slate-700 font-medium leading-snug">
                                {note.text}
                            </div>
                        </div>
                    ))}
               </div>
            </div>
        </section>

        {/* 2. MACRO INDICATORS */}
        <section className="space-y-4">
          <h3 className="text-slate-800 font-bold text-lg flex items-center gap-2 pl-1">
              <BarChart2 className="w-5 h-5 text-blue-600" />
              Macro Snapshot
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4">
            <MacroCard title="Fear & Greed" value="" source={FEAR_GREED_DATA.source}>
              <GaugeChart value={FEAR_GREED_DATA.score} label={FEAR_GREED_DATA.sentiment} />
            </MacroCard>
            
            <MacroCard 
              title="NASDAQ 100" 
              value={ndx.price.toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 0})} 
              change={`${ndx.changePercent! > 0 ? '+' : ''}${ndx.changePercent?.toFixed(2)}%`} 
              trend={ndx.trend} 
              source={ndx.source}
              impact={ndx.impact}
              history={ndx.history}
            />

            <MacroCard 
              title="Phila. Semiconductor" 
              value={sox.price.toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 0})} 
              change={`${sox.changePercent! > 0 ? '+' : ''}${sox.changePercent?.toFixed(2)}%`} 
              trend={sox.trend} 
              source={sox.source}
              impact={sox.impact}
              history={sox.history}
            />

            <MacroCard 
              title="US 10Y Treasury" 
              value={`${tnx.price.toFixed(2)}%`} 
              change={`${tnx.changePercent?.toFixed(2)}%`} 
              trend={tnx.trend} 
              source={tnx.source}
              impact={tnx.impact}
              history={tnx.history}
            />

            <MacroCard 
              title="USD/KRW" 
              value={`₩${krw.price.toFixed(0)}`} 
              change={`${krw.changePercent! > 0 ? '+' : ''}${krw.changePercent?.toFixed(2)}%`}
              trend={krw.trend}
              source={krw.source}
              impact={krw.impact}
              history={krw.history}
            />

            <MacroCard 
              title="Bitcoin" 
              value={`$${btc.price.toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 0})}`} 
              change={`${btc.changePercent! > 0 ? '+' : ''}${btc.changePercent?.toFixed(2)}%`} 
              trend={btc.trend} 
              source={btc.source}
              impact={btc.impact}
              history={btc.history}
            />

             <MacroCard 
              title="KOSPI" 
              value={kospi.price.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})} 
              change={`${kospi.changePercent! > 0 ? '+' : ''}${kospi.changePercent?.toFixed(2)}%`} 
              trend={kospi.trend} 
              source={kospi.source}
              impact={kospi.impact}
              history={kospi.history}
            />

            <MacroCard 
              title="VIX (Volatility)" 
              value={vix.price.toFixed(2)} 
              change={`${vix.changePercent! > 0 ? '+' : ''}${vix.changePercent?.toFixed(2)}%`} 
              trend={vix.trend} 
              source={vix.source}
              impact={vix.impact}
              history={vix.history}
            />
          </div>
        </section>

        {/* 3. CORE: SEMICONDUCTOR & SOXL */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 shadow-md relative overflow-hidden group flex flex-col justify-between">
            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none z-0">
               <Zap className="w-48 h-48 text-blue-600" />
            </div>
            
            <div className="relative z-10 h-full flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                    SOXL <span className="text-sm font-normal text-slate-500 bg-slate-100 px-2 py-0.5 rounded text-base border border-slate-200">3x Bull ETF</span>
                  </h2>
                  <p className="text-slate-500 text-sm mt-1">Direxion Daily Semiconductor Bull 3X</p>
                </div>
              </div>

              {/* Flex Container for Price and Chart */}
              <div className="flex-1 flex flex-col md:flex-row gap-6 items-center">
                 {/* Left: Price Data */}
                 <div className="flex-1 w-full">
                    <div className={`text-6xl font-mono font-bold tracking-tighter ${soxl.changePercent! >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {soxl.price.toFixed(2)}
                    </div>
                    <div className={`text-xl font-mono font-bold flex items-center gap-2 mt-1 ${soxl.changePercent! >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {soxl.changePercent! >= 0 ? '+' : ''}{soxl.change?.toFixed(2)} 
                        <span className="bg-slate-100 px-2 rounded text-lg">
                           ({soxl.changePercent! >= 0 ? '+' : ''}{soxl.changePercent?.toFixed(2)}%)
                        </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-6">
                        <div className="bg-slate-50 rounded-lg p-3 border border-slate-100">
                             <div className="text-[10px] text-slate-500 font-bold uppercase mb-1">Pre-market</div>
                             <div className="flex items-end gap-2">
                                <span className="text-lg font-mono font-bold text-slate-800">{soxl.preMarketPrice?.toFixed(2)}</span>
                                <span className={`text-xs font-bold ${soxl.preMarketChangePercent! >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                                    {soxl.preMarketChangePercent! >= 0 ? '+' : ''}{soxl.preMarketChangePercent?.toFixed(2)}%
                                </span>
                             </div>
                        </div>
                         <div className="bg-slate-50 rounded-lg p-3 border border-slate-100">
                             <div className="text-[10px] text-slate-500 font-bold uppercase mb-1">RSI (14) Status</div>
                             <RsiBar value={Math.round(soxl.rsi || 50)} />
                        </div>
                    </div>
                 </div>

                 {/* Right: Big Chart Area */}
                 <div className="w-full md:w-1/2 h-40 md:h-full min-h-[160px] bg-slate-50 rounded-xl border border-slate-200 p-2 relative">
                     <div className="absolute top-2 left-3 text-[10px] font-bold text-slate-400 uppercase z-10">Intraday Trend (Close)</div>
                     {soxl.history && soxl.history.length > 0 ? (
                        <SparkLine data={soxl.history} trend={soxl.trend} type="area" strokeWidth={3} />
                     ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-300">Loading Chart...</div>
                     )}
                 </div>
              </div>

            </div>
          </div>

          {/* Context Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col h-full">
            <h3 className="text-slate-800 font-bold text-sm uppercase flex items-center gap-2 mb-3">
                <TrendingUp className="w-4 h-4 text-blue-500" />
                Key Constituents
            </h3>
            <div className="flex-1">
                <Heatmap tickers={constituents} />
            </div>
          </div>
        </section>

        {/* 4. BOTTOM: CALENDAR & NEWS */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
             {/* LEFT: CALENDAR (Expanded to 5 Days) */}
             <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                <h3 className="text-slate-800 font-bold flex items-center gap-2 mb-4">
                    <Calendar className="w-5 h-5 text-blue-600" />
                    5-Day Economic Events (Forecast)
                </h3>
                <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
                    {weeklySchedule.map((item, idx) => (
                        <div key={idx} className="flex gap-4 items-start relative pb-4 last:pb-0 last:border-0 border-b border-slate-100">
                             <div className="w-16 flex-shrink-0 text-center bg-slate-50 rounded-lg py-2 border border-slate-100">
                                <div className="text-xs font-bold text-slate-500 uppercase">{item.date}</div>
                                <div className="text-sm font-bold text-slate-800">{item.day}</div>
                             </div>
                             <div className="flex-1">
                                <div className="flex flex-wrap gap-2 mb-1.5">
                                    {item.tags?.map(tag => (
                                        <span key={tag} className="text-[10px] bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded font-bold border border-indigo-100">{tag}</span>
                                    ))}
                                </div>
                                <ul className="space-y-2">
                                    {item.events.map((event, eIdx) => (
                                        <li key={eIdx} className="text-sm text-slate-700 font-medium whitespace-pre-line leading-relaxed pl-2 border-l-2 border-slate-200">
                                            {event}
                                        </li>
                                    ))}
                                </ul>
                                {/* Show earnings inside calendar day if any */}
                                {item.earnings && item.earnings.length > 0 && (
                                   <div className="mt-2 space-y-1">
                                      {item.earnings.map((earn, eIdx) => (
                                         <div key={eIdx} className="flex items-center justify-between bg-slate-50 p-1.5 rounded text-xs border border-slate-100">
                                            <div className="font-bold text-slate-700">{earn.symbol}</div>
                                            <div className="text-slate-500 truncate max-w-[120px]">{earn.comment}</div>
                                         </div>
                                      ))}
                                   </div>
                                )}
                             </div>
                        </div>
                    ))}
                </div>
             </div>

             {/* RIGHT: NEWS (Splitted by Category) */}
             <div className="flex flex-col gap-6">
                 {/* News Section */}
                 <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex-1">
                    <h3 className="text-slate-800 font-bold flex items-center gap-2 mb-4">
                        <Newspaper className="w-5 h-5 text-indigo-600" />
                        Major Market Intelligence
                    </h3>
                    
                    {/* Category 1: Macro */}
                    <div className="mb-6">
                       <h4 className="text-xs font-bold text-slate-500 uppercase mb-3 flex items-center gap-1">
                          <Globe className="w-3 h-3" /> Global Macro & Geopolitics
                       </h4>
                       <div className="space-y-3">
                          {marketNews.filter(n => n.category === 'macro' || !n.category).map(renderNewsItem)}
                       </div>
                    </div>

                    {/* Category 2: Sector */}
                    <div>
                       <h4 className="text-xs font-bold text-slate-500 uppercase mb-3 flex items-center gap-1">
                          <Cpu className="w-3 h-3" /> Semiconductor & Tech Focus
                       </h4>
                       <div className="space-y-3">
                          {marketNews.filter(n => n.category === 'sector').map(renderNewsItem)}
                       </div>
                    </div>
                 </div>
             </div>
        </section>

        {/* 5. STRATEGY CARDS */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-800 text-white rounded-2xl p-6 relative overflow-hidden">
                <div className="relative z-10">
                    <h3 className="font-bold text-lg mb-4 text-blue-200">{IMPACT_ANALYSIS.soxl.title}</h3>
                    <ul className="space-y-3">
                        {IMPACT_ANALYSIS.soxl.items.map((item, i) => (
                            <li key={i} className="text-sm text-slate-300 flex items-start gap-2">
                                <ArrowRight className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                                <span className="leading-relaxed">{item}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl p-6">
                 <h3 className="font-bold text-lg mb-4 text-slate-800">{IMPACT_ANALYSIS.tqqq.title}</h3>
                 <ul className="space-y-3">
                    {IMPACT_ANALYSIS.tqqq.items.map((item, i) => (
                        <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
                            <span className="mt-1.5 w-1 h-1 bg-slate-400 rounded-full flex-shrink-0"></span>
                            <span className="leading-relaxed">{item}</span>
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