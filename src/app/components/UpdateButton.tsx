import Link from "next/link";
import React from "react";

export default function UpdateButton({
  type,
  id,
  status,
  size = "small",
}: {
  type: "flohmarkt" | "post";
  size: "small" | "medium" | "large";
  id: number;
  status: "approved" | "rejected" | "pending" | "old";
}) {
  return (
    <Link
      href={`/update-${type}/${id}`}
      className={`flex ${
        size === "large" ? "w-full max-w-[1000px]" : "w-fit"
      } items-center justify-center rounded  px-2 ${
        size === "small" ? "py-1" : "py-2"
      } font-semibold bg-hh-700 text-white hover:bg-hh-800 active:bg-hh-600`}
    >
      Update {status === "pending" ? "suggested" : status} {type}
    </Link>
  );
}
