import React from "react";
import PostLogo from "../@Icons/PostLogo";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="relative min-h-20 w-full mt-auto  bg-negative-400 p-2 sm:p-4 flex sm:flex-wrap sm:flex-row flex-col justify-center sm:justify-between items-center gap-2">
      <div className="flex justify-center items-center">
        <PostLogo logo="hh" color="#fefefe" size="4rem" />
        <h1 className="text-xl hidden sm:block text-center font-bold text-white">
          Kinder in HH
        </h1>
      </div>
      <nav className="flex justify-between sm:w-fit sm:justify-end gap-4">
        <div className="flex gap-4 flex-col sm:flex-row sm:text-center text-end min-w-24">
          {" "}
          {[
            { href: "/about", name: "About" },
            { href: "/contact", name: "Contact" },
          ].map(({ href, name }) => (
            <Link
              key={href}
              href={href}
              className="text-white hover:underline-offset-4 hover:underline "
            >
              {name}
            </Link>
          ))}
        </div>
        <div className="flex gap-4 flex-col sm:flex-row sm:text-center text-start min-w-24">
          {[
            { href: "/impressum", name: "Impressum" },
            { href: "/datenschutz", name: "Datenschutz" },
          ].map(({ href, name }) => (
            <Link
              key={href}
              href={href}
              className="text-white hover:underline-offset-4 hover:underline "
            >
              {name}
            </Link>
          ))}
        </div>
      </nav>
    </footer>
  );
}
