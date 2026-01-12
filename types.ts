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
  impact?: string; // Added: Simple explanation for traders
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
  trend: Trend; // Added: Trend for Heatmap sparklines
}

export interface FearGreedData {
  score: number;
  sentiment: string;
  source: string;
}

export interface DailySchedule {
  date: string;
  day: string;
  tags?: string[];
  events: string[];
  earnings?: { name: string; symbol: string; time: 'BMO' | 'AMC' }[];
}

export interface KeyPoint {
  title: string;
  content: string;
  impact: string;
}

export interface ImpactAnalysis {
  title: string;
  items: string[];
}