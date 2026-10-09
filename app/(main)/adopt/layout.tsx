import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Adopt a Pet | KindPaws",
  description:
    "Browse adorable rescue pets waiting for a loving home. Filter by category, age, and find your new best friend.",
};

export default function AdoptLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
