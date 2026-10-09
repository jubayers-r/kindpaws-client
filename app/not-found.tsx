"use client";

import ErrorPage from "@/components/ErrorPage/ErrorPage";

export default function NotFound() {
  return <ErrorPage error={{ statusCode: 404, status: 404 }} />;
}
