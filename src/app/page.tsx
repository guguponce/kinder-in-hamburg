import React from "react";
import ShortAbout from "@components/@Index/ShortAbout";
import FlohmaerkteContainer from "./components/FlohmaerkteContainer";
import LaternenBanner from "./components/@Index/laternenumzug/LaternenBanner";

export default function Home() {
  return (
    <main
      id="homepage-main"
      className="w-full flex flex-col items-center gap-4 xs:px-2"
    >
      <LaternenBanner />
      <FlohmaerkteContainer />
      <ShortAbout></ShortAbout>
    </main>
  );
}
