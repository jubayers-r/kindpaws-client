"use client";

import * as React from "react";
import * as AccordionPrimitive from "radix-ui";
import { cn } from "@/lib/utils";
import { MinusIcon, PlusIcon } from "lucide-react";

function Accordion({
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Accordion.Root>) {
  return <AccordionPrimitive.Accordion.Root data-slot="accordion" {...props} />;
}

function AccordionItem({
  className,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Accordion.Item>) {
  return (
    <AccordionPrimitive.Accordion.Item
      data-slot="accordion-item"
      className={cn("group", className)}
      {...props}
    />
  );
}

function AccordionTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Accordion.Trigger>) {
  return (
    <AccordionPrimitive.Accordion.Header className="flex">
      <AccordionPrimitive.Accordion.Trigger
        data-slot="accordion-trigger"
        className={cn(
          "flex flex-1 items-start justify-between gap-4 rounded-md py-4 text-left text-sm font-medium transition-all outline-none focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 group-data-[state=open]:bg-secondary group-data-[state=open]:text-white",
          className
        )}
        {...props}
      >
        {children}

        {/* Icons that react to the parent .group[data-state] */}
        <span className="relative w-7 h-7 shrink-0">
          <PlusIcon className="absolute inset-0 h-7 w-7 group-data-[state=open]:hidden bg-primary text-white rounded-full p-1" />
          <MinusIcon className="absolute inset-0 h-7 w-7 hidden group-data-[state=open]:block bg-primary text-white rounded-full p-1" />
        </span>
      </AccordionPrimitive.Accordion.Trigger>
    </AccordionPrimitive.Accordion.Header>
  );
}

function AccordionContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Accordion.Content>) {
  return (
    <AccordionPrimitive.Accordion.Content
      data-slot="accordion-content"
      className="data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down overflow-hidden text-sm"
      {...props}
    >
      <div className={cn("pt-0 pb-4", className)}>{children}</div>
    </AccordionPrimitive.Accordion.Content>
  );
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };

