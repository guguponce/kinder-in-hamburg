import Link from "next/link";
import React from "react";

export default function ErrorContainer({
  as = "section",
  children,
}: {
  as?: "div" | "section" | "main";
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col items-center justify-center p-6 rounded-md text-negative-950 bg-negative-50 bg-opacity-25 w-[500px] max-w-full m-2 gap-4">
      {children}
    </section>
  );
}

ErrorContainer.Title = function ErrorTitle({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <h2 className="w-fit text-lg font-bold text-negative-950">{children}</h2>
  );
};

ErrorContainer.Text = function ErrorText({
  children,
}: {
  children: React.ReactNode;
}) {
  return <p className="text-base">{children}</p>;
};

ErrorContainer.Link = function ErrorLink({
  children,
  href,
}: {
  children: React.ReactNode;
  href: string;
}) {
  return (
    <Link
      className="p-2 rounded-md bg-negative-700 hover:bg-negative-600 active:bg-negative-800 text-white"
      href={href}
    >
      {children}
    </Link>
  );
};
