import React from "react";
import { overallCondition } from "@app/utils/types";

const LazySunnyDay = React.lazy(() => import("./SunnyDay"));
const LazyClearNight = React.lazy(() => import("./ClearNight"));
const LazyRainyDay = React.lazy(() => import("./RainyDay"));
const LazyRainyNight = React.lazy(() => import("./RainyNight"));
const LazySnowyDay = React.lazy(() => import("./SnowyDay"));
const LazySnowyNight = React.lazy(() => import("./SnowyNight"));
const LazyCloudy = React.lazy(() => import("./Cloudy"));
const LazyFoggyDay = React.lazy(() => import("./FoggyDay"));
const LazyFoggyNight = React.lazy(() => import("./FoggyNight"));
const LazyStormy = React.lazy(() => import("./Stormy"));
const LazyPartlyCloudyDay = React.lazy(() => import("./PartlyCloudyDay"));
const LazyPartlyCloudyNight = React.lazy(() => import("./PartlyCloudyNight"));

export default function WeatherIcon({
  size = "24px",
  color = "#121212",
  logo,
  day = true,
  lazy = false,
}: {
  lazy?: boolean;
  day?: boolean;
  size?: string;
  color?: string;
  logo: overallCondition;
}) {
  if (lazy) {
    return (
      <React.Suspense fallback={<div>Loading...</div>}>
        <div className="weatherIconBox max-w-[60px] flex justify-center items-center">
          {logo === "Sunny" && day && (
            <LazySunnyDay size={size} color={color} />
          )}
          {logo === "Sunny" && !day && (
            <LazyClearNight size={size} color={color} />
          )}
          {logo === "Rainy" && day && (
            <LazyRainyDay size={size} color={color} />
          )}
          {logo === "Rainy" && !day && (
            <LazyRainyNight size={size} color={color} />
          )}
          {logo === "Snowy" && day && (
            <LazySnowyDay size={size} color={color} />
          )}
          {logo === "Snowy" && !day && (
            <LazySnowyNight size={size} color={color} />
          )}
          {logo === "Cloudy" && <LazyCloudy size={size} color={color} />}
          {logo === "Foggy" && day && (
            <LazyFoggyDay size={size} color={color} />
          )}
          {logo === "Foggy" && !day && (
            <LazyFoggyNight size={size} color={color} />
          )}
          {logo === "Stormy" && <LazyStormy size={size} color={color} />}
          {logo === "Partly cloudy" && day && (
            <LazyPartlyCloudyDay size={size} color={color} />
          )}
          {logo === "Partly cloudy" && !day && (
            <LazyPartlyCloudyNight size={size} color={color} />
          )}
        </div>
      </React.Suspense>
    );
  }
  return (
    <div className="weatherIconBox max-w-[60px] flex justify-center items-center">
      {logo === "Sunny" && day && <LazySunnyDay size={size} color={color} />}
      {logo === "Sunny" && !day && <LazyClearNight size={size} color={color} />}
      {logo === "Rainy" && day && <LazyRainyDay size={size} color={color} />}
      {logo === "Rainy" && !day && <LazyRainyNight size={size} color={color} />}
      {logo === "Snowy" && day && <LazySnowyDay size={size} color={color} />}
      {logo === "Snowy" && !day && <LazySnowyNight size={size} color={color} />}
      {logo === "Cloudy" && <LazyCloudy size={size} color={color} />}
      {logo === "Foggy" && day && <LazyFoggyDay size={size} color={color} />}
      {logo === "Foggy" && !day && <LazyFoggyNight size={size} color={color} />}
      {logo === "Stormy" && <LazyStormy size={size} color={color} />}
      {logo === "Partly cloudy" && day && (
        <LazyPartlyCloudyDay size={size} color={color} />
      )}
      {logo === "Partly cloudy" && !day && (
        <LazyPartlyCloudyNight size={size} color={color} />
      )}
    </div>
  );
}

// https://www.svgrepo.com/collection/weather-forecast-flat-icons/
