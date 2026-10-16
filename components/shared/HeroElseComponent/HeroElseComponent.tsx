"use client";

import React, { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

function BreadcrumbSegments() {
  const pathname = usePathname();
  const pathSegments = (pathname || "").split("/").filter(Boolean);

  return (
    <BreadcrumbList className="flex items-center gap-1 text-white">
      <BreadcrumbItem>
        <BreadcrumbLink
          asChild
          className="flex items-center gap-1 hover:border-b hover:border-white"
        >
          <Link href="/">KINDPAWS</Link>
        </BreadcrumbLink>
      </BreadcrumbItem>

      {pathSegments.map((segment, index) => (
        <div key={index} className="flex items-center gap-1">
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href={`/${pathSegments.slice(0, index + 1).join("/")}`}>
                {segment.toUpperCase().replaceAll("-", " ")}
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
        </div>
      ))}
    </BreadcrumbList>
  );
}

export const HeroElseComponent = () => {
  return (
    <div className="-mt-10 -z-10 w-full relative sm:mb-20 mb-10 h-[300px] overflow-hidden">
      <Image
        src="/assets/heroElse/titlebar-bg.jpg"
        alt=""
        fill
        priority
        sizes="100vw"
        quality={90}
        className="object-cover"
      />

      <div className="absolute top-2/3 w-[95%] 2xl:w-9/11 mx-auto left-0 right-0">
        <Breadcrumb>
          <Suspense
            fallback={
              <BreadcrumbList className="flex items-center gap-1 text-white">
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link href="/">KINDPAWS</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
              </BreadcrumbList>
            }
          >
            <BreadcrumbSegments />
          </Suspense>
        </Breadcrumb>
      </div>
    </div>
  );
};

export default HeroElseComponent;
