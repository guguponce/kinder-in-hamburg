import { getPostsWithCat } from "@app/api/dbActions";
import { getTypeSpielplaetze } from "@app/api/spActions";
import React from "react";
import BadenGallery from "./BadenGallery";
import Link from "next/link";
import { getWeatherData } from "@app/api/weatherAPI";
import WeatherDisplay from "../../@Weather/WeatherDisplay";
import Banner from "@components/Banner";
import { getBannerContentByMonth } from "./constants";

export default async function SommerInHamburgBanner() {
  const weather = await getWeatherData();
  const badeplaetze = (await getPostsWithCat(["Badeplatz"])) || [];
  const freibaeder = badeplaetze.filter(
    (post) => !post.title.toLocaleLowerCase().includes("see")
  );
  const badeseen = badeplaetze.filter((post) =>
    post.title.toLocaleLowerCase().includes("see")
  );
  const wasserspielplaetze =
    (await getTypeSpielplaetze("wasserspielplatz")) || [];
  const wasserspiele = wasserspielplaetze.filter(
    (sp) => sp.spielgeraete && sp.spielgeraete.includes("wasserspiel")
  );
  const planschbecken = (await getTypeSpielplaetze("planschbecken")) || [];
  const bannerText = getBannerContentByMonth();
  return (
    <section className="relative p-4 rounded-lg bg-gradient-to-br from-hh-500 to-[#759EB8] w-full flex gap-4 flex-col items-center max-w-[420px] sm:max-w-[800px] text-white shadow-xl bg-opacity-10 transition-all overflow-hidden">
      <div
        className="w-96 h-96 absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 opacity-50 rounded-full bg-sun-400 z-0"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, #ffd487 0%, #ffd487 25%, transparent 50%, transparent 100%)",
        }}
      ></div>
      <div className="sm:gap-2 flex flex-col sm:flex-row w-full items-stretch">
        <Banner.TextSide>
          <Banner.Title href={"/sommer-in-hamburg"}>
            {bannerText.title}
          </Banner.Title>
          <Banner.Text>{bannerText.text}</Banner.Text>
          {weather && <WeatherDisplay weather={weather} />}
        </Banner.TextSide>
        <Banner.ImagesSide>
          <BadenGallery
            badeseen={badeseen}
            freibaeder={freibaeder}
            wasserspiele={wasserspiele}
            planschbecken={planschbecken}
          />
        </Banner.ImagesSide>
      </div>

      <Link
        href="/sommer-in-hamburg"
        className="underline underline-offset-2 font-semibold px-4 text-end text-white self-end hover:scale-[1.01] transition-all hover:underline-offset-4"
      >
        Mehr entdecken
      </Link>
    </section>
  );
}
