"use client";

import React, { useRef } from "react";
import Image from "next/image";
import TestimonialCard from "./TestimonialCard";
import { useKeenSlider } from "keen-slider/react";
import { TestimonialItems } from "@/data/TestimonialItems";

export const Testimonials = () => {
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    loop: true,
    breakpoints: {
      "(min-width: 640px)": {
        slides: { perView: 1, spacing: 20 },
      },
      "(min-width: 768px)": {
        slides: { perView: 2, spacing: 24 },
      },
      "(min-width: 1024px)": {
        slides: { perView: 3, spacing: 32 },
      },
    },
    slides: { perView: 1, spacing: 16 },

    created() {
      timer.current = setInterval(() => {
        instanceRef.current?.next();
      }, 4000);
    },
    destroyed() {
      if (timer.current) clearInterval(timer.current);
    },
  });

  return (
    <section className="relative py-20 overflow-hidden">
      <div className="absolute inset-0 w-full h-full -z-10 overflow-hidden">
        <Image
          src="/assets/testimonial/testimonial-bg.jpg"
          alt="Testimonial background"
          fill
          className="object-cover opacity-10"
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">
        <div ref={sliderRef} className="keen-slider">
          {TestimonialItems.map((testimonial) => (
            <TestimonialCard key={testimonial.id} testimonial={testimonial} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
