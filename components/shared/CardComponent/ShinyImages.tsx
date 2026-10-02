"use client";

import React from "react";
import { motion } from "motion/react";

type MotionControls = ReturnType<typeof import("motion/react").useAnimation>;

interface ShinyImageProps {
  src: string;
  alt: string;
  shineControls: MotionControls;
  extraControls: MotionControls;
}

export const ShinyImage: React.FC<ShinyImageProps> = ({
  src,
  alt,
  shineControls,
  extraControls,
}) => {
  return (
    <motion.div
      className="relative group w-full max-w-md overflow-hidden rounded-2xl"
      animate={extraControls}
      initial={{ filter: "brightness(1)" }}
    >
      <img
        src={src}
        alt={alt}
        className="w-full h-52 object-cover rounded-[1.8rem]"
      />
      <motion.div
        initial={{ x: "-250%" }}
        animate={shineControls}
        className="pointer-events-none absolute top-0 left-0 h-full w-1/3 bg-gradient-to-r from-transparent via-white/40 to-transparent"
        style={{
          transform: "rotate(25deg)",
        }}
      />
    </motion.div>
  );
};

export default ShinyImage;
