import yahooFinance from 'yahoo-finance2';

// Helper: Calculate RSI
function calculateRSI(closes: number[], period: number = 14): number {
  if (!closes || closes.length < period + 1) return 50; // Not enough data

  let gains = 0;
  let losses = 0;

  // Calculate initial average gain/loss
  for (let i = 1; i <= period; i++) {
    const change = closes[i] - closes[i - 1];
    if (change > 0) gains += change;
    else losses += Math.abs(change);
  }

  let avgGain = gains / period;
  let avgLoss = losses / period;

  // Calculate smoothed averages for the rest
  for (let i = period + 1; i < closes.length; i++) {
    const change = closes[i] - closes[i - 1];
    const gain = change > 0 ? change : 0;
    const loss = change > 0 ? 0 : Math.abs(change);

    avgGain = (avgGain * (period - 1) + gain) / period;
    avgLoss = (avgLoss * (period - 1) + loss) / period;
  }

  if (avgLoss === 0) return 100;
  const rs = avgGain / avgLoss;
  return 100 - (100 / (1 + rs));
}

export default async function handler(request: Request) {
  try {
    // 1. Fetch Chart Data (History) to enable Sparklines and RSI
    // Use '1mo' range with '1d' interval for daily trend.
    // Added: ^KS11 (KOSPI)
    // Symbols: SOXL, ^SOX, ^NDX, ^TNX, KRW=X, ^VIX, BTC-USD, ^KS11
    const symbols = ['SOXL', '^SOX', '^NDX', '^TNX', 'KRW=X', '^VIX', 'BTC-USD', '^KS11'];
    
    // YahooFinance2 'chart' is better for history than 'quote'
    const chartPromises = symbols.map(sym => 
      yahooFinance.chart(sym, { period1: '1mo', interval: '1d' })
        .catch(e => ({ meta: { symbol: sym }, quotes: [] })) // Fallback on error
    );

    const charts = await Promise.all(chartPromises);

    // 2. Fetch Heatmap Constituents
    const constituentSymbols = ['NVDA', 'AVGO', 'AMD', 'TSM', 'QCOM', 'INTC', 'MU', 'AMAT'];
    const constituentsQuotes = await yahooFinance.quote(constituentSymbols);

    // Helper to process chart data
    const processChart = (symbol: string) => {
      const chart = charts.find((c: any) => c.meta.symbol === symbol);
      if (!chart || !chart.quotes || chart.quotes.length === 0) return null;
      
      const quotes = chart.quotes;
      const current = quotes[quotes.length - 1];
      const prev = quotes[quotes.length - 2] || current;
      
      // Extract close prices for sparkline
      const history = quotes.map((q: any) => q.close).filter((c: any) => c !== null);
      
      return {
        price: current.close || current.open, // Fallback
        prevClose: prev.close,
        change: current.close - prev.close,
        changePercent: ((current.close - prev.close) / prev.close) * 100,
        history: history,
        // Calculate RSI only if history > 14
        rsi: calculateRSI(history)
      };
    };

    const soxlData = processChart('SOXL');
    const soxData = processChart('^SOX');
    const ndxData = processChart('^NDX');
    const tnxData = processChart('^TNX');
    const krwData = processChart('KRW=X');
    const vixData = processChart('^VIX');
    const btcData = processChart('BTC-USD');
    const kospiData = processChart('^KS11');

    // Quote fallback for pre-market data
    const soxlQuote = await yahooFinance.quote('SOXL');

    const payload = {
      timestamp: new Date().toISOString(),
      market: {
        soxl: {
          price: soxlQuote.regularMarketPrice || soxlData?.price || 0,
          change: soxlQuote.regularMarketChange || soxlData?.change || 0,
          changePercent: soxlQuote.regularMarketChangePercent || soxlData?.changePercent || 0,
          preMarketPrice: soxlQuote.preMarketPrice || soxlQuote.regularMarketPrice,
          preMarketChangePercent: soxlQuote.preMarketChangePercent || 0,
          history: soxlData?.history || [],
          rsi: soxlData?.rsi || 50
        },
        sox: {
          price: soxData?.price || 0,
          changePercent: soxData?.changePercent || 0,
          history: soxData?.history || []
        },
        ndx: {
          price: ndxData?.price || 0,
          changePercent: ndxData?.changePercent || 0,
          history: ndxData?.history || []
        },
        tnx: {
          price: tnxData?.price || 0,
          changePercent: tnxData?.changePercent || 0,
          history: tnxData?.history || []
        },
        krw: {
          price: krwData?.price || 0,
          change: krwData?.change || 0,
          changePercent: krwData?.changePercent || 0,
          history: krwData?.history || []
        },
        vix: {
          price: vixData?.price || 0,
          changePercent: vixData?.changePercent || 0,
          history: vixData?.history || []
        },
        btc: {
          price: btcData?.price || 0,
          change: btcData?.change || 0,
          changePercent: btcData?.changePercent || 0,
          history: btcData?.history || []
        },
        kospi: {
          price: kospiData?.price || 0,
          change: kospiData?.change || 0,
          changePercent: kospiData?.changePercent || 0,
          history: kospiData?.history || []
        }
      },
      constituents: constituentsQuotes.map(q => ({
        symbol: q.symbol,
        price: q.regularMarketPrice || 0,
        changePercent: q.regularMarketChangePercent || 0,
      }))
    };

    return new Response(JSON.stringify(payload), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 's-maxage=60, stale-while-revalidate=30',
      },
    });

  } catch (error: any) {
    return new Response(JSON.stringify({ error: 'Failed to fetch data', details: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}