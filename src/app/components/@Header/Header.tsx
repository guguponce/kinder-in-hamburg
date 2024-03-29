import React from "react";
import LinkActive from "./LinkActive";

import Link from "next/link";
import LoggedLinks from "./LoggedLinks";
import BurgerMenu from "./BurgerMenu";
import AuthButton from "./AuthButton";
import UserAvatar from "../UserAvatar";
import { getServerSession } from "next-auth";

export default async function Header() {
  const session = await getServerSession();
  return (
    <header
      id="header"
      className="relative h-20 w-full mb-8 lg:max-w-[1200px] bg-[hsl(11,76%,63%)] p-2 sm:p-4 flex justify-between items-center gap-2"
    >
      <div className="absolute left-1/2 h-full w-4 -translate-x-1/2 bg-black"></div>
      <BurgerMenu />
      <div
        className="h-full flex-grow mr-20 rounded-sm bg-[#fefefe] flex items-center justify-center lg:justify-start  hover:text-[#121212] active:text-[#121212] "
        id="logo-text"
      >
        <Link className="text-3xl text-center font-bold" href="/">
          Kinder in HH
        </Link>
      </div>
      <nav className="hidden lg:flex items-center gap-4">
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

        <LoggedLinks email={session?.user?.email} />
      </nav>
      <div className="ml-4 flex gap-2 items-center">
        <AuthButton email={session?.user?.name} />
        <UserAvatar name={session?.user?.name} avatar={session?.user?.image} />
      </div>
    </header>
  );
}
