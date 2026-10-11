"use client";

import React, { Suspense, useState, useEffect } from "react";
import { NavItems } from "@/data/NavItems";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Menu, PawPrint } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import { useAuth } from "@/hooks/useAuth";

function MobileNavLinks({ onSelect }: { onSelect?: () => void }) {
  const pathname = usePathname();
  const { user } = useAuth();

  return (
    <div className="flex flex-col gap-2 mt-8 pt-2">
      {user && (
        <Link
          onClick={onSelect}
          className={cn(
            "flex items-center gap-3 px-4 py-2 rounded-md hover:bg-black/5 active:text-black transition",
            pathname === "/dashboard" && "bg-black/10 font-semibold"
          )}
          href="/dashboard"
        >
          <PawPrint className="h-5 w-5" />
          Dashboard
        </Link>
      )}

      {NavItems.map((item, i) => (
        <Link
          key={i}
          href={item.href}
          onClick={onSelect}
          className={cn(
            "flex items-center gap-3 px-4 py-2 rounded-md hover:bg-black/5 transition",
            pathname === item.href && "bg-black/10 font-semibold"
          )}
        >
          <PawPrint className="h-5 w-5" />
          {item.label}
        </Link>
      ))}
    </div>
  );
}

export const MobileMenu = () => {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Open navigation menu">
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-64 max-w-[85vw]">
        <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
        <Suspense
          fallback={
            <div className="flex flex-col gap-2 mt-6 p-4 space-y-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-8 w-full rounded-md bg-accent" />
              ))}
            </div>
          }
        >
          <MobileNavLinks onSelect={() => setOpen(false)} />
        </Suspense>
      </SheetContent>
    </Sheet>
  );
};

export default MobileMenu;
