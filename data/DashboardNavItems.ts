import {
  FolderHeart,
  HandCoins,
  HandHeart,
  Hash,
  HeartHandshake,
  LayoutDashboard,
  Megaphone,
  PawPrint,
  PlusCircle,
  Users,
} from "lucide-react";
import { DashboardNavItem } from "@/types";

export const dashboardNavItems: DashboardNavItem[] = [
  {
    label: "Overview",
    icon: LayoutDashboard,
    href: "/dashboard",
    roles: ["admin", "user"],
  },
  {
    label: "Profile",
    icon: Hash,
    href: "/dashboard/profile",
    roles: ["admin", "user"],
  },
  {
    label: "Users",
    href: "/dashboard/users",
    icon: Users,
    roles: ["admin"],
  },
  {
    label: "All pets",
    href: "/dashboard/all-pets",
    icon: PawPrint,
    roles: ["admin"],
  },
  {
    label: "All Donations",
    href: "/dashboard/all-donations",
    icon: HandCoins,
    roles: ["admin"],
  },
  {
    label: "Add a pet",
    href: "/dashboard/add-pet",
    icon: PlusCircle,
    roles: ["user"],
  },
  {
    label: "My added pets",
    href: "/dashboard/my-added-pets",
    icon: PawPrint,
    roles: ["user"],
  },
  {
    label: "Adoption requests",
    href: "/dashboard/adoption-requests",
    icon: HeartHandshake,
    roles: ["user"],
  },
  {
    label: "Create donation campaigns",
    href: "/dashboard/create-campaign",
    icon: Megaphone,
    roles: ["user"],
  },
  {
    label: "My donation Campaigns",
    href: "/dashboard/my-campaigns",
    icon: FolderHeart,
    roles: ["user"],
  },
  {
    label: "My donations",
    href: "/dashboard/my-donations",
    icon: HandHeart,
    roles: ["user"],
  },
];
