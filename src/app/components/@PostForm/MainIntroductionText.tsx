import React from "react";

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
      className={`my-2 p-2 lg:py-4 rounded bg-opacity-50 bg-hh-50 ${variant === "light" ? "text-hh-200" : "text-hh-800"} ${width === "full" ? "w-full" : width === "half" ? "w-1/2" : `w-[${width}%]`} flex flex-col items-center gap-2`}
    >
      <h1 className="text-4xl font-bold">{title}</h1>
      <p className="text-base italic">{text}</p>
      {children}
    </div>
  );
}
