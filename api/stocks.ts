// api/stocks.ts
import type { VercelRequest, VercelResponse } from "@vercel/node";
import yahooFinance from "yahoo-finance2";

export const config = {
  runtime: "nodejs",
};

type Stock = {
  price: number | null;
  change: number | null;
  changePercent: number | null;
  preMarketPrice?: number | null;
  preMarketChangePercent?: number | null;
};

const toNum = (v: any): number | null => {
  if (typeof v === "number") return v;
  if (v && typeof v.raw === "number") return v.raw;
  return null;
};

// ^TNX가 41.5(=4.15%)처럼 들어오는 경우를 보정
const normalizeTnx = (v: number | null) => {
  if (v === null) return null;
  // 경험적으로 ^TNX가 20보다 크면 10으로 나누면 %로 맞는 경우가 많음
  return v > 20 ? v / 10 : v;
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    // 캐시: 30초는 캐시, 백그라운드로 5분까지 재검증
    res.setHeader("Cache-Control", "s-maxage=30, stale-while-revalidate=300");

    const symbols = {
      soxl: "SOXL",
      sox: "^SOX",
      ndx: "^NDX",
      tnx: "^TNX",
      krw: "KRW=X",
      btc: "BTC-USD",
      kospi: "^KS11",
      vix: "^VIX",
    } as const;

    const entries = await Promise.all(
      Object.entries(symbols).map(async ([key, sym]) => {
        try {
          const q: any = await yahooFinance.quote(sym);

          const stock: Stock = {
            price: toNum(q.regularMarketPrice),
            change: toNum(q.regularMarketChange),
            changePercent: toNum(q.regularMarketChangePercent),
            preMarketPrice: toNum(q.preMarketPrice),
            preMarketChangePercent: toNum(q.preMarketChangePercent),
          };

          // ^TNX 보정
          if (key === "tnx") {
            stock.price = normalizeTnx(stock.price);
          }

          return [key, stock] as const;
        } catch {
          // 하나 실패해도 전체를 살림
          return [key, { price: null, change: null, changePercent: null }] as const;
        }
      })
    );

    const data = Object.fromEntries(entries);
    return res.status(200).json({
      ...data,
      lastUpdated: new Date().toISOString(),
    });
  } catch (e: any) {
    return res.status(500).json({
      error: "Failed to fetch stock data",
      details: String(e?.message || e),
    });
  }
}
