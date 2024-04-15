import React from "react";
import WeatherBox from "./components/@Homepage/WeatherBox";
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
      <h1 id="kinder-in-hamburg" className="font-semibold text-white">
        Kinder in Hamburg
      </h1>
      <WeatherBox full={true}></WeatherBox>
      <NextWeekendFlohmaerkte></NextWeekendFlohmaerkte>

      <PinnedPosts />
    </main>
  );
}
