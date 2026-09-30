"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useAuth } from "@/hooks/useAuth";
import { API_BASE_URL } from "@/lib/axiosSecure";
import { UserRole } from "@/types";

export const useUserRole = () => {
  const { user } = useAuth();

  return useQuery<UserRole>({
    queryKey: ["user-role", user?.uid],
    enabled: Boolean(user?.uid),
    staleTime: 5 * 60 * 1000,
    meta: { globalErrorToast: false },
    queryFn: async (): Promise<UserRole> => {
      if (!user?.uid) return null;
      const res = await axios.get(`${API_BASE_URL}/api/users/role`, {
        params: { uid: user.uid },
      });
      return res.data.role;
    },
  });
};
