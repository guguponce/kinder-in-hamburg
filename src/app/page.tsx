import React from "react";
import ShortAbout from "./components/@Homepage/ShortAbout";
import FlohmaerkteContainer from "./components/FlohmaerkteContainer";
import SommerInHamburgBanner from "./components/@Index/sommerinhamburg/SommerInHamburgBanner";

// export const revalidate = 3600;
export default function Home() {
  return (
    <main
      id="homepage-main"
      className="w-full flex flex-col items-center gap-4 xs:px-2"
    >
      {/* <SommerInHamburgBanner /> */}
      <FlohmaerkteContainer />
      <ShortAbout></ShortAbout>
    </main>
  );
}
