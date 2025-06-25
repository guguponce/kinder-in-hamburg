import { cn } from "@app/utils/functions";
import Link from "next/link";
import React from "react";

export default function Banner({
  children,
  href,
  linkText = "Mehr entdecken",
  className,
  textSide = "left",
  childrenClassName,
}: {
  children: React.ReactNode;
  href?: string;
  linkText?: string;
  className?: string;
  childrenClassName?: string;
  textSide?: "left" | "right";
}) {
  return (
    <section
      className={cn(
        "p-4 relative rounded-lg bg-gradient-to-b from-hh-950 to-hh-800 w-full flex gap-2 md:gap-4 flex-col items-center max-w-[420px] sm:max-w-[800px] text-white shadow-xl bg-opacity-10 transition-all overflow-hidden",
        className
      )}
    >
      <div
        className={cn(
          "sm:gap-2 flex flex-grow sm:flex-row w-full items-center",
          textSide === "left" ? "flex-col" : "flex-col-reverse",
          childrenClassName
        )}
      >
        {children}
      </div>

      {href && (
        <Link
          href={href}
          className="underline underline-offset-2 font-semibold px-4 text-end text-white self-end hover:scale-[1.01] transition-all hover:underline-offset-4"
        >
          {linkText}
        </Link>
      )}
    </section>
  );
}

Banner.TextSide = function BannerTextSide({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center self-stretch gap-1 flex-grow sm:px-2">
      {children}
    </div>
  );
};

Banner.ImagesSide = function BannerImagesSide({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full flex items-center h-fit sm:items-stretch justify-around flex-col sm:flex-row gap-4 bg-hh-100 bg-opacity-50 p-2 rounded-[0_0_6px_6px] sm:rounded">
      {children}
    </div>
  );
};

Banner.Title = function BannerTitle({
  children,
  href,
}: {
  href?: string;
  children: React.ReactNode;
}) {
  return href ? (
    <Link
      href={href}
      className="text-3xl sm:pt-4 lg:mb-4 text-center font-bold p-1 sm:mb-none hover:text-hh-50 hover:scale-[1.01] transition-all"
    >
      {children}
    </Link>
  ) : (
    <h2 className="text-3xl sm:pt-4 lg:mb-4 text-center font-bold p-1 sm:mb-none">
      {children}
    </h2>
  );
};

Banner.Text = function BannerText({
  children,
  className,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return <p className={cn("italic text-sm", className)}>{children}</p>;
};

Banner.Image = function BannerImage({
  src,
  alt,
  className,
  imgClassname,
}: {
  src: string;
  alt: string;
  className?: string;
  imgClassname?: string;
}) {
  return (
    <div
      className={cn("w-full aspect-square outline-1 outline-hh-200", className)}
    >
      <img
        src={src}
        alt={alt}
        className={cn("w-full h-full rounded-lg object-cover", imgClassname)}
      />
    </div>
  );
};
