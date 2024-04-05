import { getSuggestionsWithCat } from "@app/api/dbActions";
import { getHamburgsWeather } from "@app/api/weatherAPI";
import { WEATHER_CODES } from "@app/utils/constants";
import React from "react";
import StackedCards from "../@Cards/StackedCards";
import { parsePost } from "@app/utils/functions";
import WeatherIcon from "../@Icons/WeatherIcon";
import Link from "next/link";

export default async function WeatherBox() {
  const { current, forecast, location } = await getHamburgsWeather();
  const { activity, overallCondition } =
    WEATHER_CODES[current.condition.code.toString()];

  const time = location.localtime.match(/\d+:\d+/)![0];
  // .replace(":", " Uhr");
  const willRainRestOfDay = forecast.forecastday[1].hour
    .slice(parseInt(time.split(":")[0].replace(":", "")), 24)
    .some((h) => h.will_it_rain === 1);

  const activityType = willRainRestOfDay
    ? "Indoor"
    : activity === "Both"
    ? ["Indoor", "Outdoor"][Math.floor(Math.random() * 2)]
    : activity;
  const suggestions = (await getSuggestionsWithCat(activityType))
    .filter((s) => !!s.image)
    .sort(() => 0.5 - Math.random())
    .map((s) => parsePost(s));
  const link = `/categories/${activityType}`;
  return (
    <aside
      className={`${
        willRainRestOfDay
          ? "bg-hh-700 bg-opacity-25 text-hh-100"
          : "bg-sky text-hh-700"
      } p-4 max-w-[200px] w-1/4 flex flex-col items-center rounded  `}
    >
      {willRainRestOfDay && <small className="text-xs">Today will rain</small>}
      <WeatherIcon logo={overallCondition} size="100%" color="#141A1F" />
      <div className="flex flex-col items-center">
        <h2 className="text-lg font-semibold ">
          {current.temp_c}°C
          {time && <span className="ml-1 text-xs">({time})</span>}
          <span className="text-xs"></span>
        </h2>
      </div>
      <article className="w-full">
        <StackedCards
          aspectRatio={0.66}
          size="small"
          link={link}
          posts={suggestions.slice(0, 3)}
          onlyTitle={true}
        />
      </article>
      <Link
        href={link}
        className="px-2 py-1 font-semibold capitalize rounded-sm text-white bg-hh-400 hover:bg-hh-500 active:bg-hh-300 break-words w-fit mt-2 text-center"
      >
        Find {activityType} activities
      </Link>
    </aside>
  );
}
