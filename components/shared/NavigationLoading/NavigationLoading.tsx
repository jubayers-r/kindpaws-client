"use client";

import LoadingScreen from "../LoadingScreen/LoadingScreen";

export const NavigationLoading = () => {
  // In Next.js App Router, page transitions stream and use Suspense/loading boundaries.
  // We provide the component so existing layout composition remains 1:1.
  return <LoadingScreen isLoading={false} />;
};

export default NavigationLoading;
