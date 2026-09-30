"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AxiosSecure } from "@/lib/axiosSecure";

export const useAxiosSecure = () => {
  const router = useRouter();

  useEffect(() => {
    const interceptor = AxiosSecure.interceptors.response.use(
      (res) => res,
      (err) => {
        if (err.response?.status === 401 || err.response?.status === 403) {
          console.warn("Unauthorized or Forbidden, redirecting to login...");
          router.push("/login");
        }
        return Promise.reject(err);
      }
    );

    return () => {
      AxiosSecure.interceptors.response.eject(interceptor);
    };
  }, [router]);

  return AxiosSecure;
};
