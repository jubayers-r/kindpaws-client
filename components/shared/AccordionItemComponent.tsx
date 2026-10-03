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
    <AccordionTrigger className="bg-white rounded-full pl-10 pr-5 text-xl font-semibold text-secondary">
      {title}
    </AccordionTrigger>
    <AccordionContent className="flex flex-col gap-4 text-balance pl-10 pr-5 mt-5 font-[Roboto] text-muted-foreground text-lg">
      <p>{content}</p>
    </AccordionContent>
  </AccordionItem>
);

export default AccordionItemComponent;
