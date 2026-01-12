import React, { useState, useEffect } from 'react';
import {
  Zap, AlertCircle, RefreshCw, BarChart2, Calendar, TrendingUp, Loader2, ArrowRight,
  BrainCircuit, Bot, Newspaper, ExternalLink, Globe, Cpu
} from 'lucide-react';

import MacroCard from './components/MacroCard';
import RsiBar from './components/RsiBar';
import SparkLine from './components/SparkLine';
import Heatmap from './components/Heatmap';

import {
  WEEKLY_FOCUS as INITIAL_FOCUS,
  WEEKLY_SCHEDULE as INITIAL_SCHEDULE,
  IMPACT_ANALYSIS,
  MARKET_NEWS as INITIAL_NEWS,
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

import { WeeklyFocus, NewsItem, DailySchedule } from './types';

// 초기 로딩용 빈 데이터
const EMPTY_STOCK = { price: 0, change: 0, changePercent: 0, trend: 'neutral', source: 'Loading...', history: [] };

const has = (v: any) => v !== null && v !== undefined;

const App: React.FC = () => {
  const [time, setTime] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string | null>("Initializing...");
  const [error, setError] = useState<string | null>(null);
  const [dataSource, setDataSource] = useState<string>("API");

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

  const [weeklyFocus, setWeeklyFocus] = useState<WeeklyFocus>(INITIAL_FOCUS);
  const [marketNews, setMarketNews] = useState<NewsItem[]>(INITIAL_NEWS);
  const [weeklySchedule, setWeeklySchedule] = useState<DailySchedule[]>(INITIAL_SCHEDULE);
  const [constituents, setConstituents] = useState(INITIAL_CONSTITUENTS);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // 가짜 차트 데이터 생성 (화면이 비어보이지 않게)
  const generateMockHistory = (startPrice: number, changePercent: number) => {
    const points = 20;
    const history: any[] = [];
    if (!startPrice) return [];

    let current = startPrice / (1 + (changePercent || 0) / 100);
    const step = (startPrice - current) / points;

    for (let i = 0; i < points; i++) {
      const noise = (Math.random() - 0.5) * (startPrice * 0.005);
      history.push({ price: current + (step * i) + noise });
    }
    history.push({ price: startPrice });
    return history;
  };

  const updateStocksState = (data: any, sourceLabel: string) => {
    // data[key]가 null이어도 화면이 안 깨지게 완전 방어
    const safe = (item: any) => item ?? { ...EMPTY_STOCK, price: 0, change: 0, changePercent: 0 };

    const process = (item: any) => {
      const it = safe(item);

      const price = typeof it.price === "number" ? it.price : 0;
      const change = typeof it.change === "number" ? it.change : 0;
      const changePercent = typeof it.changePercent === "number" ? it.changePercent : 0;

      return {
        ...it,
        price,
        change,
        changePercent,
        source: sourceLabel,
        trend: change >= 0 ? 'up' : 'down',
        history: it.history && it.history.length > 0 ? it.history : generateMockHistory(price, changePercent)
      };
    };

    setStocks({
      soxl: process(data?.soxl),
      sox: process(data?.sox),
      ndx: process(data?.ndx),
      tnx: process(data?.tnx),
      krw: process(data?.krw),
      vix: process(data?.vix),
      btc: process(data?.btc),
      kospi: process(data?.kospi),
    });

    setDataSource(sourceLabel);
    setLastUpdated(new Date().toLocaleTimeString());
    setError(null);
  };

  // 1) 가격 데이터 가져오기: /api/stocks만 사용 (AI 가격 백업 제거)
  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/stocks', { cache: "no-store" });
      if (!res.ok) throw new Error(`API error: ${res.status}`);
      const data = await res.json();

      updateStocksState(data, 'Yahoo API');
    } catch (e: any) {
      console.warn("API 접속 실패 → 데모 모드", e);
      setError("데이터 연결 실패. (데모 모드)");

      const demoWithHistory = (item: any) => ({
        ...item,
        history: generateMockHistory(item.price, item.changePercent)
      });

      setStocks({
        soxl: demoWithHistory(INITIAL_SOXL),
        sox: demoWithHistory(INITIAL_SOX),
        ndx: demoWithHistory(INITIAL_NDX),
        tnx: demoWithHistory(INITIAL_TNX),
        krw: demoWithHistory(INITIAL_KRW),
        vix: demoWithHistory(INITIAL_VIX),
        btc: demoWithHistory(INITIAL_BTC),
        kospi: demoWithHistory(INITIAL_KOSPI),
      });

      setDataSource("Demo Mode");
      setLastUpdated(new Date().toLocaleTimeString());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // 2) AI 뉴스/전략: 서버 API로만 호출
  const runAiAnalysis = async () => {
    setAiLoading(true);
    try {
      const res = await fetch("/api/ai-analysis", { method: "POST" });
      if (!res.ok) {
        const t = await res.text();
        throw new Error(t);
      }
      const resultData = await res.json();

      if (resultData.weeklyFocus) setWeeklyFocus(resultData.weeklyFocus);
      if (resultData.schedule) setWeeklySchedule(resultData.schedule);
      if (resultData.news) setMarketNews(resultData.news);

    } catch (e: any) {
      alert(`AI 오류: ${e.message}`);
    } finally {
      setAiLoading(false);
    }
  };

  const formatTime = (date: Date) =>
    date.toLocaleTimeString('ko-KR', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });

  const formatDate = (date: Date) =>
    date.toLocaleDateString('ko-KR', { month: 'long', day: 'numeric', weekday: 'long' });

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
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-30 shadow-sm">
        <div classNam
