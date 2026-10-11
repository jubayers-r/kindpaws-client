"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { motion } from "motion/react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { CARD, rise } from "@/components/dashboard/shared/styles";
import QueryError from "@/components/dashboard/shared/QueryError";

const COLORS = ["#EA8F06", "#463933", "#F2C078", "#B08968"];

export default function TagCloud() {
  const { data, isLoading, error, refetch } = useQuery<Record<string, number>>({
    queryKey: ["categoryData"],
    queryFn: async () => {
      const res = await fetch("/api/stats/categories");
      if (!res.ok) throw new Error("Failed to fetch category data");
      return res.json();
    },
  });

  const chartData = data
    ? Object.entries(data).map(([name, value]) => ({ name, value }))
    : [];

  return (
    <motion.div {...rise(0.1)}>
      <Card className={`${CARD} h-full`}>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-secondary">
            Pet Category Insights
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center">
          {isLoading ? (
            <div className="flex h-[300px] w-full items-center justify-center">
              <Skeleton className="h-48 w-48 rounded-full" />
            </div>
          ) : error ? (
            <div className="w-full py-8">
              <QueryError
                message="Couldn't load category insights."
                onRetry={refetch}
              />
            </div>
          ) : chartData.length === 0 ? (
            <p className="py-16 text-center text-sm text-muted-foreground">
              No pets to chart yet.
            </p>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart margin={{ top: 10, right: 15, bottom: 10, left: 15 }}>
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={60}
                  label={({ name, percent }: { name?: string; percent?: number }) =>
                    `${name || ""}: ${((percent || 0) * 100).toFixed(0)}%`
                  }
                  animationDuration={600}
                >
                  {chartData.map((_entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => [`${value}`, "Pets"]}
                  contentStyle={{
                    fontSize: "14px",
                    borderRadius: "12px",
                    border: "1px solid rgba(0,0,0,0.08)",
                    boxShadow: "0 6px 16px rgba(0,0,0,0.08)",
                  }}
                />
                <Legend iconType="circle" iconSize={10} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
