"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { motion } from "motion/react";
import { PawPrint, Megaphone, HandHeart, ArrowRight } from "lucide-react";
import { rise } from "@/components/dashboard/shared/styles";

const actions = [
  {
    label: "Add a new pet",
    href: "/dashboard/add-pet",
    icon: PawPrint,
    variant: "default" as const,
  },
  {
    label: "Create a campaign",
    href: "/dashboard/create-campaign",
    icon: Megaphone,
    variant: "outline" as const,
  },
  {
    label: "Your donations",
    href: "/dashboard/my-donations",
    icon: HandHeart,
    variant: "secondary" as const,
  },
];

export const CTA = () => {
  const router = useRouter();

  return (
    <motion.div {...rise(0.1)} className="flex flex-col gap-3">
      <p className="text-sm font-semibold uppercase tracking-wide text-primary">
        Quick actions
      </p>
      {actions.map((action) => (
        <Button
          key={action.href}
          variant={action.variant}
          className="h-auto w-full justify-between rounded-full px-5 py-3"
          onClick={() => router.push(action.href)}
        >
          <span className="flex items-center gap-2">
            <action.icon className="h-4 w-4" />
            {action.label}
          </span>
          <ArrowRight className="h-4 w-4" />
        </Button>
      ))}
    </motion.div>
  );
};

export default CTA;
