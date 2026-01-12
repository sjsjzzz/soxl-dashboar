import { DailySchedule, EtfData, FearGreedData, ImpactAnalysis, KeyPoint, MarketIndex, StockTicker, Trend } from './types';

// [DATA SNAPSHOT: REALISTIC NEUTRAL MARKET SCENARIO]
// SOXL Price: $53.95 (Maintained as requested)
// Context: Market taking a breath, awaiting clear direction (Neutral 51)

export const FEAR_GREED_DATA: FearGreedData = {
  score: 51, // Updated to match user image
  sentiment: "Neutral",
  source: "CNN Money"
};

export const NASDAQ_DATA: MarketIndex = {
  name: "나스닥 100",
  symbol: "NDX",
  price: 21650.45, 
  change: 120.10, // Slightly reduced momentum due to Neutral sentiment
  changePercent: 0.55,
  trend: Trend.UP,
  source: "Yahoo Finance",
  impact: "엔비디아 실적 대기하며 눈치보기 장세"
};

// US 10Y TREASURY (Critical for Tech)
export const US_TREASURY_DATA: MarketIndex = {
  name: "미국 10년물 국채",
  symbol: "US10Y",
  price: 4.02, // Slightly up, causing hesitation
  change: 0.04,
  changePercent: 1.05,
  trend: Trend.UP,
  source: "CNBC/Bonds",
  impact: "⚠️ 4.0% 재돌파 시 기술주 단기 조정 가능성"
};

export const KRW_USD_DATA: MarketIndex = {
  name: "원/달러 환율",
  symbol: "USD/KRW",
  price: 1462.50,
  change: 2.10,
  changePercent: 0.14,
  trend: Trend.UP,
  source: "Google Finance",
  impact: "환율 고공행진, 헷지(Hedge) 전략 필요"
};

// Core Data: SOX & SOXL
export const SOX_INDEX: MarketIndex = {
  name: "필라델피아 반도체",
  symbol: "SOX",
  price: 5420.80,
  change: 45.40,
  changePercent: 0.84,
  trend: Trend.UP,
  source: "Google Finance",
  impact: "지수 강보합. 뚜렷한 방향성 부재."
};

export const SOXL_ETF: EtfData = {
  name: "SOXL (3x Bull)",
  symbol: "SOXL",
  price: 53.95, // User Provided Real Price
  change: 4.30,
  changePercent: 8.66, // Keep the big jump from previous day
  trend: Trend.UP,
  preMarketPrice: 53.80, // Slightly down in pre-market reflecting Neutral sentiment
  preMarketChangePercent: -0.28,
  rsi: 58, // Cooled down from 68 due to Neutral sentiment
  source: "Yahoo Finance"
};

export const VIX_DATA = {
  price: 14.20, // Slightly higher volatility
  changePercent: 2.10,
  trend: Trend.UP,
  source: "CBOE",
  impact: "🟡 변동성 확대 조짐. 몰빵 금지."
};

export const CONSTITUENTS: StockTicker[] = [
  { symbol: "NVDA", price: 152.50, changePercent: 0.5, weight: 15, trend: Trend.FLAT },
  { symbol: "AVGO", price: 182.10, changePercent: -0.2, weight: 10, trend: Trend.FLAT },
  { symbol: "AMD", price: 172.40, changePercent: 1.2, weight: 8, trend: Trend.UP },
  { symbol: "TSM", price: 201.50, changePercent: 0.8, weight: 8, trend: Trend.UP },
  { symbol: "QCOM", price: 175.20, changePercent: -0.5, weight: 6, trend: Trend.DOWN },
  { symbol: "INTC", price: 23.05, changePercent: -0.8, weight: 5, trend: Trend.DOWN },
  { symbol: "MU", price: 110.50, changePercent: 1.5, weight: 4, trend: Trend.UP },
  { symbol: "AMAT", price: 205.10, changePercent: 0.2, weight: 4, trend: Trend.FLAT },
];

export const WEEKLY_FOCUS = {
  title: "금주 핵심: 방향성 탐색 (Neutral) 구간 진입",
  description: "공포&탐욕 지수가 51(중립)로 내려왔습니다. 국채 금리가 다시 4%를 넘보며 시장이 숨 고르기에 들어갔습니다. 무조건적인 매수보다는 '확인 후 진입'이 필요한 시점입니다.",
  notes: [
    "Fear & Greed 51: 시장의 광기가 식고 이성이 돌아온 상태.",
    "국채 금리 (US10Y): 4.02% 기록. 기술주 상단을 제한하는 요소.",
    "대응 전략: 현금 비중 30% 확보 후 주요 지지선($50) 테스트 대기."
  ]
};

export const WEEKLY_SCHEDULE: DailySchedule[] = [
  {
    date: "Today", day: "화",
    tags: ["CPI Watch"],
    events: ["🇺🇸 CPI (소비자물가지수) - 인플레 둔화 시 호재", "연준 위원 발언"],
    earnings: [{ name: "Oracle (Cloud)", symbol: "ORCL", time: "AMC" }]
  },
  {
    date: "Tomorrow", day: "수",
    tags: ["PPI"],
    events: ["🇺🇸 PPI (생산자물가지수)", "원유 재고 발표"],
    earnings: [{ name: "Adobe", symbol: "ADBE", time: "AMC" }]
  },
  {
    date: "D+2", day: "목",
    tags: ["SEMI BIG DAY"],
    events: ["★★ TSMC 실적 발표 (SOXL 방향타)", "미국 소매 판매"],
    earnings: [
      { name: "Taiwan Semi", symbol: "TSM", time: "BMO" },
      { name: "Broadcom", symbol: "AVGO", time: "AMC" }
    ]
  },
  {
    date: "D+3", day: "금",
    tags: ["OpEx"],
    events: ["네 마녀의 날 (선물옵션 동시만기)", "미시간대 소비심리"],
    earnings: []
  }
];

export const KEY_POINTS: KeyPoint[] = [
  {
    title: "공포/탐욕 지수 중립 (51)",
    content: "시장이 방향성을 탐색하며 숨 고르기 구간(Neutral)에 진입했습니다. 과매수도 과매도도 아닌 애매한 구간입니다.",
    impact: "💡 '쉬는 것도 투자다'. 무리한 추격 매수보다는 확실한 방향성(국채금리 하락 등) 확인 후 진입 추천."
  },
  {
    title: "SOXL 프리마켓 약보합",
    content: "어제의 급등(+8%) 이후 차익 실현 매물이 나오고 있습니다.",
    impact: "💡 시초가 갭하락 출발 시 $52~$53 지지 여부 확인 필수."
  },
  {
    title: "국채 금리 4% 재진입",
    content: "10년물 금리가 4.02%로 반등하며 기술주 투심을 위축시키고 있습니다.",
    impact: "💡 금리가 더 오르면 SOXL 비중 축소 고려."
  }
];

export const IMPACT_ANALYSIS: { soxl: ImpactAnalysis; tqqq: ImpactAnalysis } = {
  soxl: {
    title: "SOXL (반도체 3배) 트레이딩",
    items: [
      "현재가 $53.95. 단기 급등에 따른 피로감 누적.",
      "Neutral(51) 구간에서는 박스권 등락 가능성 높음.",
      "→ 대응: $50 초반까지 눌림목 기다리거나, 분할 매수로 접근.",
      "→ 손절 라인: $48 이탈 시 비중 축소."
    ]
  },
  tqqq: {
    title: "TQQQ (나스닥 3배) 트레이딩",
    items: [
      "국채 금리 상승에 민감하게 반응 중.",
      "빅테크 실적 발표 전까지 횡보 예상.",
      "→ 대응: 공격적 매수 자제. 관망세 유지."
    ]
  }
};