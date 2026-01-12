import { DailySchedule, EtfData, FearGreedData, ImpactAnalysis, KeyPoint, MarketIndex, StockTicker, Trend, WeeklyFocus, NewsItem } from './types';

// [DATA SNAPSHOT]

export const FEAR_GREED_DATA: FearGreedData = {
  score: 62,
  sentiment: "Greed",
  source: "CNN Money"
};

export const KOSPI_DATA: MarketIndex = {
  name: "코스피",
  symbol: "KOSPI",
  price: 2680.50,
  change: 12.30,
  changePercent: 0.46,
  trend: Trend.UP,
  source: "KRX",
  impact: "외국인 순매수 전환 여부 관건",
  history: [2650, 2660, 2655, 2670, 2680.50]
};

export const BITCOIN_DATA: MarketIndex = {
  name: "비트코인",
  symbol: "BTC-USD",
  price: 98500.00,
  change: 2500.00,
  changePercent: 2.80,
  trend: Trend.UP,
  source: "CoinBase",
  impact: "🚀 100K 코앞. 위험자산 선호 심리 자극.",
  history: [95000, 96000, 97500, 98000, 98500] 
};

export const NASDAQ_DATA: MarketIndex = {
  name: "나스닥 100",
  symbol: "NDX",
  price: 21700.10, 
  change: 150.25,
  changePercent: 0.70,
  trend: Trend.UP,
  source: "Yahoo Finance",
  impact: "전고점 돌파 시도. 실패 시 쌍봉 우려.",
  history: [21500, 21600, 21550, 21650, 21700]
};

export const US_TREASURY_DATA: MarketIndex = {
  name: "미국 10년물 국채",
  symbol: "US10Y",
  price: 4.15, 
  change: 0.05,
  changePercent: 1.2,
  trend: Trend.UP,
  source: "CNBC/Bonds",
  impact: "📈 국채금리 반등은 기술주(SOXL) 밸류에 부담.",
  history: [4.05, 4.08, 4.10, 4.12, 4.15]
};

export const KRW_USD_DATA: MarketIndex = {
  name: "원/달러 환율",
  symbol: "USD/KRW",
  price: 1455.00,
  change: -7.50,
  changePercent: -0.51,
  trend: Trend.DOWN,
  source: "Google Finance",
  impact: "환율 안정세. 외국인 수급 개선 기대.",
  history: [1470, 1465, 1462, 1460, 1455]
};

export const SOX_INDEX: MarketIndex = {
  name: "필라델피아 반도체",
  symbol: "SOX",
  price: 5450.20,
  change: 60.50,
  changePercent: 1.12,
  trend: Trend.UP,
  source: "Google Finance",
  impact: "📈 5,500p 안착 시 상승 랠리 재개 가능성.",
  history: [5350, 5380, 5400, 5420, 5450]
};

export const SOXL_ETF: EtfData = {
  name: "SOXL (3x Bull)",
  symbol: "SOXL",
  price: 54.50,
  change: 1.55,
  changePercent: 2.93,
  trend: Trend.UP,
  preMarketPrice: 54.85,
  preMarketChangePercent: 0.64,
  rsi: 62,
  source: "Yahoo Finance",
  history: [50, 51.5, 52.8, 53.2, 54.50]
};

export const VIX_DATA = {
  price: 13.80,
  changePercent: -2.8,
  trend: Trend.DOWN,
  source: "CBOE",
  impact: "🟢 공포 완화. 매수 심리 회복 중.",
  history: [14.5, 14.2, 14.0, 13.9, 13.8]
};

export const CONSTITUENTS: StockTicker[] = [
  { symbol: "NVDA", price: 154.20, changePercent: 1.1, weight: 15, trend: Trend.UP },
  { symbol: "AVGO", price: 183.50, changePercent: 0.8, weight: 10, trend: Trend.UP },
  { symbol: "AMD", price: 174.10, changePercent: 1.5, weight: 8, trend: Trend.UP },
  { symbol: "TSM", price: 202.00, changePercent: 0.2, weight: 8, trend: Trend.FLAT },
  { symbol: "QCOM", price: 176.50, changePercent: 0.7, weight: 6, trend: Trend.UP },
  { symbol: "INTC", price: 22.80, changePercent: -1.1, weight: 5, trend: Trend.DOWN },
  { symbol: "MU", price: 112.10, changePercent: 1.8, weight: 4, trend: Trend.UP },
  { symbol: "AMAT", price: 206.50, changePercent: 0.5, weight: 4, trend: Trend.UP },
];

// Initial Static Data (Will be overwritten by AI)
export const MARKET_NEWS: NewsItem[] = [
  // MACRO NEWS (3 Items)
  { 
    id: 1, 
    category: 'macro',
    source: "Breaking", 
    time: "1시간 전", 
    title: "미 법무부(DOJ), 파월 연준 의장 전격 고소 검토", 
    sentiment: 'negative',
    impact: "📉 연준 독립성 훼손 우려 → 시장 불확실성 증가로 VIX 급등 가능성"
  },
  { 
    id: 2, 
    category: 'macro',
    source: "Geopolitics", 
    time: "30분 전", 
    title: "백악관, 이란 핵 시설 겨냥한 군사 옵션 논의 중", 
    sentiment: 'negative',
    impact: "🛢️ 유가 급등 및 지정학적 리스크 → 위험자산(SOXL) 회피 심리 자극"
  },
  { 
    id: 3, 
    category: 'macro',
    source: "Fed Watch", 
    time: "2시간 전", 
    title: "연준 윌러 이사, '인플레 둔화 시 추가 금리인하 지지'", 
    sentiment: 'positive',
    impact: "🏦 금리 인하 기대감 유지 → 기술주 밸류에이션 방어 요인"
  },
  // SECTOR NEWS (3 Items)
  { 
    id: 4, 
    category: 'sector',
    source: "Bloomberg", 
    time: "1시간 전", 
    title: "젠슨 황 \"블랙웰 수요, 공급을 훨씬 초과... 2025년 완판\"", 
    sentiment: 'positive',
    impact: "🔥 엔비디아 실적 기대감 유지 → SOXL 하방 지지 역할"
  },
  { 
    id: 5, 
    category: 'sector',
    source: "Reuters", 
    time: "3시간 전", 
    title: "TSMC, 미국 애리조나 공장 12월 첫 웨이퍼 양산 성공", 
    sentiment: 'positive',
    impact: "🏭 공급망 리스크 완화 및 미국 내 생산 능력 입증"
  },
  { 
    id: 6, 
    category: 'sector',
    source: "TechCrunch", 
    time: "4시간 전", 
    title: "브로드컴(AVGO), 오픈AI와 차세대 추론 칩 공동 개발 협의", 
    sentiment: 'positive',
    impact: "🤖 커스텀 칩 시장 확대 → 비메모리 반도체 섹터 호재"
  }
];

export const WEEKLY_FOCUS: WeeklyFocus = {
  title: "📢 금주 핵심 전략: '정치적 노이즈 vs AI 펀더멘털'",
  description: "파월 의장 관련 정치적 리스크와 중동 지정학적 긴장이 고조되고 있습니다. 변동성 관리에 주력하십시오.",
  notes: [
    { label: "Geopolitics", text: "⚠️ 이란 관련 뉴스 플로우에 따라 유가/국채금리 급등락 주의." },
    { label: "Fed Risk", text: "🏛️ DOJ-연준 갈등 심화 시 시장은 '불확실성'을 가장 싫어함. 현금 비중 확대 권장." },
    { label: "Action", text: "🛑 SOXL 신규 진입 자제. $51 지지선 이탈 시 헷지(SOXS) 고려." }
  ]
};

const getFormattedDate = (offset: number) => {
  const date = new Date();
  date.setDate(date.getDate() + offset);
  const dayName = date.toLocaleDateString('ko-KR', { weekday: 'short' });
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${month}/${day} (${dayName})`;
};

export const WEEKLY_SCHEDULE: DailySchedule[] = [
  {
    date: getFormattedDate(0), day: "오늘",
    tags: ["지정학적 리스크"],
    events: [
      "🏛️ 미 법무부-연준 갈등 관련 백악관 브리핑 예정",
      "🇮🇷 이란 관련 안보리 긴급 회의 가능성"
    ],
    earnings: [{ 
      name: "Oracle", 
      symbol: "ORCL", 
      time: "AMC",
      dayOfWeek: "Tue",
      comment: "클라우드 매출 성장률이 핵심. AI 데이터센터 수요 가늠자."
    }]
  },
  {
    date: getFormattedDate(1), day: "내일",
    tags: ["PPI", "유가"],
    events: [
      "🇺🇸 22:30 생산자물가지수(PPI) 발표",
      "🛢️ 원유 재고 발표"
    ],
    earnings: [{ 
      name: "Adobe", 
      symbol: "ADBE", 
      time: "AMC",
      dayOfWeek: "Thu",
      comment: "생성형 AI 'Firefly' 수익화 현황 체크 필요."
    }]
  },
  {
    date: getFormattedDate(2), day: "D+2",
    tags: ["TSMC"],
    events: ["🇹🇼 TSMC 실적 발표 (AI 칩 가이던스 주목)"],
    earnings: [
      { 
        name: "Taiwan Semi", 
        symbol: "TSM", 
        time: "BMO",
        dayOfWeek: "Thu",
        comment: "전 세계 AI 칩 수요의 바로미터. 가이던스가 주가 향방 결정."
      }
    ]
  },
  {
    date: getFormattedDate(3), day: "D+3",
    tags: ["소비심리"],
    events: ["🇺🇸 미시간대 소비심리지수 발표"],
    earnings: []
  },
  {
    date: getFormattedDate(4), day: "D+4",
    tags: ["휴장 여부 확인"],
    events: ["주말을 앞둔 포지션 정리 물량 주의"],
    earnings: []
  },
];

export const IMPACT_ANALYSIS: { soxl: ImpactAnalysis; tqqq: ImpactAnalysis } = {
  soxl: {
    title: "⚡ SOXL 트레이딩 가이드",
    items: [
      "현재가 $54.50. 매크로 악재(전쟁/정치)로 상단 제한.",
      "지지선: $51.00 (강력), 이탈 시 $46.00까지 열림.",
      "→ 뉴스에 민감한 장세. 오버나잇 리스크 관리 필수."
    ]
  },
  tqqq: {
    title: "⚡ TQQQ 트레이딩 가이드",
    items: [
      "나스닥, 국채금리 4.15% 돌파 시 조정 가능성.",
      "빅테크 실적 발표 전까지 관망 심리 우세.",
      "→ 분할 매수보다는 확실한 방향성 확인 후 진입."
    ]
  }
};