import React from "react";
import { PawPrint } from "lucide-react";

interface EmptyStateProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  children,
}) => {
  return (
    <div className="flex flex-col items-center justify-center gap-3 px-6 py-14 text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
        <PawPrint className="h-8 w-8 text-primary" />
      </span>
      <h3 className="text-lg font-semibold text-secondary">{title}</h3>
      {description && (
        <p className="max-w-sm text-sm text-muted-foreground">{description}</p>
      )}
      {children && <div className="mt-2">{children}</div>}
    </div>
  );
};

export default EmptyState;
