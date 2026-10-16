"use client";

import { motion } from "motion/react";
import Image from "next/image";
import { useState } from "react";
import Link from "next/link";
import { Autoplay, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

export const SwiperComponent = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const swiperItems = [
    {
      title: "Give Them a Second Chance",
      subtitle:
        "Every rescue pet has a story — your support helps rewrite it with love, care, and a forever home.",
      image: "/assets/hero/slider-3-slide-01.jpg",
    },
    {
      title: "Compassion in Every Donation",
      subtitle:
        "Even a small contribution can bring food, shelter, and medical aid to a pet in desperate need.",
      image: "/assets/hero/slider-3-slide-02.jpg",
    },
    {
      title: "Adopt, Don't Shop",
      subtitle:
        "Your decision to adopt saves lives and opens your home to unconditional love and loyalty.",
      image: "/assets/hero/slider-3-slide-03.jpg",
    },
  ];

  return (
    <div className="-mt-10 relative min-h-[420px] sm:min-h-[500px] h-[65vh] sm:h-[75vh] max-h-[700px] lg:max-h-none lg:h-[50vw] w-full overflow-hidden">
      <Swiper
        direction="horizontal"
        breakpoints={{
          1024: {
            direction: "vertical",
          },
        }}
        slidesPerView={1}
        spaceBetween={20}
        touchReleaseOnEdges={true}
        pagination={{ clickable: true }}
        modules={[Pagination, Autoplay]}
        loop={true}
        autoplay={{
          delay: 7000,
          disableOnInteraction: false,
        }}
        className="h-full"
        onSlideChange={(swiper) => {
          setActiveIndex(swiper.realIndex);
        }}
      >
        {swiperItems.map((item, index) => (
          <SwiperSlide key={item.title} className="overflow-hidden">
            <div className="relative w-full h-full">
              <Image
                src={item.image}
                fill
                priority={index === 0}
                sizes="100vw"
                quality={90}
                className="object-cover w-full h-full brightness-75 sm:brightness-85"
                alt={item.title}
              />

              {index === activeIndex && (
                <div className="absolute inset-0 flex items-end sm:items-center justify-start pointer-events-none pb-6 sm:pb-0">
                  <div className="w-[95%] 2xl:w-9/11 mx-auto px-5">
                    <motion.div
                      key={item.title}
                      initial={{ opacity: 0, x: -60 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                      className="pointer-events-auto text-white w-full max-w-lg bg-black/50 sm:bg-black/40 backdrop-blur-sm rounded-2xl p-4 sm:p-6 xl:p-8 space-y-4 sm:space-y-6 text-center sm:text-left"
                    >
                      <div className="space-y-2 sm:space-y-4">
                        <h1 className="text-2xl sm:text-4xl xl:text-6xl font-extrabold leading-tight tracking-tight drop-shadow-md">
                          {item.title}
                        </h1>
                        <p className="text-xs sm:text-base xl:text-lg font-medium text-gray-200 border-l-0 sm:border-l-4 border-primary pl-0 sm:pl-4 leading-relaxed line-clamp-3 sm:line-clamp-none">
                          {item.subtitle}
                        </p>
                      </div>

                      <div className="flex flex-wrap justify-center sm:justify-start gap-2.5 sm:gap-4 pt-1 sm:pt-2">
                        <Link
                          href="/adopt"
                          className="px-5 sm:px-6 py-2 rounded-full bg-primary hover:bg-primary/90 text-white font-semibold transition duration-300 text-xs sm:text-base"
                        >
                          Explore Paws
                        </Link>

                        <Link
                          href="/contact-us"
                          className="px-5 sm:px-6 py-2 rounded-full border border-white hover:bg-white hover:text-black text-white font-semibold transition duration-300 text-xs sm:text-base"
                        >
                          Contact Us
                        </Link>
                      </div>
                    </motion.div>
                  </div>
                </div>
              )}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default SwiperComponent;
