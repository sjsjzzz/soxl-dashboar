import React, { useState, useEffect } from 'react';
import { Zap, AlertCircle, RefreshCw, BarChart2, Calendar, TrendingUp, Loader2, ArrowRight, BrainCircuit, Bot, Newspaper, ExternalLink, Globe, Cpu } from 'lucide-react';
import MacroCard from './components/MacroCard';
import RsiBar from './components/RsiBar';
import SparkLine from './components/SparkLine';
import Heatmap from './components/Heatmap';
import { GoogleGenAI } from "@google/genai";
import { 
  WEEKLY_FOCUS as INITIAL_FOCUS, WEEKLY_SCHEDULE as INITIAL_SCHEDULE, IMPACT_ANALYSIS, MARKET_NEWS as INITIAL_NEWS,
  CONSTITUENTS as INITIAL_CONSTITUENTS
} from './constants';
import { WeeklyFocus, NewsItem, DailySchedule } from './types';

// 초기 로딩용 빈 데이터 객체 (에러 방지용)
const EMPTY_STOCK = { price: 0, change: 0, changePercent: 0, trend: 'neutral', source: 'Loading...' };

const App: React.FC = () => {
  const [time, setTime] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string | null>("Initializing...");
  const [error, setError] = useState<string | null>(null);

  // [중요] 개별 상태 대신 통합 상태로 관리 (API 응답과 일치시킴)
  const [stocks, setStocks] = useState<any>({
    soxl: { ...EMPTY_STOCK, price: 0 },
    sox: EMPTY_STOCK,
    ndx: EMPTY_STOCK,
    tnx: EMPTY_STOCK,
    krw: EMPTY_STOCK,
    vix: EMPTY_STOCK,
    btc: EMPTY_STOCK,
    kospi: EMPTY_STOCK
  });
  
  // AI & 기타 상태
  const [weeklyFocus, setWeeklyFocus] = useState<WeeklyFocus>(INITIAL_FOCUS);
  const [marketNews, setMarketNews] = useState<NewsItem[]>(INITIAL_NEWS);
  const [weeklySchedule, setWeeklySchedule] = useState<DailySchedule[]>(INITIAL_SCHEDULE);
  const [constituents, setConstituents] = useState(INITIAL_CONSTITUENTS);

  // 시계
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // 1. 실제 데이터 가져오기 (Yahoo Finance via Vercel API)
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // 아까 만든 api/stocks.ts 호출
      const res = await fetch('/api/stocks'); 
      if (!res.ok) throw new Error('Failed to fetch market data');
      
      const data = await res.json();
      
      // 받아온 데이터를 상태에 적용
      setStocks({
        soxl: { ...data.soxl, source: 'Yahoo', trend: data.soxl.change >= 0 ? 'up' : 'down' },
        sox: { ...data.sox, source: 'Yahoo', trend: data.sox.change >= 0 ? 'up' : 'down' },
        ndx: { ...data.ndx, source: 'Yahoo', trend: data.ndx.change >= 0 ? 'up' : 'down' },
        tnx: { ...data.tnx, source: 'Yahoo', trend: data.tnx.change >= 0 ? 'up' : 'down', price: data.tnx.price },
        krw: { ...data.krw, source: 'Yahoo', trend: data.krw.change >= 0 ? 'down' : 'up' }, 
        vix: { ...data.vix, source: 'Yahoo', trend: data.vix.change >= 0 ? 'down' : 'up' },
        btc: { ...data.btc, source: 'Yahoo', trend: data.btc.change >= 0 ? 'up' : 'down' },
        kospi: { ...data.kospi, source: 'KRX', trend: data.kospi.change >= 0 ? 'up' : 'down' },
      });
      
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (e) {
      console.error(e);
      // 에러 나면 조용히 로그만 찍거나 사용자에게 알림
      setError("실시간 데이터를 불러오지 못했습니다. (잠시 후 다시 시도)");
    } finally {
      setLoading(false);
    }
  };

  // 앱 시작 시 데이터 자동 로드
  useEffect(() => {
    fetchData();
  }, []);

  // 2. AI 분석 로직 (Google Gemini)
  const runAiAnalysis = async () => {
    setAiLoading(true);
    try {
      // [수정] process.env 대신 import.meta.env 사용 (Vite 필수)
      const apiKey = import.meta.env.VITE_API_KEY;
      if (!apiKey) throw new Error("API Key가 설정되지 않았습니다. Vercel 환경변수를 확인하세요.");

      const ai = new GoogleGenAI({ apiKey });
      
      const prompt = `
        You are a Wall Street Quant Analyst for SOXL (3x Semiconductor Bull ETF).
        
        Task 1: Search for exactly 6 REAL-TIME news items (last 24h).
        - 3 General Macro News (category: 'macro'): e.g., Fed rates, Inflation, Geopolitics.
        - 3 Semiconductor Specific News (category: 'sector'): e.g., Nvidia, TSMC, Broadcom.
        
        Task 2: Find the Economic Calendar for the NEXT 5 DAYS.
        
        Task 3: Generate a weekly strategy based on the news.

        Return a JSON object with this schema:
        {
          "weeklyFocus": { "title": "...", "description": "...", "notes": [{"label": "Macro", "text": "..."}] },
          "news": [ { "category": "macro", "source": "...", "time": "...", "title": "...", "sentiment": "negative", "impact": "...", "url": "..." } ],
          "schedule": [ { "date": "...", "day": "...", "tags": ["..."], "events": ["..."] } ]
        }
      `;

      // [수정] 모델명 변경 및 메서드 호출 방식 수정
      const response = await ai.models.generateContent({
        model: 'gemini-2.0-flash-exp', // 최신 모델 사용
        contents: prompt,
        config: {
          tools: [{ googleSearch: {} }], // 검색 기능 활성화
          responseMimeType: "application/json"
        }
      });

      const text = response.text(); // 함수 형태로 호출해야 함
      
      if (text) {
        const result = JSON.parse(text);
        
        if (result.weeklyFocus) setWeeklyFocus(result.weeklyFocus);
        if (result.schedule) setWeeklySchedule(result.schedule);

        // 뉴스 링크 처리 (Grounding Metadata)
        if (result.news && Array.isArray(result.news)) {
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
      }

    } catch (e: any) {
      console.error("AI Analysis Failed", e);
      alert(`AI 분석 오류: ${e.message || "설정을 확인해주세요."}`);
    } finally {
      setAiLoading(false);
    }
  };

  const formatTime = (date: Date) => date.toLocaleTimeString('ko-KR', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const formatDate = (date: Date) => date.toLocaleDateString('ko-KR', { month: 'long', day: 'numeric', weekday: 'long' });

  const renderNewsItem = (news: NewsItem, idx: number) => (
    <div key={idx} className="group cursor-pointer border-b border-slate-100 pb-3 last:border-0 last:pb-0">
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
                    {loading ? 'Updating...' : 'Refresh Prices'}
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
                          {aiLoading ? "Analyzing..." : "Update with Live AI"}
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

        {/* 2. MACRO INDICATORS (Connected to Real Data) */}
        <section className="space-y-4">
          <h3 className="text-slate-800 font-bold text-lg flex items-center gap-2 pl-1">
              <BarChart2 className="w-5 h-5 text-blue-600" />
              Macro Snapshot
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4">
            {/* 소수점 및 콤마 포맷팅 적용 */}
            <MacroCard 
              title="NASDAQ 100" 
              value={stocks.ndx.price?.toLocaleString(undefined, {maximumFractionDigits:0})} 
              change={`${stocks.ndx.changePercent?.toFixed(2)}%`} 
              trend={stocks.ndx.trend} 
              source="Yahoo" 
            />
            <MacroCard 
              title="Phila. Semiconductor" 
              value={stocks.sox.price?.toLocaleString(undefined, {maximumFractionDigits:0})} 
              change={`${stocks.sox.changePercent?.toFixed(2)}%`} 
              trend={stocks.sox.trend} 
              source="Yahoo" 
            />
            <MacroCard 
              title="US 10Y Treasury" 
              value={`${stocks.tnx.price?.toFixed(2)}%`} 
              change={`${stocks.tnx.changePercent?.toFixed(2)}%`} 
              trend={stocks.tnx.trend} 
              source="Yahoo" 
            />
            <MacroCard 
              title="USD/KRW" 
              value={`₩${stocks.krw.price?.toFixed(0)}`} 
              change={`${stocks.krw.changePercent?.toFixed(2)}%`} 
              trend={stocks.krw.trend} 
              source="Yahoo" 
            />
            <MacroCard 
              title="Bitcoin" 
              value={`$${stocks.btc.price?.toLocaleString(undefined, {maximumFractionDigits:0})}`} 
              change={`${stocks.btc.changePercent?.toFixed(2)}%`} 
              trend={stocks.btc.trend} 
              source="Yahoo" 
            />
            <MacroCard 
              title="KOSPI" 
              value={stocks.kospi.price?.toLocaleString(undefined, {maximumFractionDigits:2})} 
              change={`${stocks.kospi.changePercent?.toFixed(2)}%`} 
              trend={stocks.kospi.trend} 
              source="KRX" 
            />
            <MacroCard 
              title="VIX (Volatility)" 
              value={stocks.vix.price?.toFixed(2)} 
              change={`${stocks.vix.changePercent?.toFixed(2)}%`} 
              trend={stocks.vix.trend} 
              source="Yahoo" 
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
                    <div className={`text-6xl font-mono font-bold tracking-tighter ${stocks.soxl.change >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {stocks.soxl.price ? stocks.soxl.price.toFixed(2) : "Loading..."}
                    </div>
                    <div className={`text-xl font-mono font-bold flex items-center gap-2 mt-1 ${stocks.soxl.change >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {stocks.soxl.change >= 0 ? '+' : ''}{stocks.soxl.change?.toFixed(2)} 
                        <span className="bg-slate-100 px-2 rounded text-lg">
                           ({stocks.soxl.changePercent?.toFixed(2)}%)
                        </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-6">
                        <div className="bg-slate-50 rounded-lg p-3 border border-slate-100">
                             <div className="text-[10px] text-slate-500 font-bold uppercase mb-1">Pre-market</div>
                             <div className="flex items-end gap-2">
                                <span className="text-lg font-mono font-bold text-slate-800">
                                    {stocks.soxl.preMarketPrice ? stocks.soxl.preMarketPrice.toFixed(2) : '-'}
                                </span>
                                <span className={`text-xs font-bold ${stocks.soxl.preMarketChangePercent >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                                    {stocks.soxl.preMarketChangePercent ? `${stocks.soxl.preMarketChangePercent.toFixed(2)}%` : ''}
                                </span>
                             </div>
                        </div>
                         <div className="bg-slate-50 rounded-lg p-3 border border-slate-100">
                             <div className="text-[10px] text-slate-500 font-bold uppercase mb-1">RSI (14) Status</div>
                             <RsiBar value={50} /> {/* RSI는 추가 계산 필요, 일단 50으로 고정 */}
                        </div>
                    </div>
                 </div>

                 {/* Right: Big Chart Area */}
                 <div className="w-full md:w-1/2 h-40 md:h-full min-h-[160px] bg-slate-50 rounded-xl border border-slate-200 p-2 relative">
                     <div className="absolute top-2 left-3 text-[10px] font-bold text-slate-400 uppercase z-10">Intraday Trend (Close)</div>
                     <div className="w-full h-full flex items-center justify-center text-slate-300">
                        {/* 스파크라인은 히스토리 데이터가 필요하므로 일단 플레이스홀더 */}
                        <SparkLine data={[]} trend={stocks.soxl.trend} type="area" strokeWidth={3} />
                     </div>
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
             {/* LEFT: CALENDAR */}
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
                             </div>
                        </div>
                    ))}
                </div>
             </div>

             {/* RIGHT: NEWS */}
             <div className="flex flex-col gap-6">
                 <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex-1">
                    <h3 className="text-slate-800 font-bold flex items-center gap-2 mb-4">
                        <Newspaper className="w-5 h-5 text-indigo-600" />
                        Major Market Intelligence
                    </h3>
                    
                    <div className="mb-6">
                       <h4 className="text-xs font-bold text-slate-500 uppercase mb-3 flex items-center gap-1">
                          <Globe className="w-3 h-3" /> Global Macro & Geopolitics
                       </h4>
                       <div className="space-y-3">
                          {marketNews.filter(n => n.category === 'macro' || !n.category).map((n, i) => renderNewsItem(n, i))}
                       </div>
                    </div>

                    <div>
                       <h4 className="text-xs font-bold text-slate-500 uppercase mb-3 flex items-center gap-1">
                          <Cpu className="w-3 h-3" /> Semiconductor & Tech Focus
                       </h4>
                       <div className="space-y-3">
                          {marketNews.filter(n => n.category === 'sector').map((n, i) => renderNewsItem(n, i + 10))}
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
