import React from "react";
import ShortAbout from "@components/@Index/ShortAbout";
import FlohmaerkteContainer from "./components/FlohmaerkteContainer";
import LaternenBanner from "./components/@Index/laternenumzug/LaternenBanner";
import WeihnachtsBanner from "./components/@Index/WeihnachtsBanner";

export default function Home() {
  return (
    <main
      id="homepage-main"
      className="w-full flex flex-col items-center gap-4 xs:px-2"
    >
      <div className="w-fit flex flex-col justify-center lg:flex-row lg:justify-between items-center gap-4">
        <WeihnachtsBanner />
        <LaternenBanner />
      </div>
      <FlohmaerkteContainer />
      <ShortAbout></ShortAbout>
    </main>
  );
}
