import {
  getApprovedPostWithCat,
  getSuggestionsWithCatAndBezirk,
} from "@app/api/dbActions";
import { getHamburgsWeather } from "@app/api/weatherAPI";
import { WEATHER_CODES, bezirke } from "@app/utils/constants";
import React from "react";
import { getPlainText, getTimeRainAndActivity } from "@app/utils/functions";
import WeatherIcon from "./@Icons/@WeatherIcon/WeatherIcon";
import Link from "next/link";
import ImageCard from "./@Cards/ImageCard";
import TodayTomorrow from "./TodayTomorrow";
import FullImageWeatherBox from "./FullImageWeatherBox";
import { categoryName, iBezirk } from "@app/utils/types";

export default async function WeatherBox({
  full,
  bezirk,
  weatherAtRight,
}: {
  weatherAtRight?: boolean;
  full?: boolean;
  bezirk?: iBezirk;
}) {
  const { current, forecast, location } = await getHamburgsWeather();
  const { activity, overallCondition } =
    WEATHER_CODES[current.condition.code.toString()];
  const { currentTime, nextRain, activityType, sunsetIndex } =
    getTimeRainAndActivity(
      forecast.forecastday[0].hour,
      activity,
      forecast.forecastday[0].astro.sunset
    );
  // -------------------
  // change to getApprovedSuggestions
  const retrievedSuggestions = bezirk
    ? // --------------------
      await getSuggestionsWithCatAndBezirk(
        activityType as categoryName,
        bezirk
      ).then((res) => {
        if (res && res.length > 0) return res;
        return getSuggestionsWithCatAndBezirk(
          activityType === "Indoor" ? "Outdoor" : "Indoor",
          bezirk
        );
      })
    : await getApprovedPostWithCat(activityType).then((res) => {
        if (res && res.length > 0) return res;
        return getApprovedPostWithCat(
          activityType === "Indoor" ? "Outdoor" : "Indoor"
        );
      });
  if (!retrievedSuggestions)
    return <div>There was a problem retrieving suggestions</div>;

  const suggestion = retrievedSuggestions
    .filter((s) => !!s.image)
    .sort(() => 0.5 - Math.random())[0];
  const link = `/categories/${activityType}`;
  const {
    avgtemp_c: todayTemp,
    condition: { code: todayCode },
  } = forecast.forecastday[0].day;
  const {
    avgtemp_c: tomorrowTemp,
    condition: { code: tomorrowCode },
  } = forecast.forecastday[1].day;

  if ((!current || !forecast || !location) && !suggestion) return <></>;
  return (
    <>
      {full ? (
        <FullImageWeatherBox
          imgURL={suggestion.image![0] || ""}
          title={suggestion.title}
          text={getPlainText(suggestion.text, 100)}
          id={suggestion.id}
          weatherAtRight={weatherAtRight}
        >
          <article className="weatherSection flex flex-col items-center md:gap-4 gap-2 w-[100px] md:min-w-[250px] md:min-h-full p-2 md:p-4 md:aspect-[0.66] rounded bg-black backdrop-blur-sm bg-opacity-20  justify-center text-white">
            <div className="md:aspect-square flex-grow  flex justify-center items-center flex-col">
              <WeatherIcon
                day={!!current.is_day}
                logo={overallCondition}
                size="100%"
                color="#141A1F"
              />
              <div className="flex flex-col items-center">
                <h2 className="text-lg font-semibold ">
                  {current.temp_c}°C
                  <span className="ml-1 text-xs">
                    (
                    {currentTime.toLocaleTimeString("de-DE", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                    )
                  </span>
                </h2>
                {nextRain !== -1 && (
                  <small className="text-xs italic">
                    It will probably rain today
                  </small>
                )}
              </div>
            </div>
            {full && (
              <div className="hidden md:flex md:w-full">
                <TodayTomorrow
                  todayTemp={todayTemp}
                  todayCode={todayCode}
                  tomorrowTemp={tomorrowTemp}
                  tomorrowCode={tomorrowCode}
                />
              </div>
            )}
            <Link
              href={link}
              className="px-2 py-1 font-semibold capitalize rounded-sm text-white bg-hh-400 hover:bg-hh-500 active:bg-hh-300 break-words w-fit text-center text-sm"
            >
              <span className="hidden md:inline">Find more</span>{" "}
              {suggestion.categories.includes(activityType) ? activityType : ""}{" "}
              activities
            </Link>
          </article>
        </FullImageWeatherBox>
      ) : (
        <aside
          className={`${
            nextRain !== -1
              ? "bg-hh-700 bg-opacity-25 text-hh-100"
              : "bg-gradient-to-b from-sky to-[hsl(197,27%,80%)]"
          } weatherSection flex flex-col items-center md:gap-2 gap-1 min-w-[250px] p-4 md:aspect-[0.66] rounded  justify-center h-full text-white`}
        >
          <WeatherIcon logo={overallCondition} size="100%" color="#141A1F" />
          <div className="flex flex-col items-center">
            <h2 className="text-lg font-semibold ">
              {current.temp_c}°C
              <span className="ml-1 text-xs">
                (
                {currentTime.toLocaleTimeString("de-DE", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
                )
              </span>
            </h2>
            {nextRain !== -1 && (
              <small className="text-xs italic">
                It will probably rain later today
              </small>
            )}
          </div>
          {!!suggestion && (
            <article className="w-full flex justify-center">
              <ImageCard
                id={suggestion.id}
                aspectRatio={0.66}
                size="medium"
                title={suggestion.title}
                image={suggestion.image![0]}
                link={`/posts/${suggestion.id}`}
              />
            </article>
          )}
          <Link
            href={link}
            className="px-2 py-1 font-semibold capitalize rounded-sm text-white bg-[hsl(31,76%,51%)] hover:bg-[hsl(31,76%,46%)] active:bg-[hsl(31,76%,56%)] break-words w-fit mt-2 text-center"
          >
            Find more {activityType} activities
          </Link>
        </aside>
      )}
    </>
  );
}
