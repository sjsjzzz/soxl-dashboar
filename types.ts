export enum Trend {
  UP = 'UP',
  DOWN = 'DOWN',
  FLAT = 'FLAT'
}

export interface MarketIndex {
  name: string;
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  trend: Trend;
  source: string;
  impact?: string;
  history?: number[];
}

export interface EtfData extends MarketIndex {
  preMarketPrice?: number;
  preMarketChangePercent?: number;
  nav?: number;
  rsi?: number; 
}

export interface StockTicker {
  symbol: string;
  price: number;
  changePercent: number;
  weight: number; 
  trend: Trend;
  history?: number[];
}

export interface FearGreedData {
  score: number;
  sentiment: string;
  source: string;
}

export interface EarningsEvent {
  name: string;
  symbol: string;
  time: 'BMO' | 'AMC';
  dayOfWeek: string;    // Added: e.g. "Mon", "Tue"
  comment: string;      // Added: Short analysis
}

export interface DailySchedule {
  date: string;
  day: string;
  tags?: string[];
  events: string[];
  earnings?: EarningsEvent[];
}

export interface KeyPoint {
  title: string;
  content: string;
  impact?: string;
}

export interface ImpactAnalysis {
  title: string;
  items: string[];
}

export interface WeeklyFocus {
  title: string;
  description: string;
  notes: { label: string; text: string }[];
}

export interface NewsItem {
  id: number;
  source: string;
  time: string;
  title: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  impact: string; 
  url?: string; 
  category: 'macro' | 'sector'; // Added: To distinguish General vs SOXL specific
}