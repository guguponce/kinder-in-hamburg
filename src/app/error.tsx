"use client";
import React from "react";
import ErrorComponent from "./components/ErrorComponent";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return <ErrorComponent error={error.message} reset={reset} />;
}
