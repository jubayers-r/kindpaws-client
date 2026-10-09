import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  try {
    const res = await fetch(`https://kind-paws.vercel.app/api/campaigns/${id}`, {
      next: { revalidate: 60 },
    });
    if (res.ok) {
      const campaign = await res.json();
      if (campaign?.title) {
        return {
          title: `${campaign.title} | KindPaws Campaign`,
          description:
            campaign.shortDescription ||
            `Support this urgent animal rescue and medical campaign on KindPaws.`,
          openGraph: {
            title: `${campaign.title} | KindPaws`,
            description: campaign.shortDescription || undefined,
            images: campaign.image ? [{ url: campaign.image }] : undefined,
          },
        };
      }
    }
  } catch {
    // Fallback to static title if fetch fails
  }

  return {
    title: "Campaign Details | KindPaws",
    description: "Support this animal rescue campaign on KindPaws.",
  };
}

export default function CampaignDetailsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
