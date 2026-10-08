"use client";

import React from "react";
import DonationsTable from "@/components/dashboard/DonationTable/DonationsTable";
import { PAGE } from "@/components/dashboard/shared/styles";
import { Button } from "@/components/ui/button";
import { Megaphone } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { useAuthRole } from "@/hooks/useAuthRole";

export default function MyDonationCampaignsPage() {
  const { user } = useAuth();
  const { role } = useAuthRole();

  return (
    <div className={PAGE}>
      <DonationsTable
        user={user}
        role={role}
        header={{
          eyebrow: "Campaigns",
          title: "My donation campaigns",
          description:
            "Campaigns you created — pause them, update details or remove them.",
        }}
        headerActions={
          <Button className="rounded-full" asChild>
            <Link href="/dashboard/create-campaign">
              <Megaphone className="h-4 w-4 mr-2" />
              Create campaign
            </Link>
          </Button>
        }
      />
    </div>
  );
}
