import React from "react";
import ShortAbout from "@components/@Index/ShortAbout";
import FlohmaerkteContainer from "./components/@Index/FlohmaerkteContainer";
import Banner from "./components/Banner";

export default function Home() {
  return (
    <main
      id="homepage-main"
      className="w-full flex flex-col items-center gap-4 xs:px-2"
    >
      <Banner className="max-w-[600px]">
        <Banner.Image
          alt="Wir sind am Werk"
          src="/assets/logo/workinprogress.png"
          className="invert max-h-[50vh]"
          imgClassname="aspect-[3/4] w-auto mx-auto"
        ></Banner.Image>
        <Banner.TextSide>
          <Banner.Title>Bald geht&apos;s weiter</Banner.Title>
          <Banner.Text className="not-italic text-base md:text-lg px-2">
            Wir renovieren noch ein bisschen, aber bald ist alles wieder frisch
            und besser! Schau in den nächsten Wochen wieder vorbei, es gibt
            Neues zu entdecken!
          </Banner.Text>
        </Banner.TextSide>
      </Banner>
      <FlohmaerkteContainer />
      <ShortAbout></ShortAbout>
    </main>
  );
}
