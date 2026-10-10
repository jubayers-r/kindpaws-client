"use client";

import { AnimatePresence, motion } from "motion/react";
import React, { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

const DEFAULT_MIN_SHOW_MS = 2600; // one full paw pulse cycle (2.5s) + margin

interface LoadingScreenProps {
  isLoading: boolean;
  minShowMs?: number;
  className?: string;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({
  isLoading,
  minShowMs = DEFAULT_MIN_SHOW_MS,
  className,
}) => {
  const [visible, setVisible] = useState(isLoading);
  const shownAtRef = useRef<number | null>(null);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;

    if (isLoading) {
      shownAtRef.current = Date.now();
      timer = setTimeout(() => setVisible(true), 0);
    } else {
      const shownAt = shownAtRef.current;
      if (shownAt !== null) {
        const remaining = minShowMs - (Date.now() - shownAt);
        if (remaining <= 0) {
          shownAtRef.current = null;
          setVisible(false);
        } else {
          timer = setTimeout(() => {
            shownAtRef.current = null;
            setVisible(false);
          }, remaining);
        }
      }
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isLoading, minShowMs]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className={cn(
            "fixed inset-0 z-[100] bg-background flex items-center justify-center",
            className
          )}
          role="status"
          aria-label="Loading"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{
              type: "spring",
              stiffness: 150,
              damping: 20,
            }}
          >
            <motion.img
              src="/assets/cta/paw-img.png"
              alt=""
              className="w-32 h-32 object-contain select-none"
              transformTemplate={() => "rotate(50deg) scaleY(-1)"}
              initial={{ scaleY: -1 }}
              animate={{
                scaleY: -1,
                filter: [
                  "brightness(100%)",
                  "brightness(150%)",
                  "brightness(100%)",
                ],
                opacity: [0.4, 1.2, 0.4],
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoadingScreen;
