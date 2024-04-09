import Link from "next/link";
import React from "react";

export default function ErrorComponent({
  error,
  reset,
}: {
  error: string;
  reset: () => void;
}) {
  return (
    <main className="p-8 flex flex-col gap-4 items-center bg-negative-200 rounded border-2 border-negative-700">
      <h1 className="text-3xl font-semibold text-negative-700">
        An error occurred
      </h1>
      <p className="text-lg text-negative-900">
        {'"'}
        {error}
        {'"'}
      </p>
      <div className="flex justify-center items-center gap-1">
        <button
          className="p-2 text-white bg-positive-700 rounded"
          onClick={() => reset()}
        >
          Try again
        </button>
        <Link href={"/"} className="p-2 text-white bg-negative-700 rounded">
          Go to Homepage
        </Link>
      </div>
    </main>
  );
}
