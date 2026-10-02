"use client";

import React from "react";
import { ArrowRight, PawPrint, MapPin } from "lucide-react";
import { motion } from "motion/react";
import { Pet } from "@/types";

interface PetCardDescriptionProps {
  pet: Pet;
}

export const PetCardDescription: React.FC<PetCardDescriptionProps> = ({
  pet,
}) => {
  const { name, location, shortDescription, gender, category, age } = pet;

  const capitalize = (str: string) =>
    str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : "";

  return (
    <>
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold text-secondary hover:text-primary hover:underline cursor-pointer">
          {name}, <span className="text-sm">{age}</span>
        </h3>
      </div>
      <div className="text-sm text-muted-foreground flex flex-wrap items-center justify-between">
        <div className="flex items-center gap-1">
          <PawPrint className="h-4 w-4 text-gray-400" />
          <span>
            {capitalize(gender)} {category.toLowerCase()}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <MapPin className="h-4 w-4 text-gray-400" />
          <span>{location}</span>
        </div>
      </div>
      <p className="text-sm text-gray-700 h-8">{shortDescription}</p>

      <motion.div
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="flex justify-end"
      >
        <div
          className="text-primary text-sm hover:underline px-2 flex items-center gap-1 cursor-pointer select-none"
          aria-hidden="true"
        >
          See details
          <motion.div
            initial={{ x: 0 }}
            whileHover={{ x: 4 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            <ArrowRight className="h-4 w-4" />
          </motion.div>
        </div>
      </motion.div>
    </>
  );
};

export default PetCardDescription;
