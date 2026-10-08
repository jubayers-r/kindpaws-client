"use client";

import React from "react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import PetForm from "@/components/shared/PetForm/PetForm";
import PageHeader from "@/components/dashboard/shared/PageHeader";
import { PAGE } from "@/components/dashboard/shared/styles";
import { useRouter } from "next/navigation";

export default function AddPetPage() {
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: async (payload: Record<string, unknown>) => {
      const res = await axios.post(
        "https://kind-paws.vercel.app/api/pets/add-pet",
        payload
      );
      return res.data;
    },
    onSuccess: () => {
      toast.success("Pet added successfully!");
      router.push("/dashboard/my-added-pets");
    },
    onError: () => {
      toast.error("Failed to add pet. Try again.");
    },
  });

  return (
    <div className={PAGE}>
      <div className="mx-auto w-full max-w-3xl space-y-6">
        <PageHeader
          eyebrow="My pets"
          title="Add a pet"
          description="Share a pet with the KindPaws community — a good photo and honest details go a long way."
        />
        <PetForm
          onSubmit={(payload) => mutation.mutate(payload)}
          isSubmitting={mutation.isPending}
        />
      </div>
    </div>
  );
}
