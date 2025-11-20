import { getTodayNexMonday } from "@app/utils/functions";
import Link from "next/link";
import React from "react";

export default function OldFlohmarktSign({
  status,
  date,
}: {
  status: string;
  date: number;
}) {
  const { yesterdayEvening } = getTodayNexMonday();
  const isOld = date < yesterdayEvening || status === "old";
  if (!isOld) return null;
  return (
    <aside className="flex flex-col items-center justify-center p-6 rounded bg-negative-100 bg-opacity-75 border-4 border-negative-300 w-[500px] max-w-full m-2 gap-4">
      <h2 className="text-lg font-bold text-negative-950">
        Dieser Flohmarkt ist bereits vorbei.
      </h2>
      <p className="text-base text-negative-600 italic">
        Möchtest du die aktuellen Termine ansehen?
      </p>
      <Link
        className="p-2 rounded-md bg-hh-800 hover:bg-hh-700 active:bg-hh-600 text-white"
        href="/flohmaerkte"
      >
        Alle Flohmärkte
      </Link>
    </aside>
  );
}
