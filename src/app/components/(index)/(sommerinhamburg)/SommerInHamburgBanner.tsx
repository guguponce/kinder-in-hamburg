import { getApprovedPostWithCat } from "@app/api/dbActions";
import { getTypeSpielplaetze } from "@app/api/spActions";
import React from "react";
import BadenGallery from "./BadenGallery";
import Link from "next/link";
import { getWeatherData } from "@app/api/weatherAPI";
import WeatherDisplay from "./WeatherDisplay";

export default async function SommerInHamburgBanner() {
  const weather = await getWeatherData();
  const badeplaetze = (await getApprovedPostWithCat("Badeplatz")) || [];
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

  return (
    <section className="p-4 rounded-lg bg-gradient-to-b from-hh-600 to-hh-500 w-full flex gap-4 flex-col items-center max-w-[420px] sm:max-w-[800px] text-white shadow-xl bg-opacity-10 transition-all">
      <div className="sm:gap-2 flex flex-col sm:flex-row w-full items-stretch">
        <div className="flex flex-col items-center gap-1 flex-grow">
          <Link
            href={"/sommer-in-hamburg"}
            className="text-3xl md:py-4 sm:py-4 text-center font-bold p-1 sm:mb-none hover:text-hh-50 hover:scale-[1.01] transition-all"
          >
            Sommer in Hamburg
          </Link>
          <p className="italic text-sm px-2">
            Der Sommer ist fast vorbei, aber wir haben noch ein paar
            Empfehlungen für den letzten warmen Wochen!
          </p>
          {weather && <WeatherDisplay weather={weather} />}
        </div>
        <BadenGallery
          badeseen={badeseen}
          freibaeder={freibaeder}
          wasserspiele={wasserspiele}
          planschbecken={planschbecken}
        />
      </div>

      <Link
        href="/sommer-in-hamburg"
        className="underline underline-offset-2 font-semibold px-4 text-end text-white self-end sm:block hidden hover:scale-[1.01] transition-all hover:underline-offset-4"
      >
        Mehr entdecken
      </Link>
    </section>
  );
}
