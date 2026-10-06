"use client";

import React, { useEffect, useMemo, useState, Suspense } from "react";
import CardComponent from "@/components/shared/CardComponent/CardComponent";
import SkeletonCardComponent from "@/components/shared/CardComponent/SkeletonCardComponent";
import { useSearchParams } from "next/navigation";
import { useInView } from "react-intersection-observer";
import { Check, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Pet } from "@/types";

const ITEMS_PER_PAGE = 6;

const CONTROL_CLASS =
  "flex w-full items-center justify-between gap-2 rounded-xl bg-white px-4 py-3 text-base shadow-sm hover:bg-gray-50 focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none data-[state=open]:bg-gray-50 dark:bg-neutral-900 dark:text-white dark:hover:bg-neutral-800 dark:data-[state=open]:bg-neutral-800";
const CONTENT_CLASS =
  "min-w-[var(--radix-dropdown-menu-trigger-width)] rounded-xl border-gray-200 p-1 shadow-lg dark:border-neutral-700 dark:bg-neutral-900 dark:text-white";
const ITEM_CLASS =
  "cursor-pointer rounded-lg px-3 py-2.5 focus:bg-accent dark:focus:bg-neutral-800";

interface FilterDropdownProps {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
}

const FilterDropdown = ({
  label,
  value,
  options,
  onChange,
}: FilterDropdownProps) => {
  const selected = options.find((option) => option.value === value);

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger aria-label={label} className={CONTROL_CLASS}>
        <span className="truncate">{selected?.label ?? value}</span>
        <ChevronDown className="size-4 shrink-0 opacity-50" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" sideOffset={6} className={CONTENT_CLASS}>
        {options.map((option) => (
          <DropdownMenuItem
            key={option.value}
            onSelect={() => onChange(option.value)}
            className={cn(
              ITEM_CLASS,
              option.value === value && "font-semibold text-primary"
            )}
          >
            {option.label}
            {option.value === value && <Check className="ml-auto size-4" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const normalizeCategory = (value: string) =>
  (value || "").trim().toLowerCase().replace(/s$/, "");

const getColumnCount = (width: number) => {
  if (width >= 1536) return 5;
  if (width >= 1280) return 4;
  if (width >= 768) return 3;
  if (width >= 640) return 2;
  return 1;
};

const useGridColumns = () => {
  const [columns, setColumns] = useState(1);

  useEffect(() => {
    const update = () => setColumns(getColumnCount(window.innerWidth));
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return columns;
};

function AdoptContent() {
  const searchParams = useSearchParams();
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);

  const { data: allPets = [], isLoading } = useQuery<Pet[]>({
    queryKey: ["pets"],
    queryFn: async () => {
      const res = await axios.get("https://kind-paws.vercel.app/api/pets");
      return res.data;
    },
  });

  const { ref, inView } = useInView();

  const categories = useMemo(() => {
    const all = allPets.map((pet) => pet.category).filter(Boolean);
    return ["All", ...Array.from(new Set(all))];
  }, [allPets]);

  const requestedCategory = useMemo(() => {
    const param = searchParams.get("category");
    if (!param) return null;
    const normalized = normalizeCategory(param);
    return (
      categories.find((cat) => normalizeCategory(cat) === normalized) || null
    );
  }, [searchParams, categories]);

  const [userSelectedCategory, setUserSelectedCategory] = useState<string | null>(null);
  const selectedCategory = userSelectedCategory ?? (requestedCategory || "All");

  const columns = useGridColumns();

  const filteredPets = useMemo(() => {
    return [...(allPets || [])]
      .filter(
        (pet) => selectedCategory === "All" || pet.category === selectedCategory
      )
      .sort((a, b) => {
        const dateA = new Date(a.dateAdded || a.createdAt || 0).getTime();
        const dateB = new Date(b.dateAdded || b.createdAt || 0).getTime();
        return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
      });
  }, [allPets, selectedCategory, sortOrder]);

  const isFiltered = selectedCategory !== "All";
  const totalPets = filteredPets.length;

  const visiblePets = useMemo(() => {
    if (totalPets === 0) return [];
    if (isFiltered) return filteredPets.slice(0, visibleCount);
    return Array.from(
      { length: visibleCount },
      (_, i) => filteredPets[i % totalPets]
    );
  }, [filteredPets, totalPets, visibleCount, isFiltered]);

  const hasMoreToLoad = !isFiltered || visibleCount < totalPets;

  const skeletonCount = useMemo(() => {
    if (totalPets === 0 || !hasMoreToLoad) return 0;
    const remainingInRow = (columns - (visibleCount % columns)) % columns;
    return remainingInRow + columns;
  }, [columns, visibleCount, totalPets, hasMoreToLoad]);

  useEffect(() => {
    if (inView && totalPets > 0 && hasMoreToLoad) {
      const timer = setTimeout(() => {
        setVisibleCount((prev) => prev + ITEMS_PER_PAGE);
      }, 10);
      return () => clearTimeout(timer);
    }
  }, [inView, totalPets, hasMoreToLoad]);

  return (
    <>
      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center mb-8 sm:mb-12 dark:text-white">
        Adopt a New Family Member
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-10 max-w-3xl mx-auto">
        <FilterDropdown
          label="Filter by category"
          value={selectedCategory}
          options={categories.map((cat) => ({ value: cat, label: cat }))}
          onChange={(value) => {
            setUserSelectedCategory(value);
            setVisibleCount(ITEMS_PER_PAGE);
          }}
        />

        <FilterDropdown
          label="Sort order"
          value={sortOrder}
          options={[
            { value: "desc", label: "Newest First" },
            { value: "asc", label: "Oldest First" },
          ]}
          onChange={(value) => {
            setSortOrder(value as "asc" | "desc");
            setVisibleCount(ITEMS_PER_PAGE);
          }}
        />
      </div>

      <div className="grid 2xl:grid-cols-5 xl:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-5">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCardComponent key={`loading-skeleton-${i}`} />
          ))
        ) : visiblePets.length > 0 ? (
          <>
            {visiblePets.map((pet, i) => (
              <CardComponent key={`${pet._id}-${i}`} data={pet} type="pet" />
            ))}
            {Array.from({ length: skeletonCount }, (_, i) => (
              <SkeletonCardComponent key={`skeleton-${i}`} />
            ))}
          </>
        ) : (
          <SkeletonCardComponent />
        )}
      </div>

      {filteredPets.length > 0 && <div ref={ref} aria-hidden="true" />}
    </>
  );
}

export default function AdoptPage() {
  return (
    <Suspense
      fallback={
        <div className="grid 2xl:grid-cols-5 xl:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCardComponent key={`suspense-skeleton-${i}`} />
          ))}
        </div>
      }
    >
      <AdoptContent />
    </Suspense>
  );
}
