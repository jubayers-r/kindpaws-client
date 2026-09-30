"use client";

import { createContext } from "react";
import { UserRole } from "@/types";

export interface AuthRoleContextType {
  role: UserRole;
  loading: boolean;
}

export const AuthRoleContext = createContext<AuthRoleContextType | null>(null);
