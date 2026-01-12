// import yahooFinance from 'yahoo-finance2';

// NOTE: This file is currently disabled to ensure client-side build success.
// Since we removed 'yahoo-finance2' from package.json (as it causes issues in browser builds),
// we cannot use this server-side logic in the current configuration.
// The frontend (App.tsx) is currently using Dummy Data or Client-Side Logic.

export default async function handler(request: Request) {
  return new Response(JSON.stringify({ message: "API currently disabled for static build" }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}
