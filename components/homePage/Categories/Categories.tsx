"use client";

import { motion } from "motion/react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { API_BASE_URL } from "@/lib/axiosSecure";

const normalize = (v: string) => (v || "").trim().toLowerCase().replace(/s$/, "");

export const Categories = () => {
  const [petCounts, setPetCounts] = useState<Record<string, number> | null>(null);

  useEffect(() => {
    let mounted = true;
    const controller = new AbortController();

    fetch(`${API_BASE_URL}/api/pets`, {
      signal: controller.signal,
    })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (!mounted) return;
        const pets = Array.isArray(data) ? data : data?.value || [];
        if (!Array.isArray(pets)) throw new Error("Unexpected response shape");
        const counts: Record<string, number> = {};
        pets.forEach((pet) => {
          if (!pet?.category) return;
          const key = normalize(pet.category);
          counts[key] = (counts[key] || 0) + 1;
        });
        setPetCounts(counts);
      })
      .catch((err) => {
        if (!mounted || err?.name === "AbortError") return;
        console.error("Failed to load pet counts for Categories:", err);
        setPetCounts({});
      });

    return () => {
      mounted = false;
      controller.abort();
    };
  }, []);

  const petCategories = [
    { img: "/assets/categories/reptiles.png", category: "Reptile", color: "bg-[#e2f1d2]" },
    { img: "/assets/categories/fish.png", category: "Fish", color: "bg-[#f7efe2]" },
    { img: "/assets/categories/cat.png", category: "Cats", color: "bg-[#f2dcdc]" },
    { img: "/assets/categories/dog.png", category: "Dogs", color: "bg-[#f3e9e0]" },
    { img: "/assets/categories/parrot.png", category: "Birds", color: "bg-[#eeeeee]" },
    { img: "/assets/categories/frog.png", category: "Frog", color: "bg-[#f7efe2]" },
  ];

  const circleVariants = {
    initial: {
      scale: 1.1,
    },
    hover: {
      scale: 1.15,
    },
  };

  const textVariants = {
    rest: {
      x: 0,
    },
    hover: {
      x: 300,
      transition: {
        duration: 1,
        ease: "easeInOut" as const,
      },
    },
  };

  const circle = (
    index: number,
    shrink: string,
    color: string,
    img: string,
    category: string
  ) => {
    const displayCount =
      petCounts === null ? "…" : (petCounts[normalize(category)] ?? 0);
    return (
      <Link
        key={index}
        href={`/adopt?category=${encodeURIComponent(category)}`}
        className="block"
        aria-label={`Find ${category} to adopt`}
      >
        <motion.div
          className="flex flex-col justify-center text-center items-center"
          whileHover="hover"
          initial="initial"
        >
          <div
            className={`relative h-[120px] w-[120px] sm:h-[200px] sm:w-[200px] rounded-full flex items-center justify-center font-bold ${color} ${shrink}`}
          >
            <div className="absolute inset-0 overflow-hidden rounded-full z-0">
              <motion.p
                variants={textVariants}
                className="text-white translate-y-2 text-[50px] sm:text-[80px] font-black tracking-wide pointer-events-none select-none font-[Outfit]"
              >
                {category}
              </motion.p>
            </div>

            <motion.img
              src={img}
              alt={category}
              variants={circleVariants}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="scale-[1.1] z-10 object-contain -translate-y-3 sm:-translate-y-5 pointer-events-none"
            />
          </div>
          <p className="mt-3 font-bold">
            {category}
            <sup>({displayCount})</sup>
          </p>
        </motion.div>
      </Link>
    );
  };

  return (
    <div className="text-secondary overflow-hidden">
      <h3 className="font-bold sm:text-5xl text-3xl text-center sm:mt-20 mt-10 dark:text-secondary-foreground">
        Find Your Best Match
      </h3>
      <div className="xl:grid xl:grid-cols-6 xl:gap-5 hidden my-20 sm:my-30 dark:text-secondary-foreground">
        {petCategories.map((item, i) =>
          circle(i, "", item.color, item.img, item.category)
        )}
      </div>

      <motion.div
        className="flex xl:hidden gap-5 cursor-grab active:cursor-grabbing my-20 sm:my-30"
        drag="x"
        dragConstraints={{ left: -400, right: 0 }}
        whileTap={{ cursor: "grabbing" }}
      >
        {petCategories.map((item, i) =>
          circle(i, "", item.color, item.img, item.category)
        )}
      </motion.div>
    </div>
  );
};

export default Categories;
