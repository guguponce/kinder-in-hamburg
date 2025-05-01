import React from "react";
import { logoFont } from "@app/styles/fonts/localfonts";
import { cn } from "@app/utils/functions";

export default function PageTitle({
  title,
  className,
  textShadow = "2px 2px 2px rgba(0,0,0,0.5)",
}: {
  title: string;
  className?: string;
  textShadow?: string;
}) {
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
