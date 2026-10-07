"use client";

import React, { useMemo } from "react";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Badge } from "@/components/ui/badge";
import { motion } from "motion/react";
import CampaignDonationModal from "@/components/campaignPage/CampaignDonationModal";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import LoadingScreen from "@/components/shared/LoadingScreen/LoadingScreen";
import ErrorPage from "@/components/ErrorPage/ErrorPage";
import { Campaign } from "@/types";

export default function CampaignDetailsPage() {
  const params = useParams();
  const id = params?.id as string;

  const {
    data: campaign,
    isLoading,
    error: campaignError,
  } = useQuery<Campaign>({
    queryKey: ["campaign", id],
    enabled: Boolean(id),
    queryFn: async () => {
      const res = await axios.get(
        `https://kind-paws.vercel.app/api/campaigns/${id}`
      );
      return res.data;
    },
  });

  const stripePromise = useMemo(() => {
    const key =
      process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY ||
      process.env.VITE_STRIPE_PUBLIC_KEY ||
      "";
    return key ? loadStripe(key) : null;
  }, []);

  if (campaignError && !campaign) {
    return <ErrorPage error={campaignError} />;
  }

  if (isLoading || !campaign) {
    return <LoadingScreen isLoading={true} />;
  }

  return (
    <motion.div
      className="max-w-5xl mx-auto p-6 space-y-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.img
        src={campaign.image}
        alt={campaign.title}
        className="w-full rounded-xl shadow-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      />

      <div className="space-y-1">
        <h1 className="text-4xl font-bold">{campaign.title}</h1>
        <p className="text-muted-foreground text-lg">
          {campaign.shortDescription}
        </p>
      </div>

      <div className="space-y-3">
        <div className="bg-gray-200 h-4 rounded-full overflow-hidden">
          <div
            className="bg-primary h-full"
            style={{
              width: `${Math.min(
                100,
                (campaign.collectedAmount / campaign.goalAmount) * 100
              )}%`,
            }}
          />
        </div>
        <div className="flex justify-between text-sm">
          <span>Raised: ${campaign.collectedAmount}</span>
          <span>Goal: ${campaign.goalAmount}</span>
        </div>
      </div>

      {stripePromise && (
        <Elements stripe={stripePromise}>
          <CampaignDonationModal campaign={campaign} />
        </Elements>
      )}

      <div
        className="prose max-w-none"
        dangerouslySetInnerHTML={{ __html: campaign.longDescription }}
      />

      {campaign.tags && campaign.tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {campaign.tags.map((tag) => (
            <Badge key={tag}>{tag}</Badge>
          ))}
        </div>
      )}

      <div className="bg-gray-100 p-4 rounded-lg flex items-center gap-4 shadow-sm">
        <img
          src={campaign.ownerPhoto}
          alt={campaign.ownerName}
          className="w-14 h-14 rounded-full object-cover"
        />
        <div>
          <div className="font-medium">{campaign.ownerName}</div>
        </div>
      </div>

      <div className="text-sm text-gray-600 flex flex-wrap gap-4">
        <span>📍 {campaign.location}</span>
        <span>
          📅 Created: {new Date(campaign.createdAt).toLocaleDateString()}
        </span>
        <span>
          ⏳ Deadline: {new Date(campaign.deadline).toLocaleDateString()}
        </span>
        {campaign.isFeatured && (
          <span className="text-yellow-600">🌟 Featured</span>
        )}
      </div>

      {campaign.updates && campaign.updates.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mt-8 mb-4">Campaign Updates</h2>
          <ul className="space-y-3">
            {campaign.updates.map((update, idx) => (
              <li key={idx} className="bg-white p-4 rounded-md shadow">
                <div className="text-sm text-gray-500">
                  {new Date(update.date).toLocaleDateString()}
                </div>
                <p>{update.message}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </motion.div>
  );
}
