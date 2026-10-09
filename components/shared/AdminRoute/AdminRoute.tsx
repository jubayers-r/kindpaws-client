"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUserRole } from "@/hooks/useUserRole";
import LoadingScreen from "@/components/shared/LoadingScreen/LoadingScreen";

interface AdminRouteProps {
  children: React.ReactNode;
}

export const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const router = useRouter();
  const { data: role, isLoading } = useUserRole();

  useEffect(() => {
    if (!isLoading && role !== "admin") {
      router.replace("/dashboard");
    }
  }, [role, isLoading, router]);

  if (isLoading) {
    return (
      <div className="p-8 space-y-4">
        <div className="h-8 w-48 rounded-lg bg-accent animate-pulse" />
        <div className="h-64 w-full rounded-2xl bg-accent animate-pulse" />
      </div>
    );
  }

  if (role !== "admin") {
    return null;
  }

  return <>{children}</>;
};

export default AdminRoute;
