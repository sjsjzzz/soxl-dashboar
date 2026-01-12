// api/ai-analysis.ts
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { GoogleGenAI } from "@google/genai";

export const config = {
  runtime: "nodejs",
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "Missing GEMINI_API_KEY (set in Vercel env vars)" });
    }

    const ai = new GoogleGenAI({ apiKey });

    const prompt = `
Role: Wall Street Quant Analyst for SOXL.

Return JSON only (no markdown), with keys:
{
  "weeklyFocus": { "title": string, "description": string, "notes": [{ "label": string, "text": string }] },
  "schedule": [{ "date": string, "day": string, "tags": string[], "events": string[] }],
  "news": [{ "category":"macro"|"sector", "source": string, "time": string, "title": string, "impact": string, "sentiment":"positive"|"negative"|"neutral", "url": string }]
}

Task:
1) 6 news items (3 macro, 3 sector)
2) Economic calendar next 5 days (forecast)
3) Weekly strategy for SOXL
`;

    // JSON 강제 (파싱지옥 방지)
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const text = response.text;
    const json = JSON.parse(text);

    return res.status(200).json(json);
  } catch (e: any) {
    return res.status(500).json({
      error: "AI analysis failed",
      details: String(e?.message || e),
    });
  }
}
