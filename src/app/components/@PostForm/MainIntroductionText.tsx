import React from "react";
import PageTitle from "../PageTitle";

export default function MainIntroductionText({
  variant = "dark",
  width = "full",
  title,
  text,
  children,
}: {
  children?: React.ReactNode;
  title: string;
  text: string;
  variant?: "light" | "dark";
  width?: "full" | "half" | number;
}) {
  return (
    <div
      className={`px-2 lg:py-4 rounded  ${variant === "light" ? "text-hh-50" : "text-hh-800"} ${width === "full" ? "w-full" : width === "half" ? "w-1/2" : `w-[${width}%]`} flex flex-col items-center`}
    >
      <PageTitle title={title} />
      <p className="text-sm sm:text-base italic font-semibold bg-gradient-to-b from-[#33404D3d] to-[#33404d3d] rounded p-2">
        {text}
      </p>
      {children}
    </div>
  );
}
