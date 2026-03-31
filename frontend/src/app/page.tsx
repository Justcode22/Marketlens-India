"use client";

import { useState } from "react";
import { Sidebar } from "@/components/sidebar";
import { TrendDashboard } from "@/components/market/trend-dashboard";
import { BreadthDashboard } from "@/components/market/breadth-dashboard";
import { SectorsDashboard } from "@/components/market/sectors-dashboard";
import { SentimentDashboard } from "@/components/market/sentiment-dashboard";

export default function Home() {
  const [activeTab, setActiveTab] = useState("navigator");

  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-1 overflow-y-auto p-8 bg-[#0a0a0b]">
        {activeTab === "navigator" && <TrendDashboard />}
        {activeTab === "breadth" && <BreadthDashboard />}
        {activeTab === "sentiment" && <SentimentDashboard />}
        {activeTab === "sectors" && <SectorsDashboard />}
        
        {/* Placeholders for upcoming tools */}
        {activeTab === "screener" && (
          <div className="text-center py-20 text-muted-foreground">
            <h2 className="text-2xl font-bold mb-2">Stock Screener</h2>
            <p>Coming soon...</p>
          </div>
        )}
        {activeTab === "calendar" && (
          <div className="text-center py-20 text-muted-foreground">
            <h2 className="text-2xl font-bold mb-2">Economic Calendar</h2>
            <p>Coming soon...</p>
          </div>
        )}
      </main>
    </div>
  );
}
