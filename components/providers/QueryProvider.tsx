"use client";

import React, { useState } from "react";
import { QueryClient, QueryClientProvider, QueryCache } from "@tanstack/react-query";
import { toast } from "sonner";

interface QueryProviderProps {
  children: React.ReactNode;
}

export default function QueryProvider({ children }: QueryProviderProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: 1,
            staleTime: 60 * 1000,
            refetchOnWindowFocus: false,
          },
        },
        queryCache: new QueryCache({
          onError: (error: unknown, query) => {
            const meta = query.meta as { globalErrorToast?: boolean } | undefined;
            if (meta?.globalErrorToast === false) return;
            const err = error as { response?: { data?: { message?: string } }; message?: string };
            const message =
              err?.response?.data?.message ||
              (typeof error === "string" ? error : err?.message) ||
              "Something went wrong. Please try again.";
            toast.error(message);
          },
        }),
      })
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
