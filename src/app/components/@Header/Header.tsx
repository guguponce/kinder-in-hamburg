import React from "react";
import LinkActive from "./LinkActive";

import Link from "next/link";
import BurgerMenu from "./BurgerMenu";
import UserButtons from "./UserButtons";

export default async function Header() {
  return (
    <header
      id="header"
      className="relative h-20 w-full md:mb-8 mb-4 lg:max-w-[1200px] bg-[hsl(11,76%,63%)] p-2 sm:p-4 flex justify-between items-center gap-2"
    >
      <div className="absolute left-1/2 h-full w-4 -translate-x-1/2 bg-black"></div>
      <BurgerMenu />
      <div
        className="mx-auto h-full px-4 sm:flex-grow md:mr-20 rounded-sm bg-[#fefefe] flex items-center justify-center lg:justify-start  hover:text-[#121212] active:text-[#121212] "
        id="logo-text"
      >
        <Link className="text-3xl text-center font-bold text-hh-900" href="/">
          Kinder in HH
        </Link>
      </div>
      <nav className="hidden font-semibold lg:flex items-center gap-4">
        {[
          { href: "/", name: "Home" },
          { href: "/posts", name: "Posts" },
          { href: "/categories", name: "Categories" },
          { href: "/bezirke", name: "Bezirke" },
          { href: "/contact", name: "Contact" },
          { href: "/about", name: "About" },
        ].map(({ href, name }) => (
          <Link key={href} href={href}>
            {name}
            <LinkActive linkHref={href} />
          </Link>
        ))}
      </nav>
      <div className="lg:ml-4 flex gap-2 items-center">
        <UserButtons />
      </div>
    </header>
  );
}
