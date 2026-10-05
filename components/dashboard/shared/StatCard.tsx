"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { CARD, rise } from "./styles";
import { motion } from "motion/react";

interface StatCardProps {
  icon?: React.ComponentType<{ className?: string }>;
  label: string;
  value?: React.ReactNode;
  hint?: string;
  isLoading?: boolean;
  delay?: number;
}

export const StatCard: React.FC<StatCardProps> = ({
  icon: Icon,
  label,
  value,
  hint,
  isLoading,
  delay = 0,
}) => {
  return (
    <motion.div {...rise(delay)}>
      <Card className={cn(CARD, "gap-0 py-6")}>
        <CardContent className="flex items-center gap-4 px-6">
          {Icon && (
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10">
              <Icon className="h-6 w-6 text-primary" />
            </span>
          )}
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-muted-foreground">
              {label}
            </p>
            {isLoading ? (
              <Skeleton className="mt-1 h-8 w-20" />
            ) : (
              <p className="text-2xl font-bold text-secondary">{value}</p>
            )}
            {hint && !isLoading && (
              <p className="mt-0.5 truncate text-xs text-muted-foreground">
                {hint}
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default StatCard;
