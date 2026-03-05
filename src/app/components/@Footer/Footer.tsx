import React from "react";
import PostLogo from "../@Icons/@PostLogo/PostLogo";
import Link from "next/link";
import { cn } from "@app/utils/functions";

function LinksColumn({
  links,
  className,
}: {
  links: { href: string; name: string }[];
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex gap-4 flex-col sm:flex-row sm:text-center min-w-24",
        className,
      )}
    >
      {" "}
      {links.map(({ href, name }) => (
        <Link
          key={href}
          href={href}
          className="text-white hover:underline-offset-4 hover:underline "
        >
          {name}
        </Link>
      ))}
    </div>
  );
}

export default function Footer() {
  return (
    <footer className="relative min-h-20 w-full mt-auto  bg-negative-400 p-2 sm:p-4 flex sm:flex-wrap sm:flex-row flex-col justify-center sm:justify-between items-center gap-2">
      <Link
        href="/"
        className="flex justify-center items-center w-36 h-24 overflow-hidden hover:brightness-110 hover:hue-rotate-[-167deg] hover:saturate-[0.5] transition-all"
      >
        <PostLogo
          logo="logo"
          color2="#f7887a"
          color="#fefefe"
          size="8rem"
          lazy
        />
      </Link>
      <h1 className="text-xl hidden sm:block text-center font-bold text-negative-400">
        Kinder in HH
      </h1>
      <nav className="flex justify-between sm:w-fit sm:justify-end gap-4">
        <LinksColumn
          links={[
            { href: "/about", name: "About" },
            { href: "/impressum", name: "Impressum" },
          ]}
          className="text-end"
        />
        <LinksColumn
          links={[
            { href: "/kontakt", name: "Kontakt" },
            { href: "/datenschutz", name: "Datenschutz" },
          ]}
          className="text-start"
        />
      </nav>
    </footer>
  );
}
