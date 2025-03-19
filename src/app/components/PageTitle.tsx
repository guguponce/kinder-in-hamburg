import React from "react";
import { logoFont } from "@app/styles/fonts/localfonts";
import { cn } from "@app/utils/functions";

export default function PageTitle({
  title,
  className,
}: {
  title: string;
  className?: string;
}) {
  return (
    <h1
      className={cn(
        `font-bold min-w-fit text-center text-3xl ${logoFont.className} tracking-wide text-4xl sm:text-5xl text-hh-50 m-4`,
        className
      )}
      style={{ textShadow: "2px 2px 2px rgba(0,0,0,0.5)" }}
    >
      {title}
    </h1>
  );
}
