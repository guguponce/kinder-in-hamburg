"use server";

import { WeatherAPI } from "@app/utils/types";
import { revalidateTag } from "next/cache";

export const getHamburgsWeather = async () => {
  revalidateTag("weather");
  const response = await fetch(
    `https://api.weatherapi.com/v1/forecast.json?key=${process.env.WEATHER_API}&q=53.5511,9.9937&days=3&aqi=no&alerts=no`,
    { next: { tags: ["weather"] } }
  );
  const data = await response.json();
  return data as WeatherAPI;
};
