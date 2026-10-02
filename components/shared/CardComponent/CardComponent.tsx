"use client";

import React from "react";
import { motion, useAnimation } from "motion/react";
import ShinyImage from "@/components/shared/CardComponent/ShinyImages";
import Link from "next/link";
import PetCardComponent from "./PetCardDescription";
import CampaignCardDescription from "./CampaignCardDescription";
import { Pet, Campaign } from "@/types";

interface CardComponentProps {
  data: Pet | Campaign;
  type: "pet" | "campaign";
}

export const CardComponent: React.FC<CardComponentProps> = ({ data, type }) => {
  const image = data.image;
  const displayName = type === "pet" ? (data as Pet).name : (data as Campaign).title;

  const content =
    type === "pet" ? (
      <PetCardComponent pet={data as Pet} />
    ) : (
      <CampaignCardDescription campaign={data as Campaign} />
    );

  const shineControls = useAnimation();
  const extraControls = useAnimation();

  const handleCardMouseEnter = () => {
    shineControls.start({
      x: "350%",
      transition: { duration: 0.5, ease: "easeIn" },
    });
  };

  const handleCardMouseLeave = () => {
    shineControls.start({
      x: "-250%",
      transition: { duration: 0.5, ease: "easeIn" },
    });
  };

  const handleImageMouseEnter = () => {
    extraControls.start({
      filter: "brightness(1.1)",
      transition: { duration: 0.3 },
    });
  };

  const handleImageMouseLeave = () => {
    extraControls.start({
      filter: "brightness(1)",
      transition: { duration: 0.3 },
    });
  };

  return (
    <Link
      href={`/${type}/details/${data._id}`}
      className="block"
      aria-label={`See details about ${displayName}`}
    >
      <motion.div
        tabIndex={0}
        role="link"
        onMouseEnter={handleCardMouseEnter}
        onMouseLeave={handleCardMouseLeave}
        onFocus={handleCardMouseEnter}
        onBlur={handleCardMouseLeave}
        whileHover={{
          scale: 1.03,
          translateY: -2,
        }}
        whileTap={{
          scale: 0.97,
          translateY: 0,
          boxShadow: "0 8px 15px oklch(72.87% 0.16116 65.931)",
        }}
        transition={{ type: "spring", stiffness: 250, damping: 30 }}
        className="bg-white rounded-3xl p-4 shadow-md w-full max-w-sm space-y-4 cursor-pointer
          focus-visible:ring-4 focus-visible:ring-primary focus-visible:ring-opacity-50
          outline-none mx-auto"
      >
        <div className="w-full overflow-hidden rounded-[2rem]">
          <motion.div
            onMouseEnter={handleImageMouseEnter}
            onMouseLeave={handleImageMouseLeave}
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="p-1 bg-white rounded-[2rem] border-2 border-dashed border-gray-300"
          >
            <ShinyImage
              src={image}
              alt={`Photo of ${displayName}`}
              shineControls={shineControls}
              extraControls={extraControls}
            />
          </motion.div>
        </div>

        {content}
      </motion.div>
    </Link>
  );
};

export default CardComponent;
