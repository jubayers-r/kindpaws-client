"use client";

import React from "react";
import { AuthRoleContext } from "./AuthRoleContext";
import { useUserRole } from "@/hooks/useUserRole";

export const AuthRoleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { data: role, isLoading } = useUserRole();

  const value = React.useMemo(
    () => ({ role: role ?? null, loading: isLoading }),
    [role, isLoading]
  );

  return (
    <AuthRoleContext.Provider value={value}>
      {children}
    </AuthRoleContext.Provider>
  );
};
