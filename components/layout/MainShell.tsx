"use client";

import React, { Suspense, useEffect, useRef, useState } from "react";
import Navbar from "@/components/shared/Navbar/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/homePage/Hero/Hero";
import SwiperComponent from "@/components/homePage/SwiperComponent/SwiperComponent";
import HeroElseComponent from "@/components/shared/HeroElseComponent/HeroElseComponent";
import CopyrightComponent from "@/components/layout/CopyrightComponent";
import RouteFallback from "@/components/shared/RouteFallback";
import LoadingScreen from "@/components/shared/LoadingScreen/LoadingScreen";
import { usePathname } from "next/navigation";

function HeroSwitcher() {
  const pathname = usePathname();
  const heroContent =
    pathname === "/" ? <SwiperComponent /> : <HeroElseComponent />;

  return <Hero>{heroContent}</Hero>;
}

function PageTransitionLoader() {
  const pathname = usePathname();
  const [isNavigating, setIsNavigating] = useState(false);
  const currentPathRef = useRef(pathname);

  useEffect(() => {
    if (pathname !== currentPathRef.current) {
      currentPathRef.current = pathname;
      setIsNavigating(true);
      const timer = setTimeout(() => {
        setIsNavigating(false);
      }, 700);
      return () => clearTimeout(timer);
    }
  }, [pathname]);

  return <LoadingScreen isLoading={isNavigating} minShowMs={700} />;
}

export const MainShell: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <div className="w-full overflow-x-hidden">
      <Suspense fallback={null}>
        <PageTransitionLoader />
      </Suspense>
      <div className="flex flex-col font-body">
        <Navbar />
        <Suspense fallback={<Hero><HeroElseComponent /></Hero>}>
          <HeroSwitcher />
        </Suspense>
        <main className="flex-grow flex flex-col justify-center mb-15 2xl:w-9/11 w-[95%] mx-auto">
          <Suspense fallback={<RouteFallback />}>{children}</Suspense>
        </main>
      </div>
      <Footer />
      <hr />
      <CopyrightComponent />
    </div>
  );
};

export default MainShell;
