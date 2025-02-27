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
      <AdminServerComponent>
        <BurgerMenu />
      </AdminServerComponent>
      <Link
        href={"/"}
        className="h-full overflow-hidden px-4 flex-grow rounded-sm flex items-center justify-center lg:justify-start gap-4"
        id="main-logo-link"
      >
        <Image
          src="/assets/logo/WhiteLogo-NoText.png"
          alt="Kinder in Hamburg"
          width={108}
          height={75}
          priority
          layout="intrinsic"
          className="hidden lg:flex object-contain text-sm brightness-105"
        />
        <Image
          layout="intrinsic"
          src="/assets/logo/WhiteLogo-Transparent.png"
          alt="Kinder in Hamburg"
          width={108}
          height={75}
          priority
          className="lg:hidden object-contain text-sm brightness-105"
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
