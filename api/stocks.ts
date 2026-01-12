import yahooFinance from 'yahoo-finance2';

export const config = {
  runtime: 'nodejs', // 호환성을 위해 Node.js 런타임 사용
};

export default async function handler(request: Request) {
  try {
    // 1. 가져올 종목 심볼 정의
    // SOXL, 필라델피아반도체, 나스닥100, 미10년물, 환율, 비트코인, 코스피, VIX
    const symbols = ['SOXL', '^SOX', '^NDX', '^TNX', 'KRW=X', 'BTC-USD', '^KS11', '^VIX'];
    const queryOptions = { modules: ['price', 'summaryDetail'] };
    
    // 2. 야후 파이낸스에서 데이터 병렬 요청 (하나라도 실패해도 나머지는 가져오도록 처리)
    const results = await Promise.all(
      symbols.map(sym => yahooFinance.quoteSummary(sym, queryOptions).catch(e => null))
    );

    // 3. 데이터 포맷 정리
    const data = {
      soxl: formatData(results[0]),
      sox: formatData(results[1]),
      ndx: formatData(results[2]),
      tnx: formatData(results[3]),
      krw: formatData(results[4]),
      btc: formatData(results[5]),
      kospi: formatData(results[6]),
      vix: formatData(results[7]),
      lastUpdated: new Date().toISOString()
    };

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 's-maxage=60, stale-while-revalidate=30' // 1분 캐시
      },
    });

  } catch (error: any) {
    return new Response(JSON.stringify({ error: 'Failed to fetch stock data', details: error.toString() }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

// 헬퍼 함수: 야후 데이터 깔끔하게 정리
function formatData(rawData: any) {
  if (!rawData || !rawData.price) return null;
  
  const price = rawData.price;
  return {
    price: price.regularMarketPrice,
    change: price.regularMarketChange,
    changePercent: (price.regularMarketChangePercent || 0) * 100, // 0.01 단위 -> % 단위 변환
    preMarketPrice: price.preMarketPrice || null,
    preMarketChangePercent: (price.preMarketChangePercent || 0) * 100,
    trend: (price.regularMarketChange || 0) >= 0 ? 'up' : 'down'
  };
}
