"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "motion/react";
import { formatDistanceToNow } from "date-fns";
import { CARD, rise } from "@/components/dashboard/shared/styles";

interface Activity {
  id: number | string;
  type: string;
  description: string;
  time: string;
}

interface UserRecentActivityProps {
  data?: {
    recentActivity?: Activity[];
  };
  isLoading?: boolean;
}

export const UserRecentActivity: React.FC<UserRecentActivityProps> = ({
  data,
  isLoading,
}) => {
  const recentActivity = data?.recentActivity ?? [];

  return (
    <motion.div {...rise()} className="w-full">
      <Card className={`${CARD} h-full`}>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-secondary">
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <ul className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <li key={i} className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-full max-w-xs" />
                </li>
              ))}
            </ul>
          ) : recentActivity.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              No recent activity yet.
            </p>
          ) : (
            <ul className="divide-y">
              {recentActivity.map(({ id, type, description, time }) => (
                <li key={id} className="py-3">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-semibold text-secondary">{type}</p>
                    <span className="shrink-0 text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(time), { addSuffix: true })}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{description}</p>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default UserRecentActivity;
