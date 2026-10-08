"use client";

import React from "react";
import { useAuthRole } from "@/hooks/useAuthRole";
import StatCard from "@/components/dashboard/shared/StatCard";
import { PAGE } from "@/components/dashboard/shared/styles";
import { Users, PawPrint, HandCoins, HeartHandshake } from "lucide-react";
import PageHeader from "@/components/dashboard/shared/PageHeader";
import OverviewMetrics from "@/components/dashboard/OverviewMatrics/OverviewMatrics";
import RecentActivity from "@/components/dashboard/RecentActivity/RecentActivity";
import TagCloud from "@/components/dashboard/TagCloud/TagCloud";
import ManagementQuickLinks from "@/components/dashboard/ManagementQuickLinks/ManagementQuickLinks";
import UserInfo from "@/components/dashboard/UserInfo/UserInfo";
import StarCards from "@/components/dashboard/StarCards/StarCards";
import UserRecentActivity from "@/components/dashboard/UserRecentActivity/UserRecentActivity";
import CTA from "@/components/dashboard/CTA/CTA";
import QueryError from "@/components/dashboard/shared/QueryError";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";

const mockRecentActivity = [
  {
    id: 1,
    type: "Pet Added",
    description: "Added a new dog named Max",
    time: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
  },
  {
    id: 2,
    type: "Donation",
    description: "Donated $50 to Campaign XYZ",
    time: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
  },
  {
    id: 3,
    type: "Adoption Request",
    description: "Requested adoption for Bella",
    time: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
];

function AdminOverview() {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Admin"
        title="Dashboard overview"
        description="Keep an eye on pets, campaigns, donations and the people behind them."
      />
      <OverviewMetrics />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="flex lg:col-span-2">
          <RecentActivity />
        </div>
        <TagCloud />
      </div>
      <ManagementQuickLinks />
    </div>
  );
}

function UserOverview() {
  const { user } = useAuth();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["userOverview", user?.uid],
    enabled: Boolean(user?.uid),
    queryFn: async () => {
      const res = await fetch(
        `https://kind-paws.vercel.app/api/stats/user-overview?uid=${user?.uid}`
      );
      if (!res.ok) throw new Error("Failed to fetch your dashboard");
      const stats = await res.json();
      return { ...stats, recentActivity: mockRecentActivity };
    },
  });

  return (
    <div className="space-y-6">
      <UserInfo />
      {error ? (
        <QueryError
          message="Couldn't load your dashboard stats."
          onRetry={refetch}
        />
      ) : (
        <StarCards data={data} isLoading={isLoading} />
      )}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="flex lg:col-span-2">
          <UserRecentActivity
            data={data ?? { recentActivity: mockRecentActivity }}
            isLoading={isLoading}
          />
        </div>
        <CTA />
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { role, loading } = useAuthRole();

  if (loading) {
    return (
      <div className={PAGE}>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[Users, PawPrint, HandCoins, HeartHandshake].map((Icon, i) => (
            <StatCard key={i} icon={Icon} label="Loading" isLoading />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={PAGE}>
      {role === "admin" ? <AdminOverview /> : <UserOverview />}
    </div>
  );
}
