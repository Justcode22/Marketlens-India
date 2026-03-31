"use client";

import { useEffect, useState } from "react";
import { fetchTrendData } from "@/lib/api";
import { MarketChart } from "./chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function SentimentDashboard() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const response = await fetchTrendData("^INDIAVIX", "1y", "1d");
        setData(response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const latestVix = data.length ? data[data.length - 1]?.close : null;
  
  let sentimentStr = "Neutral";
  let sentimentColor = "text-gray-400";
  
  if (latestVix) {
    if (latestVix > 25) {
      sentimentStr = "Extreme Fear / High Volatility";
      sentimentColor = "text-red-500";
    } else if (latestVix > 18) {
      sentimentStr = "Fear / Elevated Volatility";
      sentimentColor = "text-yellow-500";
    } else if (latestVix < 13) {
      sentimentStr = "Greed / Low Volatility";
      sentimentColor = "text-green-500";
    } else {
      sentimentStr = "Neutral";
      sentimentColor = "text-gray-400";
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Market Sentiment</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <SentimentStat title="India VIX" value={latestVix?.toFixed(2) || "..."} color="text-white" />
        <SentimentStat title="Sentiment Level" value={sentimentStr} color={sentimentColor} />
      </div>

      <Card className="bg-card">
        <CardHeader>
          <CardTitle>India VIX (Volatility Index)</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="h-[400px] flex items-center justify-center text-muted-foreground">Loading chart data...</div>
          ) : (
            <MarketChart data={data} type="line" />
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function SentimentStat({ title, value, color }: { title: string, value: string, color: string }) {
  return (
    <Card className="bg-card/50">
      <CardContent className="p-6">
        <h3 className="text-sm font-medium text-muted-foreground mb-2">{title}</h3>
        <p className={`text-xl font-bold ${color}`}>{value}</p>
      </CardContent>
    </Card>
  );
}
