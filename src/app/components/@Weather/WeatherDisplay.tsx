import WIcon from "@components/@Icons/@WeatherIcon/WeatherIcon";
import { WEATHER_CODES } from "@app/utils/constants";
import { whenWillRainLater } from "@app/utils/functions";
import { iWeatherData } from "@app/utils/types";
import React from "react";

const dia = (date: Date) => {
  const d = date.getDay();
  switch (d) {
    case 0:
      return "So.";
    case 1:
      return "Mo.";
    case 2:
      return "Di.";
    case 3:
      return "Mi.";
    case 4:
      return "Do.";
    case 5:
      return "Fr.";
    case 6:
      return "Sa.";
    default:
      return "";
  }
};

export default function WeatherDisplay({
  weather,
  forecast = true,
}: {
  weather: iWeatherData;
  forecast?: boolean;
}) {
  const {
    currentWeather: { WeatherIcon: icon, Temp, IsDayTime },
    forecastHourly,
    nextDays: { dailyForecast },
  } = weather;
  const {
    dayTemp: { min, max },
  } = dailyForecast[0];
  const rain = whenWillRainLater(forecastHourly) === -1 ? false : true;
  const { overallCondition } = WEATHER_CODES[icon];
  const hours = forecastHourly
    .filter((_, i) => !(i % 3))
    .map(({ Hour, WeatherIcon }) => ({ Hour, Temp, WeatherIcon }));
  const days = dailyForecast
    .slice(1, 5)
    .map(({ Date: dayDate, dayTemp: { max, min }, Day: { Icon } }) => ({
      date: new Date(dayDate),
      max,
      min,
      DayIcon: Icon,
    }));
  return (
    <div className="w-full max-w-[400px] p-1 flex flex-col justify-center items-center gap-2 mt-auto self-center min-w-full py-2 rounded-[6px_6px_0_0] sm:rounded bg-hh-100 bg-opacity-25">
      <div
        className={`${
          !forecast && "flex-wrap"
        } flex gap-2 md:gap-4 items-center justify-evenly sm:justify-center w-full font-sans`}
      >
        <div
          id="weather-now"
          className={` ${
            rain ? "h-fit w-fit" : "h-24 aspect-square"
          } flex flex-col justify-center items-center`}
        >
          <WIcon logo={overallCondition} day={IsDayTime} size="3rem" />
          <h3 className="text-xl sm:text-xl font-bold text-white">{Temp}°C</h3>
          {rain && (
            <small className="text-xs text-center opacity-90 w-fit text-hh-950 font-semibold">
              Heute wird es regnen
            </small>
          )}
        </div>
        <div
          id="weather-today"
          className="min-w-[200px] h-fit flex flex-col items-stretch justify-between"
        >
          <div className="flex px-2 py-1 rounded bg-hh-800 bg-opacity-20 items-center justify-center mb-1 text-hh-100">
            <h4 className="mr-4">Heute</h4>
            <h3 className="text-xl font-bold text-white">{Math.round(max)}°</h3>
            <h3 className="text-2xl font-thin">/</h3>
            <h5 className="text-sm font-semibold self-end leading-6 text-white">
              {Math.round(min)}°
            </h5>
          </div>
          <div className="flex gap-2 px-2 py-1 rounded bg-hh-800 bg-opacity-20 items-center justify-around">
            {hours.map(({ Hour, Temp, WeatherIcon }) => (
              <div
                key={Hour}
                className="aspect-[2/3] h-fit flex flex-col items-center justify-center"
              >
                <WIcon
                  logo={WEATHER_CODES[WeatherIcon].overallCondition}
                  day={true}
                  size="1rem"
                />
                <h5 className="text-sm text-white flex flex-col items-center">
                  {Math.round(Temp)}°
                  <span className="text-[8px] sm:text-[10px] leading-none">
                    {Hour + 1}Uhr
                  </span>
                </h5>
              </div>
            ))}
          </div>
        </div>
      </div>
      {forecast && (
        <div className="hidden w-full sm:flex gap-1 px-2 py-1 bg-hh-800 bg-opacity-20 items-center justify-around">
          {days.map(({ date, max, min, DayIcon }) => {
            const d = dia(date);
            const day = date.getDate();
            const month = date.getMonth() + 1;
            return (
              <div
                key={date.getTime()}
                className="flex flex-col items-center justify-center"
              >
                <h5 className="text-xs text-hh-900">
                  <span className="text-sm font-semibold mr-1">{d}</span>
                  {day}.{month}
                </h5>
                <WIcon
                  logo={WEATHER_CODES[DayIcon].overallCondition}
                  day={true}
                  size="1.5rem"
                />
                <h5 className="text-sm text-white font-semibold hidden xl:block">
                  {max.toFixed(0)}°/
                  <span className="text-xs">{min.toFixed(0)}°</span>
                </h5>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
