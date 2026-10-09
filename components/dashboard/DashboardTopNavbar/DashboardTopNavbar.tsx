"use client";

import React, { Suspense, useEffect } from "react";
import { LogOut } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { dashboardNavItems } from "@/data/DashboardNavItems";
import { useAuth } from "@/hooks/useAuth";
import { useUserRole } from "@/hooks/useUserRole";

interface DashboardTopNavbarProps {
  menuTrigger: React.ReactNode;
}

function DashboardTitle() {
  const pathname = usePathname();
  const activeItem = dashboardNavItems
    .filter(
      (item) =>
        pathname === item.href ||
        pathname?.startsWith(`${item.href}/`)
    )
    .sort((a, b) => b.href.length - a.href.length)[0];

  const title = activeItem?.label ?? "Dashboard";

  useEffect(() => {
    document.title = `${title} · KindPaws`;
  }, [title]);

  return (
    <div className="min-w-0">
      <p className="text-xs font-semibold uppercase tracking-wide text-primary">
        Dashboard
      </p>
      <h1 className="truncate text-base font-semibold text-secondary">
        {title}
      </h1>
    </div>
  );
}

export const DashboardTopNavbar: React.FC<DashboardTopNavbarProps> = ({
  menuTrigger,
}) => {
  const router = useRouter();
  const { user, logOut } = useAuth();
  const { data: role } = useUserRole();

  const handleLogout = async () => {
    try {
      await logOut();
      router.replace("/login");
    } catch (err) {
      console.error("Logout error:", err);
      router.replace("/login");
    }
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b bg-background/80 px-4 backdrop-blur-md sm:px-8">
      {menuTrigger}

      <Suspense
        fallback={
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wide text-primary">
              Dashboard
            </p>
            <h1 className="truncate text-base font-semibold text-secondary">
              Dashboard
            </h1>
          </div>
        }
      >
        <DashboardTitle />
      </Suspense>

      <div className="ml-auto flex items-center gap-2 sm:gap-3">
        {role && (
          <Badge
            variant={role === "admin" ? "default" : "secondary"}
            className="hidden sm:inline-flex"
          >
            {role === "admin" ? "Administrator" : "Member"}
          </Badge>
        )}

        <div className="flex items-center gap-2 rounded-full border bg-card py-1 pl-1 pr-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user?.photoURL || undefined} className="object-cover" />
            <AvatarFallback className="bg-primary text-sm font-semibold text-primary-foreground">
              {user?.displayName?.[0] || "U"}
            </AvatarFallback>
          </Avatar>
          <p className="hidden max-w-[140px] truncate text-sm font-medium md:block">
            {user?.displayName}
          </p>
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={handleLogout}
          aria-label="Log out"
          className="text-destructive hover:bg-destructive/10 hover:text-destructive"
        >
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    </header>
  );
};

export default DashboardTopNavbar;
