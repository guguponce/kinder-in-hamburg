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
      {/* <section className="max-w-[800px]">
        <WeatherBox full />
      </section> */}
      <SommerInHamburgBanner />
      <FlohmaerkteContainer />
      <ShortAbout></ShortAbout>
    </main>
  );
}

/*
<AdminServerComponent>
        <section className="max-w-[1000px] w-full p-2">
          {/* <WeatherBox full={true}></WeatherBox> 
        </section>
        <NextWeekendFlohmaerkte></NextWeekendFlohmaerkte>

        <PinnedPosts />
        <ShortAbout></ShortAbout>
      </AdminServerComponent>
*/
