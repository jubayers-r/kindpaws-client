"use client";

import React, { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import LoadingScreen from "@/components/shared/LoadingScreen/LoadingScreen";

interface PrivateRouteProps {
  children: React.ReactNode;
}

function PrivateRouteInner({ children }: PrivateRouteProps) {
  const { user, loading, setStateData } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setStateData(pathname);
    if (!loading && !user) {
      router.replace(`/login?from=${encodeURIComponent(pathname)}`);
    }
  }, [user, loading, router, pathname, setStateData]);

  if (loading) {
    return <LoadingScreen isLoading={true} />;
  }

  if (!user) {
    return null;
  }

  return <>{children}</>;
}

export const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  return (
    <React.Suspense fallback={<LoadingScreen isLoading={true} />}>
      <PrivateRouteInner>{children}</PrivateRouteInner>
    </React.Suspense>
  );
};

export default PrivateRoute;
