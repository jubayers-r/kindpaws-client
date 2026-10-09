"use client";

import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CalendarDays, MapPin } from "lucide-react";
import { motion } from "motion/react";
import { Campaign } from "@/types";

interface CampaignCardDescriptionProps {
  campaign: Campaign;
}

export const CampaignCardDescription: React.FC<CampaignCardDescriptionProps> = ({
  campaign,
}) => {
  const {
    title,
    shortDescription,
    goalAmount,
    collectedAmount,
    location,
    createdAt,
    ownerName,
    ownerPhoto,
    deadline,
  } = campaign;

  const isExpired = deadline && new Date(deadline) < new Date();
  const isGoalReached = collectedAmount >= goalAmount;

  const progress = Number(
    Math.min(100, (collectedAmount / goalAmount) * 100).toFixed(0)
  );

  return (
    <>
      <CardContent className="space-y-3">
        <h3 className="text-lg font-semibold line-clamp-1">{title}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2 h-10">
          {shortDescription}
        </p>

        <div>
          <Progress value={progress} className="h-2 rounded-full" />
          <div className="flex justify-between text-xs mt-1 text-muted-foreground">
            <span>${collectedAmount} raised</span>
            <span>{progress}%</span>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <MapPin className="w-4 h-4" />
            <span>{location}</span>
          </div>
          <div className="flex items-center gap-1">
            <CalendarDays className="w-4 h-4" />
            <span>{new Date(createdAt).toLocaleDateString()}</span>
          </div>
        </div>

        <div className="flex items-center gap-3 mt-3">
          {ownerPhoto && (
            <Image
              src={ownerPhoto}
              alt={ownerName || "Campaign Creator"}
              width={36}
              height={36}
              unoptimized={!ownerPhoto.startsWith("/") && !ownerPhoto.includes("i.ibb.co") && !ownerPhoto.includes("firebasestorage.app")}
              className="w-9 h-9 rounded-full border object-cover"
            />
          )}
          <div className="text-sm">
            <p className="font-medium leading-none">{ownerName}</p>
            <p className="text-xs text-muted-foreground">Campaign Creator</p>
          </div>
        </div>

        <motion.div whileTap={{ scale: 0.95 }}>
          <Button
            className="w-full mt-2"
            variant="default"
            disabled={!campaign.isOpen || isExpired || isGoalReached}
          >
            Donate Now
          </Button>
        </motion.div>
      </CardContent>
    </>
  );
};

export default CampaignCardDescription;
