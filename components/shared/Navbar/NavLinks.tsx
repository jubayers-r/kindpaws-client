"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NavItems } from "@/data/NavItems";
import { useAuth } from "@/hooks/useAuth";

export const NavLinks = () => {
  const { user } = useAuth();
  const pathname = usePathname();

  const items = [...NavItems];

  if (user) {
    items.push(
      { label: "Dashboard", href: "/dashboard" },
      { label: "Contact Us", href: "/contact-us" }
    );
  }

  return (
    <ul className="flex gap-2">
      {items.map((item, i) => {
        const isActive = pathname === item.href;
        return (
          <li key={i} className="hover:text-amber-500">
            <Link
              href={item.href}
              className={isActive ? "text-orange-500 font-medium" : ""}
            >
              {item.label}
            </Link>
            {i !== items.length - 1 && (
              <span
                aria-hidden="true"
                className="inline-block h-1.5 w-1.5 rounded-full bg-orange-400 lg:mx-4"
              />
            )}
          </li>
        );
      })}
    </ul>
  );
};

export default NavLinks;
