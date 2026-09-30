"use client";

import { useContext } from "react";
import { AuthRoleContext, AuthRoleContextType } from "@/context/role/AuthRoleContext";

export const useAuthRole = (): AuthRoleContextType => {
  const context = useContext(AuthRoleContext);
  if (!context) {
    return { role: null, loading: false };
  }
  return context;
};
