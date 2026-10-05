"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { motion } from "motion/react";
import {
  CheckCircle2,
  Megaphone,
  AlertTriangle,
  Users,
  ArrowRight,
} from "lucide-react";
import { CARD, rise } from "@/components/dashboard/shared/styles";
import QueryError from "@/components/dashboard/shared/QueryError";

const links = [
  {
    key: "adoptionRequests",
    title: "Adoption Requests",
    description: "Review and respond to new requests.",
    icon: CheckCircle2,
    tone: "bg-green-500/10 text-green-600",
    href: "/dashboard/adoption-requests",
  },
  {
    key: "campaignsNeedingAttention",
    title: "Campaigns Attention",
    description: "Campaigns low on funds or near deadline.",
    icon: Megaphone,
    tone: "bg-amber-500/10 text-amber-600",
    href: "/dashboard/all-donations",
  },
  {
    key: "flaggedReports",
    title: "Flagged Reports",
    description: "Review reported content or users.",
    icon: AlertTriangle,
    tone: "bg-red-500/10 text-red-600",
    href: null,
  },
  {
    key: "usersCount",
    title: "Manage Users",
    description: "Manage access levels and roles.",
    icon: Users,
    tone: "bg-primary/10 text-primary",
    href: "/dashboard/users",
  },
];

export default function ManagementQuickLinks() {
  const router = useRouter();
  const { data, isLoading, error, refetch } = useQuery<Record<string, number>>({
    queryKey: ["dashboardStats"],
    queryFn: async () => {
      const res = await fetch("https://kind-paws.vercel.app/api/stats/quick-links");
      if (!res.ok) throw new Error("Failed to fetch dashboard stats");
      return res.json();
    },
  });

  if (isLoading) {
    return (
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {links.map((link) => (
          <Card key={link.key} className={`${CARD} gap-3 py-6`}>
            <CardHeader className="flex flex-row items-center justify-between gap-3">
              <Skeleton className="h-11 w-11 rounded-full" />
              <Skeleton className="h-6 w-10 rounded-full" />
            </CardHeader>
            <CardContent className="space-y-2">
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-8 w-24 rounded-full" />
            </CardContent>
          </Card>
        ))}
      </section>
    );
  }

  if (error) {
    return (
      <QueryError
        message="Couldn't load the quick link counts."
        onRetry={refetch}
      />
    );
  }

  return (
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {links.map((link, i) => {
        const Icon = link.icon;
        const interactive = Boolean(link.href);
        return (
          <motion.div
            key={link.key}
            {...rise(i * 0.05)}
            whileHover={interactive ? { y: -4 } : undefined}
          >
            <Card className={`${CARD} h-full gap-3 py-6`}>
              <CardHeader className="flex flex-row items-start justify-between gap-2">
                <span
                  className={`flex h-11 w-11 items-center justify-center rounded-full ${link.tone}`}
                >
                  <Icon className="h-5 w-5" />
                </span>
                <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-bold text-primary">
                  {data?.[link.key] ?? 0}
                </span>
              </CardHeader>
              <CardContent className="flex flex-1 flex-col gap-2">
                <CardTitle className="text-base font-semibold text-secondary">
                  {link.title}
                </CardTitle>
                <p className="text-sm text-muted-foreground">{link.description}</p>
                {interactive && link.href ? (
                  <Button
                    variant="link"
                    className="mt-auto h-auto justify-start p-0 pt-2"
                    onClick={() => router.push(link.href!)}
                  >
                    Open
                    <ArrowRight className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1" />
                  </Button>
                ) : (
                  <span className="mt-auto pt-2 text-xs font-medium text-muted-foreground">
                    Coming soon
                  </span>
                )}
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </section>
  );
}
