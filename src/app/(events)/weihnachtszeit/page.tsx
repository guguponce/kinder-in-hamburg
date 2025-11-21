import { getFutureApprovedEventsFromType } from "@app/api/dbActions";
import NotFound from "@components/@NotFound/NotFound";
import React from "react";
import { getTodayNexMonday, separateByDate } from "@app/utils/functions";
import AdminServerComponent from "@app/providers/AdminServerComponents";
import Link from "next/link";
import AddLatLon from "@components/@Buttons/AddLatLon";
import type { iEventType, iFlohmarkt } from "@app/utils/types";
import type { Metadata } from "next";
import Attraktionen from "./Attraktionen";
import AdventsEvents from "./AdventsEvents";
import WeihnachtsmaerkteHero from "./WeihnachtsmaerkteHero";
import WeihMapContainer from "./WeihMapContainer";
import { unstable_cache } from "next/cache";
import Banner from "@components/Banner";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Weihnachtsmärkte",
    icons: "/favicon.ico",
    description:
      "Hier findet ihr eine Zusammenstellung der kinderfreundlichen Weihnachtsmärkte in Hamburg sowie der dazugehörigen Aktivitäten für die Kleinen oder die ganze Familie.",
    keywords: [
      "hamburg mit kinder",
      "hamburg familie weihnachtsmarkt",
      "hamburg kinder weihnachtsmarkt",
      "hamburg weihnachtsmaerkte",
      "hamburg weihnachtsmarkt",
      "hamburg kinder weihnachtsmaerkte",
      "kinder in hamburg",
      "kinder hamburg",
      "weihnachtsmaerkte",
      "weihnachtsmärkte",
      "weihnachtsmarkt",
      "kinder",
      "familie",
      "weihnachtsmaerkte hamburg",
      "weihnachtsmaerkte kinder",
      "weihnachtsmaerkte familie",
      "weihnachtsmaerkte hamburg kinder",
      "weihnachtsmaerkte hamburg familie",
      "weihnachtsmarkt hamburg",
      "weihnachtsmarkt kinder",
      "weihnachtsmarkt familie",
      "weihnachtsmarkt hamburg kinder",
      "weihnachtsmarkt hamburg familie",
      "flea market hamburg",
    ],
    openGraph: {
      title: "Weihnachtsmärkte - Kinder in Hamburg",
      description:
        "Hier findet ihr eine Zusammenstellung der kinderfreundlichen Weihnachtsmärkte in Hamburg sowie der dazugehörigen Aktivitäten für die Kleinen oder die ganze Familie.",
      url: "https://www.kinder-in-hamburg.de",
      images: `${process.env.BASE_URL}opengraph-image.png`,
    },
    twitter: {
      card: "summary_large_image",
      title: "Weihnachtsmärkte - Kinder in Hamburg",

      description:
        "Hier findet ihr eine Zusammenstellung der kinderfreundlichen Weihnachtsmärkte in Hamburg sowie der dazugehörigen Aktivitäten für die Kleinen oder die ganze Familie.",
      images: `${process.env.BASE_URL}opengraph-image.png`,
    },
  };
}

const getWeihnachtsEvents = async (type: iEventType[]) => {
  const events = (await getFutureApprovedEventsFromType(type)) || [];
  const { weihnachtsmaerkte, adventsEvents } = events.reduce(
    (acc, event) => {
      if (event.type?.includes("weihnachtsmarkt")) {
        acc.weihnachtsmaerkte.push(event);
      }
      if (event.type?.includes("adventsevent")) {
        acc.adventsEvents.push(event);
      }
      return acc;
    },
    { weihnachtsmaerkte: [] as iFlohmarkt[], adventsEvents: [] as iFlohmarkt[] }
  );
  return { weihnachtsmaerkte, adventsEvents };
};

const cachedWeihnachtsEvents = unstable_cache(
  getWeihnachtsEvents,
  ["flohmaerkte", "events"],
  {
    revalidate: 600,
  }
);

export default async function WeihnachtszeitPage() {
  const { weihnachtsmaerkte, adventsEvents } = await cachedWeihnachtsEvents([
    "weihnachtsmarkt",
    "adventsevent",
  ]);

  if (!weihnachtsmaerkte) return <NotFound multiples type="event" />;
  const { today } = getTodayNexMonday();
  const orderedEvents = [...weihnachtsmaerkte].sort((a, b) => a.date - b.date);
  const schiffEventsIDS = [1732400443361, 1732318110756, 1732235057521];
  const [schiffEvents, andereEvents] = adventsEvents.reduce(
    (acc, event) => {
      if (schiffEventsIDS.includes(event.id)) {
        acc[0].push(event);
      } else {
        acc[1].push(event);
      }
      return acc;
    },
    [[], []] as [typeof adventsEvents, typeof adventsEvents]
  );
  const adventsEventsByDate = separateByDate(andereEvents, true);

  const todayLaternenumzuege = [...adventsEvents].filter(
    (event) => event.date < today
  );

  const maerkteMitKinderprogramm = weihnachtsmaerkte.filter(
    ({ optionalComment }) =>
      optionalComment && /kinderprogramm/gi.test(optionalComment)
  );
  const maerkteMitCarousell = weihnachtsmaerkte.filter(
    ({ optionalComment }) =>
      optionalComment && /karussell/gi.test(optionalComment)
  );
  const maerkteMitWeihnachtsmann = weihnachtsmaerkte.filter(
    ({ optionalComment }) =>
      optionalComment && /weihnachtsmann/gi.test(optionalComment)
  );
  const maerkteMitNikolaus = weihnachtsmaerkte.filter(
    ({ optionalComment }) =>
      optionalComment && /nikolaus/gi.test(optionalComment)
  );
  const date = new Date();
  if (date.getMonth() < 10 && date.getMonth() > 0) {
    return (
      <Banner childrenClassName="flex flex-col sm:flex-col gap-2 items-center">
        <Banner.Title href="/">
          Huch! Wir sind noch nicht bereit für die Weihnachtszeit!
        </Banner.Title>
        <Banner.Text>
          Komm zurück, zwischen November und Silvester!
          <br />
          Aber keine Angst, auf der Homepage findest du viele weitere spannende
          Inhalte und Aktivitäten für Kinder in Hamburg!
        </Banner.Text>
        <Link
          href="/"
          className="p-2 rounded-md bg-hh-400 hover:bg-hh-300 active:bg-hh-200 font-semibold text-hh-800"
        >
          Homepage
        </Link>
      </Banner>
    );
  }
  if (!weihnachtsmaerkte.length && !adventsEvents.length) {
    return (
      <Banner childrenClassName="flex flex-col sm:flex-col gap-2 items-center">
        <Banner.Title href="/">
          Huch! Wir haben keine Weihnachtsmärkte oder Adventsevents gefunden!
        </Banner.Title>
        <Banner.Text>
          Aber keine Angst, auf der Homepage findest du viele weitere spannende
          Inhalte und Aktivitäten für Kinder in Hamburg!
        </Banner.Text>
        <Link
          href="/"
          className="p-2 rounded-md bg-hh-400 hover:bg-hh-300 active:bg-hh-200 font-semibold text-hh-800"
        >
          Homepage
        </Link>
      </Banner>
    );
  }
  return (
    <main
      className={`flex flex-col gap-4 items-center w-full  ${!!todayLaternenumzuege.length ? "sm:max-w-[1200px]" : "sm:max-w-[1000px]"} p-1 mb-4`}
    >
      <AdminServerComponent>
        <div className="flex flex-col gap-1 outline outline-2 outline-negative-200">
          {[...weihnachtsmaerkte, ...adventsEvents].map((event, i) =>
            event.status !== "approved" || !event.lat || !event.lon ? (
              <Link
                key={event.id}
                href={"/events/" + event.id}
                className="flex gap-2 items-center flex-wrap bg-negative-600 text-negative-50"
              >
                <span className="font-semibold">{event.title}</span>
                {event.status !== "approved" && (
                  <span className="font-semibold">{event.status}</span>
                )}

                {!event.lat || (!event.lon && <AddLatLon item={event} />)}
              </Link>
            ) : null
          )}
        </div>

        <div className="flex flex-col gap-1 outline outline-2 my-4 outline-negative-200">
          <h2 className="text-2xl font-semibold">Märkte mit Nikolaus</h2>
          {maerkteMitWeihnachtsmann.map((event, i) => (
            <Link
              key={event.id}
              href={"/events/" + event.id}
              className="flex gap-2 items-center flex-wrap bg-hh-600 text-negative-50"
            >
              {i + 1} {event.title}
            </Link>
          ))}
        </div>
      </AdminServerComponent>

      <WeihnachtsmaerkteHero
        orderedEvents={orderedEvents}
        todayLaternenumzuege={todayLaternenumzuege}
      />
      <WeihMapContainer
        adventsEvents={adventsEvents}
        weihnachtsmaerkte={weihnachtsmaerkte}
      />
      <Attraktionen
        attraktionen={{
          karussell: maerkteMitCarousell,
          kinderprogramm: maerkteMitKinderprogramm,
          weihnachtsmann: maerkteMitWeihnachtsmann,
          nikolaus: maerkteMitNikolaus,
        }}
      />
      {!!adventsEvents.length && (
        <AdventsEvents
          adventsEventsByDate={adventsEventsByDate}
          schiffEvents={schiffEvents}
        />
      )}
    </main>
  );
}
