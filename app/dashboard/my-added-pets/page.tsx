"use client";

import React from "react";
import PetsTable from "@/components/dashboard/PetsTable/PetsTable";
import { PAGE } from "@/components/dashboard/shared/styles";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { useAuthRole } from "@/hooks/useAuthRole";

export default function MyAddedPetsPage() {
  const { user } = useAuth();
  const { role } = useAuthRole();

  return (
    <div className={PAGE}>
      <PetsTable
        user={user}
        role={role}
        header={{
          eyebrow: "My pets",
          title: "My added pets",
          description:
            "Pets you have listed. Edit details, flip adoption status or remove them.",
        }}
        headerActions={
          <Button className="rounded-full" asChild>
            <Link href="/dashboard/add-pet">
              <PlusCircle className="h-4 w-4 mr-2" />
              Add a pet
            </Link>
          </Button>
        }
      />
    </div>
  );
}
