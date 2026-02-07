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
import { createClient } from "@auth/server";

export const utcTime = () => {
  const date = new Date();
  date.setMinutes(0, 0, 0);
  return date.getTime() + date.getTimezoneOffset() * 60000;
};

export const getHamburgsWeather = async () => {
  const response = await fetch(
    `https://api.weatherapi.com/v1/forecast.json?key=${process.env.WEATHER_API}&q=53.5511,9.9937&days=3&aqi=no&alerts=no`,
    { next: { tags: ["weather"], revalidate: 600 } },
  );
  const data = await response.json();
  return data as WeatherAPI;
};

const supabaseAdmin = createClient();

export const setFirstRow = async () => {
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

const deleteRowsBefore2DaysAgo = async () => {
  const oneDayAgo = (await utcTime()) - 24 * 60 * 60 * 1000;
  try {
    const { data } = await supabaseAdmin
      .from("weather")
      .select("id,lastForecast")
      .order("lastForecast", { ascending: false });

    const idsToDelete =
      data?.map((d) => d.lastForecast).filter((id) => id < oneDayAgo) || [];
    if (!data?.length) return true;

    const { error: deleteError } = await supabaseAdmin
      .from("weather")
      .delete()
      .in("lastForecast", idsToDelete);
    if (deleteError) {
      console.log("Error deleting old weather rows:", deleteError);
      return false;
    }
  } catch (error) {
    console.log("Error fetching old weather rows for deletion:", error);
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
    if (!data?.length || error) {
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
      console.log("Error inserting new weather row:", error.message);
      return false;
    }

    await deleteRowsBefore2DaysAgo();
    return true;
  } catch (error) {
    console.log("Error inserting new weather row:", error);

    return false;
  }
};

export const getCurrentAccuWeather = async () => {
  try {
    const response = await fetch(
      `http://dataservice.accuweather.com/currentconditions/v1/178556?apikey=${process.env.ACCUWEATHER_API}`,
      { next: { tags: ["weather"], revalidate: 3000 } },
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
      { next: { tags: ["weather"], revalidate: 10 } },
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
        }) as iForecastHourly,
    );
    return forecastHourly;
  } catch (error) {
    console.error("error", error);
    return false;
  }
};

export const getDailyForecastAccuWeather = async () => {
  try {
    const response = await fetch(
      `http://dataservice.accuweather.com/forecasts/v1/daily/5day/178556?apikey=${process.env.ACCUWEATHER_API}&language=de-de&metric=true`,
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
      }),
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
  const fourHoursSinceLastForecast =
    !lastHourData || currentHour - lastHourData.lastForecast > 3600000 * 4;

  if (fourHoursSinceLastForecast) {
    const currentWeather = await getCurrentAccuWeather();
    const forecastHourly = await getHourlyForecastAccuWeather();
    const nextDays = await getDailyForecastAccuWeather();
    const lastForecast = currentHour;

    if (!currentWeather || !forecastHourly || !nextDays || !lastForecast) {
      if (!!lastHourData) return lastHourData;
      return false;
    }
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
