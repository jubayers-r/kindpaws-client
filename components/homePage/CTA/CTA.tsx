"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

export const CTA = () => {
  return (
    <section className="rounded-2xl shadow-md bg-white">
      <div className="grid md:grid-cols-5 lg:grid-cols-3 items-center relative overflow-hidden rounded-2xl">
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          viewport={{ once: true }}
          className="md:col-span-3 lg:col-span-2 relative pointer-events-none sm:block hidden"
        >
          <Image
            src="/assets/cta/bg-img.png"
            alt="dog"
            width={1026}
            height={614}
            sizes="(max-width: 1024px) 60vw, 50vw"
            quality={90}
            className="w-full h-auto object-contain"
          />
          <Image
            src="/assets/cta/paw-bg-pattern.png"
            alt="bg-paw"
            width={369}
            height={368}
            sizes="(max-width: 768px) 180px, (max-width: 1024px) 240px, 369px"
            quality={90}
            className="absolute top-4 md:top-6 lg:top-20 left-0 w-44 md:w-60 lg:w-[369px] h-auto"
          />
          <motion.img
            src="/assets/cta/bone-img.png"
            alt="bone"
            className="absolute w-15 md:w-16 lg:w-20 xl:top-30 xl:right-80 lg:top-30 lg:right-60 md:right-36 right-40 top-20"
            animate={{
              rotate: [-15, 20, -15],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          viewport={{ once: true }}
          className="md:col-span-2 lg:col-span-1 md:-translate-x-10 lg:-translate-x-50 flex flex-col items-center text-center md:items-start md:text-left py-8 md:py-0 px-6 md:px-0 md:pr-10 lg:pr-0 z-10"
        >
          <div className="space-y-4 md:space-y-3 lg:space-y-5 max-w-lg">
            <p className="font-light text-2xl sm:text-3xl lg:text-5xl text-primary">
              Give a Paw🐾
            </p>
            <h2 className="text-2xl/tight sm:text-3xl/tight md:text-2xl/tight lg:text-5xl/tight font-semibold text-secondary mb-2 md:mb-4 xl:uppercase">
              Some pet to life in need
            </h2>
            <p className="text-muted-foreground mb-4 md:mb-6 text-base sm:text-lg">
              Every adoption saves a life and brings joy to another.{" "}
              <span className="md:hidden lg:inline">
                Join our mission to unite pets with their forever homes and make a real
                impact — one paw at a time.
              </span>
            </p>
          </div>
          <Link href="/adopt" className="group inline-block w-full sm:w-auto">
            <Button
              size="xl"
              className="w-full sm:w-auto h-auto gap-3 rounded-full bg-primary px-6 md:px-5 lg:px-7 py-4 md:py-4 lg:py-6 text-sm sm:text-base font-semibold text-white shadow-md shadow-primary/30 transition-all duration-300 hover:-translate-y-1 hover:bg-secondary hover:shadow-lg hover:shadow-secondary/40 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 lg:text-xl [&_svg]:size-5 [&_svg]:transition-transform [&_svg]:duration-300 group-hover:[&_svg]:-translate-y-0.5 group-hover:[&_svg]:translate-x-0.5"
            >
              Find Your New Best Friend
              <ArrowUpRight className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Button>
          </Link>
        </motion.div>

        <motion.img
          src="/assets/cta/paw-img.png"
          alt="bg-paw"
          className="pointer-events-none bottom-5 right-5 lg:flex hidden absolute"
          animate={{
            filter: [
              "brightness(100%)",
              "brightness(150%)",
              "brightness(100%)",
            ],
            opacity: [0.4, 1.2, 0.4],
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <div className="absolute -top-16 -right-14 lg:-top-20 lg:-right-15 w-44 h-44 lg:w-60 lg:h-60 rounded-full bg-secondary md:flex items-center justify-center hidden pointer-events-none">
          <div className="relative">
            <p className="text-2xl lg:text-4xl font-medium text-white text-center absolute -top-3 lg:top-0 -left-12 lg:-left-17">
              Adopt <br /> <span className="text-primary font-bold">Now</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
