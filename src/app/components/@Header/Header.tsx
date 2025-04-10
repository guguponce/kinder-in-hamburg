import React from "react";
import { logoFont } from "@app/styles/fonts/localfonts";
import Link from "next/link";
import BurgerMenu from "./BurgerMenu";
import UserButtons from "./UserButtons";
import AdminServerComponent from "@app/providers/AdminServerComponents";
import NavLinks from "./NavLinks";
import Image from "next/image";

export default async function Header() {
  return (
    <header
      id="header"
      className="relative h-20 w-full lg:max-w-[1200px] bg-negative-400 flex justify-between lg:justify-center items-center gap-2 text-hh-50"
    >
      {/* <div className="burgerContainer w-14 h-full flex flex-col justify-center"> */}
      <AdminServerComponent>
        <BurgerMenu />
      </AdminServerComponent>
      {/* </div> */}
      <Link
        href={"/"}
        className="h-full overflow-hidden px-4 flex-grow rounded-sm flex items-center justify-center lg:justify-start gap-4"
        id="main-logo-link"
      >
        <Image
          src="/assets/logo/WhiteLogo-NoText.png"
          alt="Kinder in Hamburg"
          width={120}
          height={80}
          priority
          className="w-auto h-auto max-h-full hidden lg:flex object-contain text-sm brightness-105"
        />
        <Image
          src="/assets/logo/WhiteLogo-Transparent.png"
          alt="Kinder in Hamburg"
          width={120}
          height={80}
          priority
          className="w-auto h-auto max-h-full lg:hidden object-contain text-sm brightness-105"
        />

        <h1
          className={`showing-slow ${logoFont.className} text-3xl text-white hidden lg:flex flex-col sm:text-4xl items-start pt-1 align-top tracking-wide sm:tracking-widest gap-0 text-end sm:leading-none font-bold `}
        >
          <span>Kinder</span>
          <span>in Hamburg</span>
        </h1>
      </Link>
      <div className="hidden lg:flex">
        <NavLinks />
      </div>
      <AdminServerComponent>
        <UserButtons />
      </AdminServerComponent>
    </header>
  );
}
