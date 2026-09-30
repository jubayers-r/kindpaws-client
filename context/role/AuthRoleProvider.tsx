"use client";

import React from "react";
import { AuthRoleContext } from "./AuthRoleContext";
import { useUserRole } from "@/hooks/useUserRole";

export const AuthRoleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { data: role, isLoading } = useUserRole();

  return (
    <AuthRoleContext.Provider value={{ role: role ?? null, loading: isLoading }}>
      {children}
    </AuthRoleContext.Provider>
  );
};
