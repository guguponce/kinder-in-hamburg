import React from "react";
import WeatherBox from "./components/@Homepage/WeatherBox";
import WeatherIcon from "./components/@Icons/WeatherIcon";
import { overallCondition } from "./utils/types";
export default function Home() {
  return (
    <main id="homepage-main" className="w-full flex flex-col items-center">
      <h1 id="kinder-in-hamburg" className="font-semibold text-white">
        Kinder in Hamburg
      </h1>
      <WeatherBox></WeatherBox>
    </main>
  );
}
