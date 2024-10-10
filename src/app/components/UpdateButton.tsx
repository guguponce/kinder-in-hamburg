import Link from "next/link";
import React from "react";

export default function UpdateButton({
  type,
  status,
  size = "small",
  link,
}: {
  type: "flohmarkt" | "post" | "spielplatz";
  size: "small" | "medium" | "large";
  status: "approved" | "rejected" | "pending" | "old";
  link: string;
}) {
  const bSize = size === "small" ? "py-1" : size === "medium" ? "py-2" : "py-4";
  const bWidth =
    size === "large"
      ? "w-full max-w-[1000px]"
      : size === "medium"
      ? "w-fit"
      : "max-w-24";
  return (
    <Link
      href={link}
      className={`${bSize} ${bWidth} rounded  py-2 font-semibold bg-hh-700 text-center text-white hover:bg-hh-800 active:bg-hh-600`}
    >
      Update {status === "pending" ? "suggested" : status} {type}
    </Link>
  );
}
