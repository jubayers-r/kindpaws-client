"use client";

import React from "react";
import { motion } from "motion/react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/useAuth";
import { rise } from "@/components/dashboard/shared/styles";

export const UserInfo = () => {
  const { user } = useAuth();

  const name = user?.displayName || "there";
  const initial = user?.displayName?.[0] || "U";

  return (
    <motion.div
      {...rise()}
      className="relative overflow-hidden rounded-2xl bg-secondary p-6 text-white shadow-md"
    >
      <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16 border-2 border-white/30">
            <AvatarImage src={user?.photoURL || undefined} className="object-cover" />
            <AvatarFallback className="bg-primary text-lg font-semibold text-primary-foreground">
              {initial}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wide text-primary">
              Welcome back
            </p>
            <h2 className="truncate text-2xl font-bold">{name}!</h2>
            {user?.email && (
              <p className="truncate text-sm text-white/70">{user.email}</p>
            )}
          </div>
        </div>
        <p className="max-w-xs text-sm leading-relaxed text-white/70">
          Everything you care for — pets, campaigns and donations — lives right
          here.
        </p>
      </div>
    </motion.div>
  );
};

export default UserInfo;
