import React from "react";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface AccordionItemComponentProps {
  itemNo: number | string;
  title: string;
  content: string;
}

export const AccordionItemComponent: React.FC<AccordionItemComponentProps> = ({
  itemNo,
  title,
  content,
}) => (
  <AccordionItem value={String(itemNo)}>
    <AccordionTrigger className="bg-white rounded-full pl-8 pr-5 text-lg sm:text-xl font-semibold text-secondary">
      {title}
    </AccordionTrigger>
    <AccordionContent className="flex flex-col gap-4 text-balance pl-8 pr-5 mt-4 text-muted-foreground text-sm sm:text-base leading-relaxed">
      <p>{content}</p>
    </AccordionContent>
  </AccordionItem>
);

export default AccordionItemComponent;
