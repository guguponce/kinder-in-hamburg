import React from "react";
import ShortAbout from "@components/@Index/ShortAbout";
import FlohmaerkteBanner from "./components/@Index/FlohmaerkteContainer";
import SommerInHamburgBanner from "./components/@Index/sommerinhamburg/SommerInHamburgBanner";
import LaternenBanner from "./components/@Index/laternenumzug/LaternenBanner";
import { BaldBanner } from "./components/BaldBanner";
import WeihnachtsBanner from "./components/@Index/WeihnachtsBanner";

export default function Home() {
  return (
    <main
      id="homepage-main"
      className="w-full flex flex-col items-center gap-4 xs:px-2"
    >
      <div className="w-full flex gap-4 justify-center items-stretch flex-wrap">
        <WeihnachtsBanner />
        <LaternenBanner />
      </div>
      <FlohmaerkteBanner />
      <BaldBanner className="flex w-full sm:max-w-[640px] items-stretch" />

      <SommerInHamburgBanner></SommerInHamburgBanner>
      <ShortAbout></ShortAbout>
    </main>
  );
}
