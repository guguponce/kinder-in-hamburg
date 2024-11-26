import type { Forecast, overallCondition } from "@app/utils/types";
import React from "react";
import WeatherIcon from "../@Icons/@WeatherIcon/WeatherIcon";
import TodayTomorrow from "../TodayTomorrow";

export default async function WeatherBasedRecommendations({
  currentTemp,
  forecast,
  overallCondition,
  willRainRestOfDay,
  children,
}: {
  children: React.ReactNode;
  willRainRestOfDay: boolean;
  overallCondition: overallCondition;
  currentTemp: number;
  forecast: Forecast;
}) {
  const {
    avgtemp_c: todayTemp,
    condition: { code: todayCode },
  } = forecast.forecastday[0].day;
  const {
    avgtemp_c: tomorrowTemp,
    condition: { code: tomorrowCode },
  } = forecast.forecastday[1].day;

  return (
    <section className="w-fit flex gap-2 md:gap-4  rounded p-4 shadow-md mb-4">
      <div className="flex-grow w-full">{children}</div>
      <aside className="min-w-[250px] flex flex-col gap-2 md:gap-4 justify-center items-center rounded-md py-4 px-2 shadow-sm bg-sky bg-opacity-25">
        {willRainRestOfDay && (
          <code className="text-xs text-hh-700">
            Today it will probably rain
          </code>
        )}
        <div className="flex flex-wrap gap-2 justify-center items-center w-full">
          <WeatherIcon logo={overallCondition} size="100%" />
          <div className="flex flex-col items-center justify-center">
            <h3 className="font-semibold">Now</h3>
            <h2 className="text-lg font-semibold text-hh-600">
              {currentTemp}°C
            </h2>
          </div>
          <TodayTomorrow
            todayTemp={todayTemp}
            todayCode={todayCode}
            tomorrowTemp={tomorrowTemp}
            tomorrowCode={tomorrowCode}
          />
        </div>
        <div className="flex w-full gap-2"></div>
      </aside>
    </section>
  );
}
