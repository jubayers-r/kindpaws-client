"use client";

import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "motion/react";
import { useQuery } from "@tanstack/react-query";
import { CARD, rise } from "@/components/dashboard/shared/styles";

interface ActivityItem {
  id: number;
  type: string;
  user: string;
  time: string;
}

const fetchRecentActivity = async (): Promise<ActivityItem[]> => {
  return [
    { id: 1, type: "User Signup", user: "Emily Watson", time: "2 mins ago" },
    { id: 2, type: "New Campaign", user: "David Kim", time: "10 mins ago" },
    { id: 3, type: "Pet Adopted", user: "Sarah Lee", time: "1 hour ago" },
    { id: 4, type: "Donation Received", user: "Mark Brown", time: "3 hours ago" },
    { id: 5, type: "Pet Added", user: "Olivia Turner", time: "5 hours ago" },
  ];
};

export const RecentActivity = () => {
  const { data = [], isLoading } = useQuery<ActivityItem[]>({
    queryKey: ["recent-activity"],
    queryFn: fetchRecentActivity,
  });

  return (
    <motion.div {...rise()} className="w-full h-full">
      <Card className={`${CARD} h-full`}>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-secondary">
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="divide-y divide-border/60">
            {(isLoading ? Array(5).fill(null) : data).map((item, idx) => (
              <li key={item?.id || idx} className="flex items-center gap-3 py-3">
                {isLoading ? (
                  <>
                    <Skeleton className="h-9 w-9 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                    <Skeleton className="h-3 w-16" />
                  </>
                ) : (
                  <>
                    <Avatar className="h-9 w-9">
                      <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
                        {item.user?.slice(0, 2).toUpperCase() || "??"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-secondary">
                        {item.type}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">
                        {item.user}
                      </p>
                    </div>
                    <span className="shrink-0 text-xs text-muted-foreground">
                      {item.time}
                    </span>
                  </>
                )}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default RecentActivity;
