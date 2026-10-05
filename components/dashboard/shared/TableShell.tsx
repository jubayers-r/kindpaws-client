"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { CARD, rise } from "./styles";

interface TableShellProps {
  className?: string;
  children: React.ReactNode;
}

export const TableShell: React.FC<TableShellProps> = ({
  className,
  children,
}) => {
  return (
    <motion.div {...rise()}>
      <Card className={cn(CARD, "overflow-hidden gap-0 py-0", className)}>
        {children}
      </Card>
    </motion.div>
  );
};

export default TableShell;
