import React from "react";
import WeatherIcon from "../@Icons/@WeatherIcon/WeatherIcon";
import { WEATHER_CODES } from "@app/utils/constants";

export default function TodayTomorrow({
  todayTemp,
  todayCode,
  tomorrowTemp,
  tomorrowCode,
}: {
  todayTemp: number;
  todayCode: number;
  tomorrowTemp: number;
  tomorrowCode: number;
}) {
  return (
    <div className="flex justify-center items-center w-full bg-hh-100 bg-opacity-20 p-2 rounded-sm">
      <div className="flex-grow flex flex-col items-center w-1/2">
        <h3 className="font-semibold">Heute</h3>
        <div className="flex flex-col items-center">
          <WeatherIcon
            logo={WEATHER_CODES[todayCode.toString()].overallCondition}
            size="75%"
          />
          <h4 className="font-semibold">{todayTemp}°</h4>
        </div>
      </div>
      <div className="h-full w-1 bg-hh-700 rounded"></div>
      <div className="flex-grow flex flex-col items-center w-1/2">
        <h3 className="font-semibold">Morgen</h3>
        <div className="flex flex-col items-center">
          <WeatherIcon
            logo={WEATHER_CODES[tomorrowCode.toString()].overallCondition}
            size="75%"
          />
          <h4 className="font-semibold">{tomorrowTemp}°</h4>
        </div>
      </div>
    </div>
  );
}
