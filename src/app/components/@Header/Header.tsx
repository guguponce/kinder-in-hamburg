import React from "react";
import { logoFont } from "@app/styles/fonts/localfonts";
import Link from "next/link";
import BurgerMenu from "./BurgerMenu";
import UserButtons from "./UserButtons";
import AdminServerComponent from "@app/providers/AdminServerComponents";
import PostLogo from "../@Icons/@PostLogo/PostLogo";
import NavLinks from "./NavLinks";

export default async function Header() {
  return (
    <header
      id="header"
      className="relative h-20 w-full lg:max-w-[1200px] bg-negative-400 flex justify-between lg:justify-center items-center gap-2 text-white"
    >
      <AdminServerComponent>
        <BurgerMenu />
      </AdminServerComponent>
      <Link
        href={"/"}
        className="h-full overflow-hidden px-4 flex-grow rounded-sm flex items-center justify-center lg:justify-start gap-4"
        id="main-logo-link"
      >
        {/* <div className="flex items-center justify-center focus:outline" id="logo"> */}
        <PostLogo logo="logo" size="6.5rem" color="#9ed0e6" color2="#FFF9F3" />
        {/* </div> */}

        <span
          className={`${logoFont.className} text-3xl hidden sm:flex sm:text-4xl pt-1 align-top tracking-wide sm:tracking-widest text-end lg:text-center font-bold text-white items-end gap-4`}
        >
          Kinder in HH
        </span>
      </Link>
      <NavLinks />
      <AdminServerComponent>
        <UserButtons />
      </AdminServerComponent>
    </header>
  );
}
