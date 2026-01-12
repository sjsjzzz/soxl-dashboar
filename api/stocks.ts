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

// ^TNX가 41.5처럼 들어오는 경우 4.15로 보정
const normalizeTnx = (v: number | null) => {
  if (v === null) return null;
  return v > 20 ? v / 10 : v;
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    res.setHeader("Content-Type", "application/json; charset=utf-8");
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

          if (key === "tnx") {
            stock.price = normalizeTnx(stock.price);
            // changePercent는 그대로 둬도 됨 (표시용)
          }

          return [key, stock] as const;
        } catch {
          // 하나 실패해도 전체는 살려주기
          return [key, { price: null, change: null, changePercent: null }] as const;
        }
      })
    );

    const data = Object.fromEntries(entries);
    return res.status(200).json({ ...data, lastUpdated: new Date().toISOString() });
  } catch (e: any) {
    return res.status(500).json({ error: "Failed to fetch stock data", details: String(e?.message || e) });
  }
}
