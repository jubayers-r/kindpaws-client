"use client";

import React from "react";
import PetsTable from "@/components/dashboard/PetsTable/PetsTable";
import { PAGE } from "@/components/dashboard/shared/styles";
import { useAuth } from "@/hooks/useAuth";
import { useAuthRole } from "@/hooks/useAuthRole";

export default function AllPetsPage() {
  const { user } = useAuth();
  const { role } = useAuthRole();

  return (
    <div className={PAGE}>
      <PetsTable
        user={user}
        role={role}
        header={{
          eyebrow: "Pets",
          title: "All pets",
          description:
            "Every pet listed on KindPaws, with owner details and adoption status.",
        }}
      />
    </div>
  );
}
