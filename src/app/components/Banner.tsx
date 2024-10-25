import Link from "next/link";
import React from "react";

export default function Banner({
  children,
  href,
  linkText = "Mehr entdecken",
}: {
  children: React.ReactNode;
  href: string;
  linkText?: string;
}) {
  return (
    <section className="p-4 rounded-lg bg-gradient-to-b from-hh-950 to-hh-800 w-full flex gap-4 flex-col items-center max-w-[420px] sm:max-w-[600px] text-white shadow-xl bg-opacity-10 transition-all">
      <div className="sm:gap-2 flex flex-col sm:flex-row w-full items-stretch">
        {children}
      </div>

      <Link
        href={href}
        className="underline underline-offset-2 font-semibold px-4 text-end text-white self-end hover:scale-[1.01] transition-all hover:underline-offset-4"
      >
        {linkText}
      </Link>
    </section>
  );
}

Banner.TextSide = function BannerTextSide({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center gap-1 flex-grow">{children}</div>
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
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="text-3xl sm:pt-4 text-center font-bold p-1 sm:mb-none hover:text-hh-50 hover:scale-[1.01] transition-all"
    >
      {children}
    </Link>
  );
};

Banner.Text = function BannerText({ children }: { children: React.ReactNode }) {
  return <p className="italic text-sm">{children}</p>;
};

Banner.Image = function BannerImage({
  src,
  alt,
}: {
  src: string;
  alt: string;
}) {
  return (
    <div className="w-full aspect-square">
      <img
        src={src}
        alt={alt}
        className="w-full h-full rounded-lg object-cover"
      />
    </div>
  );
};
