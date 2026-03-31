"use client";

import { useEffect, useRef } from "react";
import { createChart, ColorType, CandlestickSeries, LineSeries } from "lightweight-charts";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function MarketChart({ data, type = "candlestick", title }: { data: any[], type?: "line" | "candlestick", title?: string }) {
  const chartContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;
    if (!data || data.length === 0) return;

    const handleResize = () => {
      chart.applyOptions({ width: chartContainerRef.current!.clientWidth });
    };

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: "transparent" },
        textColor: "#d1d5db",
      },
      grid: {
        vertLines: { color: "#374151" },
        horzLines: { color: "#374151" },
      },
      width: chartContainerRef.current.clientWidth,
      height: 400,
      rightPriceScale: {
        borderColor: "#374151",
      },
      timeScale: {
        borderColor: "#374151",
      },
    });

    if (type === "candlestick") {
      const series = chart.addSeries(CandlestickSeries, {
        upColor: "#10b981",
        downColor: "#ef4444",
        borderDownColor: "#ef4444",
        borderUpColor: "#10b981",
        wickDownColor: "#ef4444",
        wickUpColor: "#10b981",
      });
      series.setData(data.map(d => ({
        time: d.time,
        open: d.open,
        high: d.high,
        low: d.low,
        close: d.close,
      })));

      if (data.some(d => d.sma20 !== undefined)) {
        const sma20Series = chart.addSeries(LineSeries, { color: "#3b82f6", lineWidth: 1 });
        sma20Series.setData(data.filter(d => d.sma20 !== null && d.sma20 !== undefined).map(d => ({ time: d.time, value: d.sma20 })));
      }
      if (data.some(d => d.sma50 !== undefined)) {
        const sma50Series = chart.addSeries(LineSeries, { color: "#eab308", lineWidth: 1 });
        sma50Series.setData(data.filter(d => d.sma50 !== null && d.sma50 !== undefined).map(d => ({ time: d.time, value: d.sma50 })));
      }
      if (data.some(d => d.sma200 !== undefined)) {
        const sma200Series = chart.addSeries(LineSeries, { color: "#ef4444", lineWidth: 2 });
        sma200Series.setData(data.filter(d => d.sma200 !== null && d.sma200 !== undefined).map(d => ({ time: d.time, value: d.sma200 })));
      }

    } else {
      const series = chart.addSeries(LineSeries, {
        color: "#3b82f6",
        lineWidth: 2,
      });
      series.setData(data.map(d => ({
        time: d.time,
        value: d.close !== undefined ? d.close : d.value,
      })));
    }

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      chart.remove();
    };
  }, [data, type]);

  return (
    <div className="w-full relative">
      {title && <h3 className="absolute top-4 left-4 z-10 text-white font-semibold">{title}</h3>}
      <div ref={chartContainerRef} className="w-full h-[400px]" />
    </div>
  );
}
