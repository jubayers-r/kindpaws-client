import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Donation Campaigns | KindPaws",
  description:
    "Support urgent veterinary care, shelter improvements, and food drives for rescued animals in need.",
};

export default function CampaignsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
