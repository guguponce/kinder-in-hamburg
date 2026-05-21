import React from "react";
import { logoFont } from "@app/styles/fonts/localfonts";
import Link from "next/link";
import BurgerMenu from "./BurgerMenu";
import UserButtons from "./UserButtons";
import AdminServerComponent from "@app/providers/AdminServerComponents";
import NavLinks from "./NavLinks";
import UserLocationButton from "../@Map/UserLocationModal";
import AdminClientComponent from "@app/providers/AdminClientComponents";

export default async function Header() {
  return (
    <header
      id="header"
      className="relative h-20 w-full lg:max-w-[1200px] bg-negative-400 flex justify-between lg:justify-center items-center gap-2 text-hh-50"
    >
      {/* <div className="burgerContainer w-14 h-full flex flex-col justify-center"> */}
      <AdminServerComponent>
        <div className="flex-1 flex items-center justify-start lg:hidden">
          <BurgerMenu />
        </div>
      </AdminServerComponent>
      {/* </div> */}
      <Link
        href={"/"}
        className="h-full overflow-hidden px-4 rounded-sm flex items-center justify-center lg:justify-start gap-4"
        id="main-logo-link"
      >
        <img
          src="/assets/logo/WhiteLogo-NoText.png"
          loading="eager"
          className="hidden lg:flex w-[120px] h-[80px] object-contain text-sm brightness-105"
          alt="Kinder in Hamburg"
        />
        <img
          src="/assets/logo/WhiteLogo-Transparent.png"
          loading="eager"
          className="lg:hidden w-[120px] h-[80px] object-contain text-sm brightness-105"
          alt="Kinder in Hamburg"
        />

        <h1
          className={`showing-slow ${logoFont.className} text-3xl text-white hidden lg:flex flex-col sm:text-4xl items-start pt-1 align-top tracking-wide sm:tracking-widest gap-0 text-end sm:leading-none font-bold `}
        >
          <span>Kinder</span>
          <span>in Hamburg</span>
        </h1>
      </Link>
      <div className="hidden lg:flex flex-grow justify-end">
        <NavLinks />
      </div>
      <div className="flex-1 flex items-center justify-end gap-2">
        <AdminClientComponent>
          <UserLocationButton minimal />
        </AdminClientComponent>
        <AdminServerComponent>
          <UserButtons />
        </AdminServerComponent>
      </div>
    </header>
  );
}
