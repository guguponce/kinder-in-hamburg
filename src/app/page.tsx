import React from "react";
import WeatherBox from "./components/WeatherBox";
import NextWeekendFlohmaerkte from "./components/@Cards/NextWeekendFlohmaerkte";
import PinnedPosts from "./components/PinnedPosts";
import ShortAbout from "./components/@Homepage/ShortAbout";
import AdminServerComponent from "./providers/AdminServerComponents";
import FlohmaerkteContainer from "./components/FlohmaerkteContainer";

export const revalidate = 3600;
export default function Home() {
  return (
    <main
      id="homepage-main"
      className="w-full flex flex-col items-center gap-4"
    >
      <FlohmaerkteContainer />
      <ShortAbout></ShortAbout>

      <AdminServerComponent>
        <section className="max-w-[1000px] w-full p-2">
          {/* <WeatherBox full={true}></WeatherBox> */}
        </section>
        <NextWeekendFlohmaerkte></NextWeekendFlohmaerkte>

        <PinnedPosts />
        <ShortAbout></ShortAbout>
      </AdminServerComponent>
    </main>
  );
}
