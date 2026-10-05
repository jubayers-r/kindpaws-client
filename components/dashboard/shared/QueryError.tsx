import React from "react";
import { Button } from "@/components/ui/button";
import { PAGE_SECTION_ERROR } from "@/components/dashboard/shared/styles";

interface QueryErrorProps {
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export const QueryError: React.FC<QueryErrorProps> = ({
  message = "Couldn't load this section. The server may be unavailable.",
  onRetry,
  className,
}) => {
  return (
    <div
      className={`${PAGE_SECTION_ERROR} flex flex-wrap items-center justify-between gap-3 ${
        className || ""
      }`}
    >
      <span>{message}</span>
      {onRetry && (
        <Button
          size="sm"
          variant="outline"
          onClick={onRetry}
          className="shrink-0 border-destructive/30 bg-transparent text-destructive hover:bg-destructive/10 hover:text-destructive"
        >
          Try again
        </Button>
      )}
    </div>
  );
};

export default QueryError;
