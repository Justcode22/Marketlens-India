"use client";

import { useEffect, useState } from "react";
import { fetchBreadthData } from "@/lib/api";
import { MarketChart } from "./chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function BreadthDashboard() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const response = await fetchBreadthData("1y");
        setData(response.data);
      } catch (error) {
        console.error("Error fetching breadth data", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) return <div>Loading Market Breadth...</div>;
  if (!data.length) return <div>No Breadth data available.</div>;

  const advanceDeclineLine = data.map((d, i) => {
    const prev = i > 0 ? data[i-1].ad_line || 0 : 0;
    const net = d.advance - d.decline;
    d.ad_line = prev + net;
    return { time: d.time, value: d.ad_line };
  });

  const percentAbove50MA = data.map(d => ({
    time: d.time,
    value: d.above_50dma
  }));

  const netNewHighsLows = data.map(d => ({
    time: d.time,
    value: d.new_high - d.new_low
  }));

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Market Breadth (Nifty 500)</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <BreadthStat title="Advances" value={data[data.length - 1].advance} color="text-green-500" />
        <BreadthStat title="Declines" value={data[data.length - 1].decline} color="text-red-500" />
        <BreadthStat title="% Above 50 DMA" value={`${data[data.length - 1].above_50dma}%`} color="text-blue-400" />
      </div>

      <Card className="bg-card">
        <CardHeader>
          <CardTitle>Advance/Decline Line</CardTitle>
        </CardHeader>
        <CardContent>
          <MarketChart data={advanceDeclineLine} type="line" />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-card">
          <CardHeader>
            <CardTitle>% Above 50-Day Moving Average</CardTitle>
          </CardHeader>
          <CardContent>
            <MarketChart data={percentAbove50MA} type="line" />
          </CardContent>
        </Card>

        <Card className="bg-card">
          <CardHeader>
            <CardTitle>Net New 52-Week Highs/Lows</CardTitle>
          </CardHeader>
          <CardContent>
            <MarketChart data={netNewHighsLows} type="line" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function BreadthStat({ title, value, color }: { title: string, value: string | number, color: string }) {
  return (
    <Card className="bg-card/50">
      <CardContent className="p-6">
        <h3 className="text-sm font-medium text-muted-foreground mb-2">{title}</h3>
        <p className={`text-3xl font-bold ${color}`}>{value}</p>
      </CardContent>
    </Card>
  );
}
