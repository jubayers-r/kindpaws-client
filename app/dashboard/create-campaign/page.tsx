"use client";

import React from "react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import CreateCampaignForm from "@/components/shared/CreateCampaignForm/CreateCampaignForm";
import PageHeader from "@/components/dashboard/shared/PageHeader";
import { PAGE } from "@/components/dashboard/shared/styles";

export default function CreateDonationCampaignPage() {
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: async (payload: Record<string, unknown>) => {
      const res = await axios.post(
        "https://kind-paws.vercel.app/api/campaigns/add-campaign",
        payload
      );
      return res.data;
    },
    onSuccess: () => {
      toast.success("Campaign created successfully!");
      router.push("/dashboard/my-campaigns");
    },
    onError: () => {
      toast.error("Failed to create campaign.");
    },
  });

  return (
    <div className={PAGE}>
      <div className="mx-auto w-full max-w-3xl space-y-6">
        <PageHeader
          eyebrow="Campaigns"
          title="Create donation campaign"
          description="Raise funds for a pet in need — clear goals and updates earn more trust."
        />
        <CreateCampaignForm
          onSubmit={(payload) => mutation.mutate(payload)}
          isSubmitting={mutation.isPending}
        />
      </div>
    </div>
  );
}
