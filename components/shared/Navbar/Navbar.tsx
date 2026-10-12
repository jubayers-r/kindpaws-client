"use client";

import { Logo, LogoBlack } from "@/components/shared/Logo";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { AvatarDropdown } from "./AvatarDropdown";
import MobileMenu from "./MobileMenu";
import NavLinks from "./NavLinks";

function NavbarContent() {
  const [scrolled, setScrolled] = useState(false);
  const { user } = useAuth();
  const pathname = usePathname();

  useEffect(() => {
    // Reset to top when navigating
    window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });

    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    const frame = requestAnimationFrame(handleScroll);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [pathname]);

  return (
    <div
      className={`navbar px-5 transition-[backdrop-filter,background-color,border-radius] duration-300 mt-2 2xl:w-9/11 w-[95%] mx-auto sm:my-7 fixed left-0 right-0 z-50 py-2 sm:py-5 grid grid-cols-[1fr_auto_1fr] items-center ${
        scrolled ? "rounded-full backdrop-blur-md bg-white/70" : ""
      }`}
    >
      {/* logo / logoBlack on scroll */}
      <div className="relative justify-self-start col-start-1 row-start-1">
        <div
          className={`transition-opacity duration-300 ${
            scrolled ? "opacity-0" : "opacity-100"
          }`}
        >
          <Logo />
        </div>
        <div
          className={`absolute inset-0 transition-opacity duration-300 ${
            scrolled ? "opacity-100" : "opacity-0"
          }`}
        >
          <LogoBlack />
        </div>
      </div>

      {/* navcenter */}
      <div
        className={`hidden lg:flex items-center justify-self-center col-start-2 row-start-1 rounded-full px-8 py-2 transition-[background-color,box-shadow] duration-300 ${
          scrolled ? "shadow-none" : "bg-white shadow-sm"
        }`}
      >
        <Suspense fallback={<div className="h-6 w-48" />}>
          <NavLinks />
        </Suspense>
      </div>

      {/* navend */}
      <div className="flex items-center gap-4 justify-self-end col-start-3 row-start-1">
        {!user && (
          <Link href="/register">
            <p
              className={`border-b hover:brightness-90 sm:block hidden transition-colors duration-300 ${
                scrolled ? "text-black" : "text-white"
              }`}
            >
              Register
            </p>
          </Link>
        )}
        {!user ? (
          <Link href="/login">
            <Button className="py-4 rounded-full hover:bg-white hover:text-black">
              Login
            </Button>
          </Link>
        ) : (
          <AvatarDropdown />
        )}

        <div
          className={`w-[1px] h-6 rounded-full opacity-60 transition-colors duration-300 ${
            user ? "lg:hidden" : ""
          } ${scrolled ? "bg-black/30" : "bg-gray-300"}`}
        />
        {!user && (
          <Link href="/contact-us" className="group">
            <Button
              variant="outline"
              className="hidden lg:inline-flex px-6 py-4 min-w-[150px] xl:min-w-[170px] items-center justify-center gap-2 rounded-full border border-black/10 bg-white hover:bg-amber-500 text-black hover:text-white transition-all duration-300"
            >
              <span>Get In Touch</span>
              <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Button>
          </Link>
        )}

        <div
          className={`lg:hidden transition-colors duration-300 ${
            scrolled ? "text-black" : "text-white"
          }`}
        >
          <MobileMenu />
        </div>
      </div>
    </div>
  );
}

export const Navbar = () => {
  return (
    <Suspense fallback={<div className="h-16 w-full" />}>
      <NavbarContent />
    </Suspense>
  );
};

export default Navbar;
