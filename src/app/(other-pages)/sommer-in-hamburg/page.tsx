import React from "react";
import { getPostsWithCat } from "@app/api/dbActions";
import { getTypeSpielplaetze } from "@app/api/spActions";
import Badeseen from "./Badeseen";
import Freibaeder from "./Freibaeder";
import Wasserspiele from "./Wasserspiele";
import Planschbecken from "./Planschbecken";
import dynamic from "next/dynamic";
import { getWeatherData } from "@app/api/weatherAPI";
import WeatherDisplay from "@components/@Weather/WeatherDisplay";
import PageTitle from "@app/components/PageTitle";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Sommer in Hamburg",
    icons: "/favicon.ico",
    description:
      "Entdecke die besten Orte in Hamburg zum Schwimmen und Abkühlen für Kinder und Familien: Planschbecken, Badeseen, Freibäder, Schwimmbäder und Wasserspielplätze.",
    keywords: [
      "sommer hamburg",
      "schwimmen hamburg",
      "abkühlung hamburg",
      "planschbecken hamburg",
      "badesee hamburg",
      "freibad hamburg",
      "schwimmbad hamburg",
      "wasserspielplatz hamburg",
      "kinder hamburg wasser",
      "familie hamburg sommer",
      "wasserspaß hamburg",
      "kinder abkühlung hamburg",
      "hamburg mit kindern",
      "hamburg familie",
      "hamburg schwimmen",
      "hamburg wasser",
      "hamburg planschbecken",
      "hamburg badeseen",
      "hamburg freibäder",
      "hamburg wasserspielplätze",
      "kinder sommer hamburg",
      "freizeit hamburg kinder",
      "freizeit hamburg familie",
      "ausflug hamburg sommer",
      "ausflug hamburg kinder",
      "ausflug hamburg familie",
    ],
    openGraph: {
      type: "website",
      url: "https://www.kinder-in-hamburg.de/sommer-in-hamburg/",
      title: "Sommer in Hamburg",
      description:
        "Finde Planschbecken, Badeseen, Freibäder, Schwimmbäder und Wasserspielplätze für Kinder und Familien in Hamburg.",
      images: process.env.BASE_URL + "opengraph-image.png",
      siteName: "Kinder in Hamburg",
    },
    twitter: {
      title: "Sommer in Hamburg",
      description:
        "Finde Planschbecken, Badeseen, Freibäder, Schwimmbäder und Wasserspielplätze für Kinder und Familien in Hamburg.",
      images: process.env.BASE_URL + "opengraph-image.png",
      site: "https://www.kinder-in-hamburg.de/sommer-in-hamburg/",
      card: "summary_large_image",
    },
  };
}

const WaterMapContainer = dynamic(() => import("./WaterMapContainer"), {
  ssr: false,
});

export default async function SommerInHamburgPage() {
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
  if ([...badeplaetze, ...wasserspielplaetze, ...planschbecken].length === 0)
    return null;
  const weather = await getWeatherData();

  return (
    <main className="relative max-w-[1000px] w-full mx-auto flex flex-col gap-4 items-center  bg-gradient-to-br from-hh-500 to-[#759EB8] p-4 rounded overflow-hidden">
      <div
        className="w-96 h-96 absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 opacity-50 rounded-full bg-sun-400 z-0"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, #ffd487 0%, #ffd487 25%, transparent 50%, transparent 100%)",
        }}
      ></div>
      <div className="w-full flex flex-col items-center">
        <PageTitle
          className="text-4xl font-bold text-hh-100 p-2 lg:p-4"
          title="Sommer in Hamburg"
        ></PageTitle>
        <p className="text-hh-50 p-2 lg:p-4 lg:py-0">
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
      {!!badeseen.length && <Badeseen badeseen={badeseen} />}
      {!!freibaeder.length && <Freibaeder freibaeder={freibaeder} />}
      <section className="flex flex-col md:flex-row mx-auto gap-4 justify-between items-center md:items-stretch w-full">
        <article className="w-full md:w-[45%] min-w-[300px] max-w-[400px]">
          {!!planschbecken.length && (
            <Planschbecken planschbecken={planschbecken} />
          )}
        </article>
        <article className="w-full md:w-[45%] min-w-[300px] max-w-[400px]">
          {!!wasserspiele.length && (
            <Wasserspiele wasserspiele={wasserspiele} />
          )}
        </article>
      </section>
    </main>
  );
}
