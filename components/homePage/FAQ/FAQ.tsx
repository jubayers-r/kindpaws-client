"use client";

import { motion } from "motion/react";
import Image from "next/image";
import { Accordion } from "@/components/ui/accordion";
import { AccordionItemComponent } from "@/components/shared/AccordionItemComponent";
import { FaqItems } from "@/data/FaqItems";
import { PawPrint } from "lucide-react";

export const FAQ = () => {
  return (
    <div className="grid lg:grid-cols-2">
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        viewport={{ once: true }}
        className="relative pointer-events-none pt-20"
      >
        <div>
          <Image
            src="/assets/FAQ/about-img-04.png"
            alt="dog"
            width={500}
            height={500}
            className="w-full h-auto object-contain"
          />
        </div>
        <Image
          src="/assets/FAQ/paw-bg-pattern-white.png"
          alt="bg-paw"
          width={300}
          height={300}
          className="absolute -top-0 -z-1 h-auto"
        />
      </motion.div>

      <div>
        <div className="bg-white rounded-full w-fit px-5 py-1 mb-2">
          <p className="text-secondary text-sm flex items-center justify-center gap-2">
            <PawPrint className="text-primary" />
            <span className="uppercase text-sm font-semibold text-primary">
              Any FAQ
            </span>
          </p>
        </div>
        <h1 className="text-3xl sm:text-4xl/tight md:text-5xl/tight font-black text-secondary mb-10 dark:text-white">
          Why Choose Our Pet Adoption Community?
        </h1>
        <Accordion
          type="single"
          collapsible
          className="w-full space-y-5"
          defaultValue="1"
        >
          {FaqItems.map((faq) => (
            <AccordionItemComponent
              key={faq.itemNo}
              itemNo={faq.itemNo}
              title={faq.title}
              content={faq.content}
            />
          ))}
        </Accordion>
      </div>
    </div>
  );
};

export default FAQ;
