import { API_BASE } from "@/lib/api";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  try {
    const res = await fetch(`${API_BASE}/api/pets/${id}`, {
      next: { revalidate: 60 },
    });
    if (res.ok) {
      const pet = await res.json();
      if (pet?.name) {
        return {
          title: `Adopt ${pet.name} | KindPaws`,
          description:
            pet.shortDescription ||
            `Meet ${pet.name}, a loving ${pet.category} looking for a forever home on KindPaws.`,
          openGraph: {
            title: `Adopt ${pet.name} | KindPaws`,
            description: pet.shortDescription || undefined,
            images: pet.image ? [{ url: pet.image }] : undefined,
          },
        };
      }
    }
  } catch {
    // Fallback to static title if fetch fails
  }

  return {
    title: "Pet Details | KindPaws",
    description: "Learn more about this adoptable pet on KindPaws.",
  };
}

export default function PetDetailsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
