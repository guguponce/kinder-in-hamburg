"use server";

import {
  iCurrentWeather,
  iForecastDaily,
  iForecastHourly,
  WeatherAPI,
  iCurrentAccu,
  iHourlyAccu,
  iDailyAccuWeather,
  iWeatherData,
} from "@app/utils/types";
import { createClient } from "@supabase/supabase-js";

export const createFetch =
  (options: Pick<RequestInit, "next" | "cache">) =>
  (url: RequestInfo | URL, init?: RequestInit) => {
    return fetch(url, {
      ...init,
      ...options,
    });
  };

export const utcTime = () => {
  const date = new Date();
  date.setMinutes(0, 0, 0);
  return date.getTime() + date.getTimezoneOffset() * 60000;
};

export const getHamburgsWeather = async () => {
  const response = await fetch(
    `https://api.weatherapi.com/v1/forecast.json?key=${process.env.WEATHER_API}&q=53.5511,9.9937&days=3&aqi=no&alerts=no`,
    { next: { tags: ["weather"], revalidate: 600 } }
  );
  const data = await response.json();
  return data as WeatherAPI;
};

const supabaseAdmin = createClient(
  process.env.SUPABASE_URL ?? "",
  process.env.SUPABASE_ANON_KEY ?? ""
);

export const setFirstRow = async () => {
  console.log("setting first row");
  const currentWeather = await getCurrentAccuWeather();
  const forecastHourly = await getHourlyForecastAccuWeather();
  const nextDays = await getDailyForecastAccuWeather();
  const lastForecast = await utcTime();
  if (!currentWeather || !forecastHourly || !nextDays || !lastForecast)
    return false;
  const data = {
    id: lastForecast,
    currentWeather,
    forecastHourly,
    lastForecast,
    nextDays,
  };
  setNewWeatherRow(data);
  return data;
};
export const getAllWeatherRows = async () => {
  try {
    const { data, error } = await supabaseAdmin.from("weather").select("*");
    if (error) {
      return false;
    }
    return data as {
      id: number;
      currentWeather: iCurrentWeather;
      forecastHourly: iForecastHourly[];
      lastForecast: number;
      nextDays: iForecastDaily;
    }[];
  } catch (error) {
    return false;
  }
};
export const getLastHourData = async () => {
  try {
    const { data, error } = await supabaseAdmin
      .from("weather")
      .select("*")
      .order("id", { ascending: false })
      .limit(1);

    if (error) {
      setFirstRow();
      return false;
    }
    return data[0] as {
      id: number;
      currentWeather: iCurrentWeather;
      forecastHourly: iForecastHourly[];
      lastForecast: number;
      nextDays: iForecastDaily;
    };
  } catch (error) {
    return false;
  }
};

export const setNewWeatherRow = async ({
  id,
  currentWeather,
  forecastHourly,
  lastForecast,
  nextDays,
}: {
  id: number;
  currentWeather: iCurrentWeather;
  forecastHourly: iForecastHourly[];
  lastForecast: number;
  nextDays: iForecastDaily;
}) => {
  const fullRow = {
    id,
    currentWeather,
    forecastHourly,
    lastForecast,
    nextDays,
  };
  try {
    const { error } = await supabaseAdmin.from("weather").insert([fullRow]);
    if (error) {
      return false;
    }
    return true;
  } catch (error) {
    return false;
  }
};

export const getCurrentAccuWeather = async () => {
  try {
    const response = await fetch(
      `http://dataservice.accuweather.com/currentconditions/v1/178556?apikey=${process.env.ACCUWEATHER_API}`,
      { next: { tags: ["weather"], revalidate: 3000 } }
    );
    const data = (await response.json())[0] as iCurrentAccu;
    const {
      WeatherText,
      Temperature: {
        Metric: { Value: Temp },
      },
      WeatherIcon,
      HasPrecipitation,
      PrecipitationType,
      IsDayTime,
    } = data;
    return {
      WeatherText,
      Temp,
      WeatherIcon,
      HasPrecipitation,
      PrecipitationType,
      IsDayTime,
    };
  } catch (error) {
    return false;
  }
};

export const getHourlyForecastAccuWeather = async () => {
  try {
    const response = await fetch(
      `http://dataservice.accuweather.com/forecasts/v1/hourly/12hour/178556?apikey=${process.env.ACCUWEATHER_API}&language=de-de&metric=true`,
      { next: { tags: ["weather"], revalidate: 10 } }
    );
    const data = (await response.json()) as iHourlyAccu[];
    const forecastHourly = data.map(
      ({
        DateTime,
        WeatherIcon,
        IconPhrase: WeatherText,
        Temperature: { Value: Temp },
        HasPrecipitation,
        PrecipitationProbability,
        PrecipitationType,
        PrecipitationIntensity,
        IsDaylight,
      }) =>
        ({
          Hour: new Date(DateTime).getHours(),
          WeatherText,
          Temp,
          WeatherIcon,
          HasPrecipitation,
          PrecipitationType,
          PrecipitationIntensity,
          PrecipitationProbability,
          IsDaylight,
        } as iForecastHourly)
    );
    return forecastHourly;
  } catch (error) {
    console.log("error", error);
    return false;
  }
};

export const getDailyForecastAccuWeather = async () => {
  try {
    const response = await fetch(
      `http://dataservice.accuweather.com/forecasts/v1/daily/5day/178556?apikey=${process.env.ACCUWEATHER_API}&language=de-de&metric=true`
      // { next: { tags: ["weather"], revalidate: 14000 } }
    );
    const data = (await response.json()) as iDailyAccuWeather;
    const {
      Headline: { Text: todayDescription },
    } = data;
    const dailyForecast = data.DailyForecasts.map(
      ({
        Date,
        Temperature: {
          Minimum: { Value: min },
          Maximum: { Value: max },
        },
        Day,
        Night,
      }) => ({
        Date,
        dayTemp: {
          min,
          max,
        },
        Day,
        Night,
      })
    );
    const dailyWeather = {
      todayDescription,
      dailyForecast,
    } as iForecastDaily;
    return dailyWeather;
  } catch (error) {
    return false;
  }
};

export const getWeatherData = async () => {
  const lastHourData = await getLastHourData();
  const currentHour = await utcTime();
  if (lastHourData === false) {
    return false;
  }
  const fourHoursSinceLastForecast =
    currentHour - lastHourData.lastForecast > 3600000 * 4;

  if (lastHourData.id < currentHour || fourHoursSinceLastForecast) {
    const currentWeather =
      lastHourData.id < currentHour
        ? (await getCurrentAccuWeather()) || lastHourData.currentWeather
        : lastHourData.currentWeather;
    const forecastHourly = fourHoursSinceLastForecast
      ? (await getHourlyForecastAccuWeather()) || lastHourData.forecastHourly
      : lastHourData.forecastHourly;
    const nextDays = fourHoursSinceLastForecast
      ? (await getDailyForecastAccuWeather()) || lastHourData.nextDays
      : lastHourData.nextDays;

    const lastForecast = fourHoursSinceLastForecast
      ? currentHour
      : lastHourData.lastForecast;

    setNewWeatherRow({
      id: currentHour,
      currentWeather,
      forecastHourly,
      lastForecast,
      nextDays,
    });
    return {
      id: currentHour,
      currentWeather,
      forecastHourly,
      lastForecast,
      nextDays,
    } as iWeatherData;
  } else {
    return lastHourData;
  }
};
