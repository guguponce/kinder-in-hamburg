import React from "react";
import WeatherBox from "./components/WeatherBox";
import NextWeekendFlohmaerkte from "./components/@Cards/NextWeekendFlohmaerkte";
import PinnedPosts from "./components/PinnedPosts";
import ShortAbout from "./components/@Homepage/ShortAbout";

export const revalidate = 3600;
export default function Home() {
  return (
    <main
      id="homepage-main"
      className="w-full flex flex-col items-center gap-4"
    >
      <section className="max-w-[1000px] w-full p-2">
        <WeatherBox full={true}></WeatherBox>
      </section>
      <NextWeekendFlohmaerkte></NextWeekendFlohmaerkte>

      <PinnedPosts />
      <ShortAbout></ShortAbout>
    </main>
  );
}
