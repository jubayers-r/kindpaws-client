"use client";

import React from "react";
import DonationsTable from "@/components/dashboard/DonationTable/DonationsTable";
import { PAGE } from "@/components/dashboard/shared/styles";
import { useAuth } from "@/hooks/useAuth";
import { useAuthRole } from "@/hooks/useAuthRole";

import AdminRoute from "@/components/shared/AdminRoute/AdminRoute";

export default function AllDonationsPage() {
  const { user } = useAuth();
  const { role } = useAuthRole();

  return (
    <AdminRoute>
      <div className={PAGE}>
        <DonationsTable
          user={user}
          role={role}
          header={{
            eyebrow: "Admin",
            title: "All donation campaigns",
            description:
              "Track every campaign's goal, progress and status across the platform.",
          }}
        />
      </div>
    </AdminRoute>
  );
}
