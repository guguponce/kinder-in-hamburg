import React from "react";
import WeatherBox from "./components/WeatherBox";
import NextWeekendFlohmaerkte from "./components/@Cards/NextWeekendFlohmaerkte";
import PinnedPosts from "./components/PinnedPosts";
import WeatherIcon from "./components/@Icons/WeatherIcon";

export const revalidate = 3600;
export default function Home() {
  return (
    <main
      id="homepage-main"
      className="w-full flex flex-col items-center gap-4"
    >
      <section className="max-w-[1000px] w-full">
        <WeatherBox full={true}></WeatherBox>
      </section>
      <NextWeekendFlohmaerkte></NextWeekendFlohmaerkte>

      <PinnedPosts />
    </main>
  );
}
