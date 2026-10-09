"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { motion } from "motion/react";
import { MoveUpRight } from "lucide-react";
import Link from "next/link";

export const CTA = () => {
  return (
    <section className="rounded-2xl shadow-md bg-white">
      <div className="grid sm:grid-cols-3 items-center relative overflow-hidden rounded-2xl">
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          viewport={{ once: true }}
          className="col-span-2 relative pointer-events-none sm:block hidden"
        >
          <Image
            src="/assets/cta/bg-img.png"
            alt="dog"
            width={700}
            height={500}
            className="w-full h-auto object-contain"
          />
          <Image
            src="/assets/cta/paw-bg-pattern.png"
            alt="bg-paw"
            width={300}
            height={300}
            className="absolute top-20 h-auto"
          />
          <motion.img
            src="/assets/cta/bone-img.png"
            alt="bone"
            className="absolute w-15 md:w-20 xl:top-30 xl:right-80 lg:top-30 lg:right-60 md:right-45 right-40 top-20"
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
          className="lg:-translate-x-50 sm:-translate-x-20 place-items-center text-center sm:place-items-start sm:text-left py-10 sm:py-0"
        >
          <div className="space-y-5 max-w-lg">
            <p className="font-light lg:text-5xl text-3xl text-primary">
              Give a Paw🐾
            </p>
            <h2 className="text-2xl/tight sm:text-3xl/tight lg:text-5xl/tight font-semibold text-secondary mb-4 xl:uppercase">
              Some pet to life in need
            </h2>
            <p className="text-muted-foreground mb-6 text-lg sm:hidden 2xl:block">
              Every adoption saves a life and brings joy to another. Join our
              mission to unite pets with their forever homes and make a real
              impact — one paw at a time.
            </p>
          </div>
          <Link href="/adopt" className="group inline-block">
            <Button
              size="lg"
              className="gap-3 rounded-full bg-primary px-7 py-6 text-base font-semibold text-white shadow-md shadow-primary/30 transition-all duration-300 hover:-translate-y-1 hover:bg-secondary hover:shadow-lg hover:shadow-secondary/40 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 lg:text-xl [&_svg]:size-5 [&_svg]:transition-transform [&_svg]:duration-300 group-hover:[&_svg]:-translate-y-0.5 group-hover:[&_svg]:translate-x-0.5"
            >
              Find Your New Best Friend
              <MoveUpRight />
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
        <div className="absolute -top-20 -right-15 lg:w-60 w-50 lg:h-60 h-50 rounded-full bg-secondary md:flex items-center justify-center hidden">
          <div className="relative">
            <p className="text-4xl font-medium text-white text-center absolute top-0 -left-17">
              Adopt <br /> <span className="text-primary font-bold">Now</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
