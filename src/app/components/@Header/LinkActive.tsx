"use client";

import { usePathname } from "next/navigation";

export default function Links({ linkHref }: { linkHref: string }) {
  const pathname = usePathname();

  return (
    <span
      className={`${
        pathname === linkHref ? "block w-full h-1 bg-black" : "hidden"
      }`}
    ></span>
  );
}
