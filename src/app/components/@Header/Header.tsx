import React from "react";
import LinkActive from "./LinkActive";

import Link from "next/link";
import BurgerMenu from "./BurgerMenu";
import UserButtons from "./UserButtons";
import AdminServerComponent from "@app/providers/AdminServerComponents";

export default async function Header() {
  return (
    <header
      id="header"
      className="relative h-20 w-full lg:max-w-[1200px] bg-negative-500 p-2 sm:p-4 flex justify-between lg:justify-center items-center gap-2 text-white"
    >
      <BurgerMenu />
      <div
        className="mx-auto h-full px-4 flex-grow  rounded-sm bg-white flex items-center  justify-end lg:justify-center   hover:text-[#121212] active:text-[#121212] "
        id="logo-text"
      >
        <Link
          className="text-3xl text-end lg:text-center font-bold text-hh-900 flex items-end bg-red-300 gap-4"
          href="/"
        >
          Kinder in HH
        </Link>
      </div>
      <nav className="hidden font-semibold lg:flex items-center gap-4">
        {[
          { href: "/posts", name: "Posts", auth: true },
          { href: "/flohmaerkte", name: "Flohmärkte", auth: true },
          { href: "/categories", name: "Categories", auth: true },
          { href: "/bezirke", name: "Bezirke", auth: true },
        ].map(({ href, name, auth }) =>
          auth ? (
            <React.Fragment key={href}>
              <AdminServerComponent>
                <Link key={href} href={href}>
                  {name}
                  <LinkActive linkHref={href} />
                </Link>
              </AdminServerComponent>
            </React.Fragment>
          ) : (
            <Link key={href} href={href}>
              {name}
              <LinkActive linkHref={href} />
            </Link>
          )
        )}
      </nav>
      <AdminServerComponent>
        <div className="lg:ml-4 flex gap-2 items-center">
          <UserButtons />
        </div>
      </AdminServerComponent>
    </header>
  );
}
