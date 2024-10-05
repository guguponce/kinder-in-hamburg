import React from "react";
import LinkActive from "./LinkActive";
import { logoFont } from "@app/styles/fonts/localfonts";
import Link from "next/link";
import BurgerMenu from "./BurgerMenu";
import UserButtons from "./UserButtons";
import AdminServerComponent from "@app/providers/AdminServerComponents";
import PostLogo from "../@Icons/@PostLogo/PostLogo";

export default async function Header() {
  return (
    <header
      id="header"
      className="relative h-20 w-full lg:max-w-[1200px] bg-negative-400 flex justify-between lg:justify-center items-center gap-2 text-white"
    >
      <AdminServerComponent>
        <BurgerMenu />
      </AdminServerComponent>
      <div
        className="h-full px-4 flex-grow rounded-sm flex items-center justify-center lg:justify-start gap-4"
        id="logo-text"
      >
        <div className="flex items-center justify-center" id="logo">
          <Link href="/">
            <PostLogo logo="logo" size="6.5rem" />
          </Link>
        </div>

        <Link
          className={`${logoFont.className} text-3xl hidden sm:flex sm:text-4xl pt-1 align-top tracking-wide sm:tracking-widest text-end lg:text-center font-bold text-white items-end gap-4`}
          href="/"
        >
          Kinder in HH
        </Link>
      </div>
      <AdminServerComponent>
        <nav className="hidden font-semibold lg:flex items-center gap-4">
          {[
            { href: "/posts", name: "Posts", auth: true },
            { href: "/flohmaerkte", name: "Flohmärkte", auth: true },
            { href: "/categories", name: "Categories", auth: true },
            { href: "/bezirke", name: "Bezirke", auth: true },
          ].map(({ href, name, auth }) =>
            auth ? (
              <React.Fragment key={href}>
                <Link key={href} href={href}>
                  {name}
                  <LinkActive linkHref={href} />
                </Link>
              </React.Fragment>
            ) : (
              <Link key={href} href={href}>
                {name}
                <LinkActive linkHref={href} />
              </Link>
            )
          )}
        </nav>
      </AdminServerComponent>
      <AdminServerComponent>
        <div className="lg:ml-4 flex gap-2 items-center">
          <UserButtons />
        </div>
      </AdminServerComponent>
    </header>
  );
}
