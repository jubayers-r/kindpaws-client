"use client";

import React from "react";
import StatCard from "@/components/dashboard/shared/StatCard";
import { PawPrint, HandCoins, HeartHandshake, Megaphone } from "lucide-react";

const cards = [
  { key: "petsCount", label: "Your Pets", icon: PawPrint },
  { key: "donationsMade", label: "Donations Made", icon: HandCoins },
  { key: "activeAdoptions", label: "Active Adoptions", icon: HeartHandshake },
  { key: "campaignsCreated", label: "Campaigns Created", icon: Megaphone },
];

interface StarCardsProps {
  data?: Record<string, string | number>;
  isLoading?: boolean;
}

export const StarCards: React.FC<StarCardsProps> = ({ data, isLoading }) => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, i) => (
        <StatCard
          key={card.key}
          icon={card.icon}
          label={card.label}
          value={data?.[card.key] ?? 0}
          isLoading={isLoading}
          delay={i * 0.05}
        />
      ))}
    </div>
  );
};

export default StarCards;
