"use client";

import React from "react";
import { PawPrint } from "lucide-react";
import { motion } from "motion/react";
import { rise } from "./styles";

interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  eyebrow,
  title,
  description,
  actions,
}) => {
  return (
    <motion.div
      {...rise()}
      className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
    >
      <div className="space-y-2">
        {eyebrow && (
          <div className="flex w-fit items-center gap-2 rounded-full bg-primary/10 px-5 py-1">
            <PawPrint className="h-4 w-4 text-primary" />
            <span className="text-sm font-semibold uppercase tracking-wide text-primary">
              {eyebrow}
            </span>
          </div>
        )}
        <h1 className="text-3xl/tight font-bold text-secondary sm:text-4xl/tight">
          {title}
        </h1>
        {description && (
          <p className="max-w-2xl text-sm text-muted-foreground sm:text-base">
            {description}
          </p>
        )}
      </div>
      {actions && (
        <div className="flex flex-wrap items-center gap-3">{actions}</div>
      )}
    </motion.div>
  );
};

export default PageHeader;
