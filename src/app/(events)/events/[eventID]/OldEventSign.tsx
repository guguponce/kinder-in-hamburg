import Link from "next/link";
import React from "react";

export default function OldEventSign({
  title,
  text,
}: {
  title?: string;
  text?: string;
}) {
  return (
    <aside className="flex flex-col items-center justify-center p-6 rounded-md bg-negative-100 border-4 border-negative-300 w-[500px] max-w-full m-2 gap-4">
      <h2 className="text-lg font-bold text-hh-950">
        {title || "Dieser Event ist bereits vorbei."}
      </h2>
      <p className="text-base text-hh-600">
        {text || "Schaue dich mal die zukunftigen Events an"}
      </p>
      <Link
        className="p-2 rounded-md bg-hh-800 hover:bg-hh-700 active:bg-hh-600 text-white"
        href="/events"
      >
        Alle Veranstaltungen
      </Link>
    </aside>
  );
}
