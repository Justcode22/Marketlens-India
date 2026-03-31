export const API_URL = "http://localhost:8000/api/market";

export async function fetchTrendData(symbol: string, period = "1y", interval = "1d") {
  const res = await fetch(`${API_URL}/trend?symbol=${encodeURIComponent(symbol)}&period=${period}&interval=${interval}`, {
    cache: 'no-store'
  });
  if (!res.ok) throw new Error("Failed to fetch trend data");
  return res.json();
}

export async function fetchBreadthData(period = "1y") {
  const res = await fetch(`${API_URL}/breadth?period=${period}`, {
    cache: 'no-store'
  });
  if (!res.ok) throw new Error("Failed to fetch breadth data");
  return res.json();
}

export async function fetchSectorsData() {
  const res = await fetch(`${API_URL}/sectors`, {
    cache: 'no-store'
  });
  if (!res.ok) throw new Error("Failed to fetch sectors data");
  return res.json();
}
