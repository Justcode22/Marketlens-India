"use client";

import { useEffect, useState } from "react";
import { fetchTrendData } from "@/lib/api";
import { MarketChart } from "./chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const INDICES = [
  { name: "NIFTY 50", symbol: "^NSEI" },
  { name: "NIFTY BANK", symbol: "^NSEBANK" },
  { name: "NIFTY 500", symbol: "^CRSLDX" },
];

export function TrendDashboard() {
  const [selectedSymbol, setSelectedSymbol] = useState(INDICES[0].symbol);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const response = await fetchTrendData(selectedSymbol, "1y", "1d");
        setData(response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [selectedSymbol]);

  const latestData = data.length > 0 ? data[data.length - 1] : null;

  let trendCondition = "Neutral";
  let trendColor = "text-gray-400";
  let momentum = "Neutral";
  let momentumColor = "text-gray-400";

  let keySupport = "...";
  let keyResistance = "...";

  if (latestData) {
    // Dynamic Trend Condition
    if (latestData.close > latestData.sma200) {
      if (latestData.close > latestData.sma50) {
        trendCondition = "Confirmed Uptrend";
        trendColor = "text-green-500";
      } else {
        trendCondition = "Uptrend Under Pressure";
        trendColor = "text-yellow-500";
      }
    } else {
      if (latestData.close < latestData.sma50) {
        trendCondition = "Confirmed Downtrend";
        trendColor = "text-red-500";
      } else {
        trendCondition = "Downtrend Rally";
        trendColor = "text-yellow-500";
      }
    }

    // Dynamic Momentum
    if (latestData.close > latestData.sma20 && latestData.sma20 > latestData.sma50) {
       momentum = "Strong Positive";
       momentumColor = "text-green-500";
    } else if (latestData.close < latestData.sma20 && latestData.sma20 < latestData.sma50) {
       momentum = "Strong Negative";
       momentumColor = "text-red-500";
    }

    // Basic Support / Resistance based on recent 20-day highs/lows
    const recentData = data.slice(-20);
    const recentLow = Math.min(...recentData.map(d => d.low));
    const recentHigh = Math.max(...recentData.map(d => d.high));
    keySupport = recentLow.toFixed(2);
    keyResistance = recentHigh.toFixed(2);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Market Trend Navigator</h2>
        <Tabs value={selectedSymbol} onValueChange={setSelectedSymbol} className="w-[400px]">
          <TabsList className="grid w-full grid-cols-3">
            {INDICES.map(idx => (
              <TabsTrigger key={idx.symbol} value={idx.symbol}>
                {idx.name}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      <Card className="bg-card">
        <CardHeader>
          <CardTitle>{INDICES.find(i => i.symbol === selectedSymbol)?.name} - 1 Year Daily</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="h-[400px] flex items-center justify-center text-muted-foreground">Loading chart data...</div>
          ) : (
            <MarketChart data={data} type="candlestick" />
          )}
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Trend Condition" value={trendCondition} color={trendColor} />
        <StatCard title="Momentum" value={momentum} color={momentumColor} />
        <StatCard title="Key Support (20D Low)" value={keySupport} color="text-red-500" />
        <StatCard title="Key Resistance (20D High)" value={keyResistance} color="text-green-500" />
      </div>
    </div>
  );
}

function StatCard({ title, value, color }: { title: string, value: string, color: string }) {
  return (
    <Card className="bg-card/50">
      <CardContent className="p-6">
        <h3 className="text-sm font-medium text-muted-foreground mb-2">{title}</h3>
        <p className={`text-xl font-bold ${color}`}>{value}</p>
      </CardContent>
    </Card>
  );
}
