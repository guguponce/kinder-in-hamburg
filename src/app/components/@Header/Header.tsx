import React from "react";
import { logoFont } from "@app/styles/fonts/localfonts";
import Link from "next/link";
import BurgerMenu from "./BurgerMenu";
import UserButtons from "./UserButtons";
import AdminServerComponent from "@app/providers/AdminServerComponents";
import PostLogo from "../@Icons/@PostLogo/PostLogo";
import NavLinks from "./NavLinks";
import Image from "next/image";

export default async function Header() {
  return (
    <header
      id="header"
      className="relative h-20 w-full lg:max-w-[1200px] bg-negative-400 flex justify-between lg:justify-center items-center gap-2 text-hh-50"
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
        {/* <PostLogo logo="logo" size="6.5rem" color="#f0f1f2" color2="#f0f1f2" /> */}
        <Image
          src="/assets/logo/WhiteLogo-Transparent.png"
          alt="Kinder in Hamburg"
          width={108}
          height={75}
          className="object-contain text-sm brightness-105"
        />
        {/* </div> */}

        <h1
          className={`showing-slow ${logoFont.className} text-3xl text-white hidden sm:flex sm:text-4xl pt-1 align-top tracking-wide sm:tracking-widest text-end lg:text-center font-bold items-end gap-4`}
        >
          Kinder in Hamburg
        </h1>
      </Link>
      <NavLinks />
      <AdminServerComponent>
        <UserButtons />
      </AdminServerComponent>
    </header>
  );
}
