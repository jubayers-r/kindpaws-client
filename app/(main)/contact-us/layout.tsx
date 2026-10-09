import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us | KindPaws",
  description:
    "Get in touch with the KindPaws team. We are here to answer questions about adoptions, campaigns, and partnerships.",
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
