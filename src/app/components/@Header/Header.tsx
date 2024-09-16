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
      <AdminServerComponent>
        <BurgerMenu />
      </AdminServerComponent>
      <div
        className="h-full px-4 flex-grow  rounded-sm bg-white flex items-center  justify-end lg:justify-center   hover:text-[#121212] active:text-[#121212] "
        id="logo-text"
      >
        <Link
          className="text-3xl text-end lg:text-center font-bold text-hh-800 flex items-end gap-4"
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
