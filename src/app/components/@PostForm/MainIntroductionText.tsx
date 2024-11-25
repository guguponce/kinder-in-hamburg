import React from "react";

export default function MainIntroductionText({
  variant = "dark",
  width = "full",
  title,
  text,
  extraInfo,
}: {
  extraInfo?: string;
  title: string;
  text: string;
  variant?: "light" | "dark";
  width?: "full" | "half" | number;
}) {
  return (
    <div
      className={`my-2 p-2 lg:py-4 rounded bg-opacity-50 bg-hh-50 ${variant === "light" ? "text-hh-200" : "text-hh-800"} ${width === "full" ? "w-full" : width === "half" ? "w-1/2" : `w-[${width}%]`} flex flex-col items-center gap-2`}
    >
      <h1 className="text-4xl font-bold">{title}</h1>
      <p className="text-base italic">{text}</p>
      <h2 className="text-xl font-bold my-4 p-2 md:p-4 rounded-xl border-4 border-hh-800 max-w-[600px] text-center">
        {extraInfo}
      </h2>
    </div>
  );
}
