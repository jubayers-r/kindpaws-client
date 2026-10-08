"use client";

import React from "react";
import PetForm from "@/components/shared/PetForm/PetForm";
import PageHeader from "@/components/dashboard/shared/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { CARD, PAGE } from "@/components/dashboard/shared/styles";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { Pet } from "@/types";

export default function EditPetPage() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();

  const { data: pet, isLoading } = useQuery<Pet>({
    queryKey: ["pet", id],
    enabled: Boolean(id),
    queryFn: () =>
      axios
        .get(`https://kind-paws.vercel.app/api/pets/${id}`)
        .then((res) => res.data),
  });

  const mutation = useMutation({
    mutationFn: async (payload: Record<string, unknown>) => {
      const res = await axios.put(
        `https://kind-paws.vercel.app/api/pets/${id}`,
        payload
      );
      return res.data;
    },
    onSuccess: () => {
      toast.success("Pet updated successfully!");
      router.back();
    },
    onError: () => toast.error("Failed to update pet. Try again."),
  });

  return (
    <div className={PAGE}>
      <div className="mx-auto w-full max-w-3xl space-y-6">
        <PageHeader
          eyebrow="My pets"
          title="Update pet details"
          description="Keep the listing fresh — photos, age and location matter most."
        />
        {isLoading ? (
          <Card className={`${CARD} gap-0 py-0`}>
            <CardContent className="space-y-4 p-8">
              <Skeleton className="h-32 w-full rounded-2xl" />
              <div className="grid gap-5 sm:grid-cols-2">
                <Skeleton className="h-9 w-full rounded-md" />
                <Skeleton className="h-9 w-full rounded-md" />
                <Skeleton className="h-9 w-full rounded-md" />
                <Skeleton className="h-9 w-full rounded-md" />
              </div>
              <Skeleton className="h-40 w-full rounded-md" />
            </CardContent>
          </Card>
        ) : (
          <PetForm
            initialData={pet}
            onSubmit={(payload) => mutation.mutate(payload)}
            isSubmitting={mutation.isPending}
          />
        )}
      </div>
    </div>
  );
}
