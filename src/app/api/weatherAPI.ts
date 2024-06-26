"use server";

import { WeatherAPI } from "@app/utils/types";

export const getHamburgsWeather = async () => {
  // revalidateTag("weather");
  const response = await fetch(
    `https://api.weatherapi.com/v1/forecast.json?key=${process.env.WEATHER_API}&q=53.5511,9.9937&days=3&aqi=no&alerts=no`,
    { next: { tags: ["weather"], revalidate: 300 } }
  );
  const data = await response.json();
  return data as WeatherAPI;
};
