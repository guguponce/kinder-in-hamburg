import React from "react";
import { logoFont } from "@app/styles/fonts/localfonts";
import { cn } from "@app/utils/functions";
import Link from "next/link";

export default function PageTitle({
  title,
  className,
  textShadow = "2px 2px 2px rgba(0,0,0,0.5)",
  link,
}: {
  title: string;
  className?: string;
  textShadow?: string;
  link?: string;
}) {
  if (link) {
    return (
      <Link
        href={link}
        className={cn(
          `font-bold min-w-fit text-center ${logoFont.className} tracking-wide text-2xl text-hh-50 mt-4 mx-4 mb-2 hover:text-hh-100`,
          className
        )}
        style={{ textShadow }}
      >
        {title}
      </Link>
    );
  }
  return (
    <h1
      id="page-title"
      className={cn(
        `font-bold min-w-fit text-center ${logoFont.className} tracking-wide text-hh-50 mt-4 mx-4 mb-2`,
        className
      )}
      style={{ textShadow }}
    >
      {title}
    </h1>
  );
}
