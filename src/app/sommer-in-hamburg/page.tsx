import React from "react";
import { getApprovedPostWithCat } from "@app/api/dbActions";
import { getTypeSpielplaetze } from "@app/api/spActions";
import Badeseen from "./Badeseen";
import Freibaeder from "./Freibaeder";
import Wasserspiele from "./Wasserspiele";
import Planschbecken from "./Planschbecken";
import dynamic from "next/dynamic";
import { getWeatherData } from "@app/api/weatherAPI";
import WeatherDisplay from "@app/components/@Weather/WeatherDisplay";

const WaterMapContainer = dynamic(() => import("./WaterMapContainer"), {
  ssr: false,
});

export default async function SommerInHamburgPage() {
  const badeplaetze = (await getApprovedPostWithCat("Badeplatz")) || [];
  if (!badeplaetze.length) return null;
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
  const weather = await getWeatherData();
  return (
    <main className="max-w-[1000px] w-full mx-auto flex flex-col gap-4 items-center bg-hh-900 bg-opacity-20 p-4 rounded">
      <div className="w-full flex flex-col items-center">
        <h1 className="text-4xl font-bold text-hh-100 p-2 lg:p-4">
          Sommer in Hamburg
        </h1>
        <p className="text-hh-100 p-2 lg:p-4 lg:py-0">
          In den heißen Monaten haben Kinder in Hamburg zahlreiche
          Gelegenheiten, draußen mit Wasser zu spielen. Die Stadt bietet eine
          große Auswahl an Möglichkeiten zur Abkühlung, darunter{" "}
          <span className="font-bold text-white">Planschbecken</span> in
          verschiedenen Parks und{" "}
          <span className="font-bold text-white">Wasserspielen</span> in
          Spielplätzen. Außerdem gibt es in Hamburg viele Badestellen, an denen
          die ganze Familie schwimmen kann. Dazu gehören{" "}
          <span className="font-bold text-white">Badeseen</span>,{" "}
          <span className="font-bold text-white">Freibäder</span> und{" "}
          <span className="font-bold text-white">Schwimmbäder</span>.
        </p>
      </div>
      <WaterMapContainer
        planschbecken={planschbecken}
        freibaeder={freibaeder}
        badeseen={badeseen}
        wasserspiele={wasserspiele}
      >
        {weather && <WeatherDisplay weather={weather} forecast={false} />}
      </WaterMapContainer>
      <Badeseen badeseen={badeseen} />
      <Freibaeder freibaeder={freibaeder} />
      <section className="flex flex-col md:flex-row mx-auto gap-4 justify-between items-center md:items-stretch w-full">
        <article className="w-full md:w-[45%] min-w-[300px] max-w-[400px]">
          <Planschbecken planschbecken={planschbecken} />
        </article>
        <article className="w-full md:w-[45%] min-w-[300px] max-w-[400px]">
          <Wasserspiele wasserspiele={wasserspiele} />
        </article>
      </section>
    </main>
  );
}
