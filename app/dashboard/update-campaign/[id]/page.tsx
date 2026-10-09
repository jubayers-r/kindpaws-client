"use client";

import React from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import CreateCampaignForm from "@/components/shared/CreateCampaignForm/CreateCampaignForm";
import PageHeader from "@/components/dashboard/shared/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { CARD, PAGE } from "@/components/dashboard/shared/styles";
import { Campaign } from "@/types";

export default function EditCampaignPage() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();

  const { data: campaign, isLoading } = useQuery<Campaign>({
    queryKey: ["campaign", id],
    enabled: Boolean(id),
    queryFn: () =>
      axios
        .get(`/api/campaigns/${id}`)
        .then((res) => res.data),
  });

  const mutation = useMutation({
    mutationFn: async (payload: Record<string, unknown>) => {
      const res = await axios.put(
        `/api/campaigns/${id}`,
        payload
      );
      return res.data;
    },
    onSuccess: () => {
      toast.success("Campaign updated successfully!");
      router.back();
    },
    onError: () => toast.error("Failed to update campaign."),
  });

  return (
    <div className={PAGE}>
      <div className="mx-auto w-full max-w-3xl space-y-6">
        <PageHeader
          eyebrow="Campaigns"
          title="Update campaign"
          description="Adjust the goal, story or status of your donation campaign."
        />
        {isLoading ? (
          <Card className={`${CARD} gap-0 py-0`}>
            <CardContent className="space-y-4 p-8">
              <Skeleton className="h-9 w-full rounded-md" />
              <Skeleton className="h-9 w-full rounded-md" />
              <div className="grid gap-5 sm:grid-cols-2">
                <Skeleton className="h-9 w-full rounded-md" />
                <Skeleton className="h-9 w-full rounded-md" />
              </div>
              <Skeleton className="h-32 w-full rounded-2xl" />
            </CardContent>
          </Card>
        ) : (
          <CreateCampaignForm
            initialData={campaign}
            onSubmit={(payload) => mutation.mutate(payload)}
            isSubmitting={mutation.isPending}
          />
        )}
      </div>
    </div>
  );
}
