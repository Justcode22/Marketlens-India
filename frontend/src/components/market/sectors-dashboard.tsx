"use client";

import { useEffect, useState } from "react";
import { fetchSectorsData } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export function SectorsDashboard() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [sectors, setSectors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const response = await fetchSectorsData();
        setSectors(response.data);
      } catch (error) {
        console.error("Error fetching sector data", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const formatPerf = (val: number) => {
    if (val > 0) return <span className="text-green-500 font-semibold">+{val}%</span>;
    if (val < 0) return <span className="text-red-500 font-semibold">{val}%</span>;
    return <span className="text-gray-500">{val}%</span>;
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Industry Groups & Leadership</h2>

      <Card className="bg-card">
        <CardHeader>
          <CardTitle>Sector Performance</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-10 text-muted-foreground">Loading Sector Data...</div>
          ) : (
            <div className="rounded-md border border-border">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50 hover:bg-muted/50">
                    <TableHead className="w-[300px]">Sector Name</TableHead>
                    <TableHead className="text-right">1 Day</TableHead>
                    <TableHead className="text-right">1 Week</TableHead>
                    <TableHead className="text-right">1 Month</TableHead>
                    <TableHead className="text-right">3 Months</TableHead>
                    <TableHead className="text-right">6 Months</TableHead>
                    <TableHead className="text-right">1 Year</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sectors.map((sector) => (
                    <TableRow key={sector.symbol} className="hover:bg-muted/30">
                      <TableCell className="font-medium text-primary">{sector.name}</TableCell>
                      <TableCell className="text-right">{formatPerf(sector.performance_1d)}</TableCell>
                      <TableCell className="text-right">{formatPerf(sector.performance_1w)}</TableCell>
                      <TableCell className="text-right bg-primary/10">{formatPerf(sector.performance_1m)}</TableCell>
                      <TableCell className="text-right">{formatPerf(sector.performance_3m)}</TableCell>
                      <TableCell className="text-right">{formatPerf(sector.performance_6m)}</TableCell>
                      <TableCell className="text-right">{formatPerf(sector.performance_1y)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
