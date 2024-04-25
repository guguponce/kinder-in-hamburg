import AdminClientComponent from "@app/providers/AdminClientComponents";
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
    <main className="p-8 flex flex-col gap-4 items-center bg-hh-200 rounded border-2 border-negative-700">
      <h1 className="text-3xl font-semibold text-negative-800">
        Es gab ein Problem
      </h1>
      <AdminClientComponent>
        <p className="text-lg text-negative-900">
          {'"'}
          {error}
          {'"'}
        </p>
      </AdminClientComponent>
      <div className="flex justify-center items-center gap-1">
        <button
          className="p-2 text-white bg-positive-700 rounded"
          onClick={() => reset()}
        >
          Probier nochmal
        </button>
        <Link href={"/"} className="p-2 text-white bg-negative-700 rounded">
          Startseite
        </Link>
      </div>
    </main>
  );
}
