"use client";

import React, { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import clsx from "clsx";
import { Home, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { LogoBlack } from "@/components/shared/Logo";
import { dashboardNavItems } from "@/data/DashboardNavItems";
import DashboardTopNavbar from "@/components/dashboard/DashboardTopNavbar/DashboardTopNavbar";
import { AuthRoleProvider } from "@/context/role/AuthRoleProvider";
import { useUserRole } from "@/hooks/useUserRole";
import { useAuth } from "@/hooks/useAuth";
import LoadingScreen from "@/components/shared/LoadingScreen/LoadingScreen";
import RouteFallback from "@/components/shared/RouteFallback";

const itemClass = (isActive: boolean) =>
  clsx(
    "flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors",
    isActive
      ? "bg-primary text-primary-foreground shadow-sm"
      : "text-secondary/80 hover:bg-primary/10 hover:text-primary"
  );

function DashboardNavItemsList() {
  const pathname = usePathname();
  const { data: role, isLoading: roleLoading } = useUserRole();

  const filteredNavItems =
    role === "admin"
      ? dashboardNavItems
      : dashboardNavItems.filter((item) =>
          item.roles.includes((role as "user" | "admin") || "user")
        );

  const isActive = (href: string) =>
    href === "/dashboard"
      ? pathname === "/dashboard"
      : pathname === href || pathname.startsWith(`${href}/`);

  if (roleLoading) {
    return (
      <>
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3 rounded-xl px-4 py-2.5">
            <Skeleton className="h-5 w-5 rounded-md" />
            <Skeleton className="h-4 w-28" />
          </div>
        ))}
      </>
    );
  }

  return (
    <>
      {filteredNavItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={itemClass(isActive(item.href))}
        >
          <item.icon className="h-5 w-5 shrink-0" />
          {item.label}
        </Link>
      ))}
    </>
  );
}

function DashboardLayoutContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading: authLoading, setStateData } = useAuth();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    setStateData(pathname);
    if (!authLoading && !user) {
      router.replace(`/login?from=${encodeURIComponent(pathname)}`);
    }
  }, [user, authLoading, pathname, router, setStateData]);

  const homeLink = (
    <Button
      variant="outline"
      className="w-full justify-start rounded-full"
      asChild
      onClick={() => setOpen(false)}
    >
      <Link href="/">
        <Home className="h-4 w-4" />
        Back to home
      </Link>
    </Button>
  );

  const menuTrigger = (
    <SheetTrigger asChild>
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden"
        aria-label="Open menu"
      >
        <Menu />
      </Button>
    </SheetTrigger>
  );

  return (
    <div className="min-h-screen bg-background font-[family-name:var(--font-laila)]">
      <LoadingScreen isLoading={authLoading} />
      <Sheet open={open} onOpenChange={setOpen}>
        <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r bg-card md:flex">
          <div className="flex h-16 shrink-0 items-center border-b px-5">
            <LogoBlack />
          </div>
          <nav className="flex-1 space-y-1 overflow-y-auto p-3">
            <Suspense
              fallback={
                <div className="space-y-2 p-1">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="h-9 w-full rounded-xl bg-accent" />
                  ))}
                </div>
              }
            >
              <DashboardNavItemsList />
            </Suspense>
          </nav>
          <div className="shrink-0 border-t p-3">{homeLink}</div>
        </aside>

        <div className="md:ml-64">
          <DashboardTopNavbar menuTrigger={menuTrigger} />
          <AuthRoleProvider>
            <Suspense fallback={<RouteFallback />}>
              <main>{children}</main>
            </Suspense>
          </AuthRoleProvider>
        </div>

        <SheetContent side="left" className="w-64 gap-0 bg-card p-0 flex flex-col h-full">
          <SheetTitle className="sr-only">Dashboard menu</SheetTitle>
          <div className="flex h-16 shrink-0 items-center border-b px-5 pr-12">
            <LogoBlack />
          </div>
          <nav className="flex-1 space-y-1 overflow-y-auto p-3" onClick={() => setOpen(false)}>
            <Suspense
              fallback={
                <div className="space-y-2 p-1">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="h-9 w-full rounded-xl bg-accent" />
                  ))}
                </div>
              }
            >
              <DashboardNavItemsList />
            </Suspense>
          </nav>
          <div className="shrink-0 border-t p-3">{homeLink}</div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={<LoadingScreen isLoading={true} />}>
      <DashboardLayoutContent>{children}</DashboardLayoutContent>
    </Suspense>
  );
}
