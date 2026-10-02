"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useRouter } from "next/navigation";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

export function AvatarDropdown() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { user, logOut } = useAuth();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    const handleKeyDown = () => {
      setOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <Button
        variant="ghost"
        className="rounded-full p-0 transition-colors hover:bg-black/10"
        onClick={() => setOpen((prev) => !prev)}
      >
        <Avatar className="h-9 w-9">
          {user?.photoURL && !user.photoURL.includes("icons8.com") && (
            <AvatarImage
              src={user.photoURL}
              alt="User Avatar"
              className="object-cover"
            />
          )}
          <AvatarFallback className="bg-primary text-primary-foreground text-base font-semibold">
            {(user?.displayName || user?.email || "U")[0].toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </Button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="absolute right-0 z-50 mt-2 lg:w-60 w-40 origin-top-right rounded-xl bg-white shadow-lg border"
            initial={{ opacity: 0, scale: 0.9, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <div className="py-2 px-4 border-b border-gray-200">
              <p className="text-sm font-semibold text-gray-900">
                {user?.displayName}
              </p>
              <p className="text-xs text-gray-500 truncate">{user?.email}</p>
            </div>
            <div className="py-1">
              <button
                onClick={() => {
                  router.push("/dashboard");
                  setOpen(false);
                }}
                className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
              >
                Dashboard
              </button>
              <button
                onClick={() => {
                  logOut();
                  setOpen(false);
                }}
                className="block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 rounded-b-xl"
              >
                Logout
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default AvatarDropdown;
