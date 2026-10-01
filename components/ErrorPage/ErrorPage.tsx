"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";

interface ErrorPageProps {
  error?:
    | {
        status?: number;
        statusCode?: number;
        message?: string;
        response?: { data?: { message?: string } };
      }
    | Error
    | string
    | null;
  reset?: () => void;
}

export const ErrorPage: React.FC<ErrorPageProps> = ({ error, reset }) => {
  const router = useRouter();

  const errorObj =
    typeof error === "object" && error !== null
      ? (error as {
          status?: number;
          statusCode?: number;
          message?: string;
          response?: { data?: { message?: string } };
        })
      : null;

  const isNotFound = errorObj?.status === 404 || errorObj?.statusCode === 404;

  const heading = isNotFound ? "Oops! Page Not Found" : "Something Went Wrong";
  const detail = isNotFound
    ? "The page you are looking for doesn’t exist or has been moved."
    : errorObj?.response?.data?.message ||
      (typeof error === "string" && error) ||
      errorObj?.message ||
      "We couldn't load this page. Please try again.";

  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-gray-50 px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-md"
      >
        {!isNotFound && (
          <motion.img
            src="/assets/cta/paw-img.png"
            alt=""
            className="mx-auto mb-4 w-24 h-24 object-contain select-none"
            transformTemplate={() => "rotate(50deg) scaleY(-1)"}
            initial={{ scaleY: -1 }}
            animate={{
              scaleY: -1,
              filter: [
                "brightness(100%)",
                "brightness(150%)",
                "brightness(100%)",
              ],
              opacity: [0.4, 1.2, 0.4],
            }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          />
        )}
        <h1 className="text-6xl font-bold text-red-500">
          {isNotFound ? "404" : "Oops!"}
        </h1>
        <h2 className="mt-4 text-2xl font-semibold text-gray-800">{heading}</h2>
        <p className="mt-2 text-gray-600">{detail}</p>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Button
            onClick={() => (reset ? reset() : window.location.reload())}
            className="rounded-2xl px-6 py-2 shadow-md"
          >
            Try Again
          </Button>
          <Button
            variant="outline"
            onClick={() => router.push("/")}
            className="rounded-2xl px-6 py-2"
          >
            Go Home
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default ErrorPage;
