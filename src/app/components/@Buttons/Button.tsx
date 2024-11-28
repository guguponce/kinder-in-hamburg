import { cn } from "@app/utils/functions";
import Link from "next/link";
import React from "react";

type iButtonProps<C extends React.ElementType = "button"> = {
  as?: string;
  variant?:
    | "hh-dark"
    | "hh-light"
    | "hh"
    | "positive-dark"
    | "positive-light"
    | "positive"
    | "negative-dark"
    | "negative-light"
    | "negative"
    | "white";
  size?: "fit" | "full" | "small" | "medium" | "large";
  fontWeight?: "normal" | "bold" | "semibold" | "extrabold";
  fontSize?: "xs" | "sm" | "base" | "lg" | "xl" | "2xl";
  fontGrow?: boolean;
  href?: string;
  children: React.ReactNode;
} & React.ComponentPropsWithRef<C>;

export default function Button({
  as,
  href,
  children,
  fontWeight = "normal",
  variant = "hh",
  size = "medium",
  fontSize = "base",
  fontGrow = false,
  className,
  ...rest
}: iButtonProps) {
  const style = {
    fontWeight: {
      normal: "font-normal",
      bold: "font-bold",
      semibold: "font-semibold",
      extrabold: "font-extrabold",
    },
    fontSize: {
      still: {
        xs: "text-xs",
        sm: "text-sm",
        base: "text-base",
        lg: "text-lg",
        xl: "text-xl",
        "2xl": "text-2xl",
      },
      grow: {
        xs: "text-xs md:text-base xl:text-lg",
        sm: "text-sm md:text-base xl:text-lg",
        base: "text-base md:text-lg xl:text-xl",
        lg: "text-lg md:text-xl xl:text-2xl",
        xl: "text-xl md:text-2xl xl:text-3xl",
        "2xl": "text-2xl md:text-3xl",
      },
    },
    size: {
      fit: "w-fit px-4 py-2",
      full: "w-full px-4 py-2",
      small: "max-w-24 px-2 py-1",
      medium: "max-w-32 px-3 py-2",
      large: "max-w-48 px-4 py-3",
    },
    variant: {
      "hh-dark": "bg-hh-800 text-white hover:bg-hh-700 active:bg-hh-900",
      "hh-light": "bg-hh-50 text-hh-700 hover:bg-hh-100 active:bg-hh-300",
      hh: "bg-hh-500 text-white hover:bg-hh-400 active:bg-hh-600",
      "positive-dark":
        "bg-positive-800 text-white hover:bg-positive-700 active:bg-positive-900",
      "positive-light":
        "bg-positive-50 text-positive-700 hover:bg-positive-100 active:bg-positive-300",
      positive:
        "bg-positive-500 text-white hover:bg-positive-400 active:bg-positive-600",
      "negative-dark":
        "bg-negative-800 text-white hover:bg-negative-700 active:bg-negative-900",
      "negative-light":
        "bg-negative-50 text-negative-700 hover:bg-negative-100 active:bg-negative-300",
      negative:
        "bg-negative-500 text-white hover:bg-negative-400 active:bg-negative-600",
      white: "bg-white text-hh-800 hover:bg-hh-600 hover:text-white",
    },
  };

  const selectedStyle = `${style.size[size]} ${style.variant[variant]} ${
    style.fontWeight[fontWeight]
  } ${
    style.fontSize[fontGrow ? "grow" : "still"][fontSize]
  } rounded-md text-center transition-all`;
  if (as === "link" || !!href)
    return (
      <Link className={cn(selectedStyle, className)} href={href || "/"}>
        {children}
      </Link>
    );
  return (
    <button {...rest} className={cn(selectedStyle, className)}>
      {children}
    </button>
  );
}
