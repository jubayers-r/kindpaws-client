"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "motion/react";
import { useQuery } from "@tanstack/react-query";
import { CARD, rise } from "@/components/dashboard/shared/styles";
import QueryError from "@/components/dashboard/shared/QueryError";
import { Users, PawPrint, HandCoins, HeartHandshake } from "lucide-react";

const metricsIcons = {
  users: Users,
  campaigns: PawPrint,
  donations: HandCoins,
  adoptions: HeartHandshake,
};

export const OverviewMetrics = () => {
  const { data, isLoading, error, refetch } = useQuery<{
    users?: number;
    campaigns?: number;
    donations?: number;
    adoptions?: number;
  }>({
    queryKey: ["admin-metrics"],
    queryFn: async () => {
      const res = await fetch("https://kind-paws.vercel.app/api/stats/overview");
      if (!res.ok) throw new Error("Failed to fetch dashboard metrics");
      return res.json();
    },
  });

  const metrics = [
    { id: "users" as const, title: "Total Users", value: data?.users ?? 0 },
    { id: "campaigns" as const, title: "Total Campaigns", value: data?.campaigns ?? 0 },
    { id: "donations" as const, title: "Total Donations", value: data?.donations ?? 0 },
    { id: "adoptions" as const, title: "Total Adoptions", value: data?.adoptions ?? 0 },
  ];

  if (error) {
    return (
      <QueryError
        message="Couldn't load dashboard metrics."
        onRetry={refetch}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric, i) => {
        const Icon = metricsIcons[metric.id];
        return (
          <motion.div key={metric.id} {...rise(i * 0.05)}>
            <Card className={`${CARD} gap-0 py-6`}>
              <CardContent className="flex items-center gap-4 px-6">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <Icon className="h-6 w-6 text-primary" />
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-muted-foreground">
                    {metric.title}
                  </p>
                  {isLoading ? (
                    <Skeleton className="mt-1 h-8 w-20" />
                  ) : (
                    <p className="text-2xl font-bold text-secondary">
                      {metric.value.toLocaleString()}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
};

export default OverviewMetrics;
