import { getFutureApprovedEventsFromType } from "@app/api/dbActions";
import NotFound from "@components/@NotFound/NotFound";
import React from "react";
import { getTodayNexMonday, separateByDate } from "@app/utils/functions";
import AdminServerComponent from "@app/providers/AdminServerComponents";
import Link from "next/link";
import AddLatLon from "@app/components/@Buttons/AddLatLon";
import { iFlohmarkt } from "@app/utils/types";
import { Metadata } from "next";
import Attraktionen from "./Attraktionen";
import AdventsEvents from "./AdventsEvents";
import WeihnachtsmaerkteHero from "./WeihnachtsmaerkteHero";
import WeihMapContainer from "./WeihMapContainer";
import { unstable_cache } from "next/cache";
import Banner from "@app/components/Banner";

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
const cachedWeihnachtsmaerkte = unstable_cache(
  getFutureApprovedEventsFromType,
  ["flohmaerkte", "events"],
  {
    revalidate: 600,
  }
);

const cachedFutureApprovedEventsFromType = unstable_cache(
  getFutureApprovedEventsFromType,
  ["flohmaerkte", "events"],
  {
    revalidate: 600,
  }
);

export default async function WeihnachtszeitPage() {
  const weihnachtsmaerkte = await cachedWeihnachtsmaerkte("weihnachtsmarkt");
  const adventsEvents: iFlohmarkt[] =
    (await cachedFutureApprovedEventsFromType("adventsevent")) || [];
  if (!weihnachtsmaerkte) return <NotFound multiples type="event" />;
  const { today } = getTodayNexMonday();

  const orderedEvents = [...weihnachtsmaerkte, ...adventsEvents].sort(
    (a, b) => a.date - b.date
  );
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
  const date = new Date();
  //if not from 1st november and 15th of january
  if (date.getMonth() !== 10 && date.getMonth() !== 0) {
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
      className={`flex flex-col gap-4 items-center w-full  ${!!todayLaternenumzuege.length ? "sm:max-w-[1000px]" : "sm:max-w-[800px]"} p-1 mb-4`}
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
      <WeihMapContainer
        adventsEvents={adventsEvents}
        weihnachtsmaerkte={weihnachtsmaerkte}
      />
      <WeihnachtsmaerkteHero
        orderedEvents={orderedEvents}
        todayLaternenumzuege={todayLaternenumzuege}
      />
      <Attraktionen
        attraktionen={{
          karussell: maerkteMitCarousell,
          kinderprogramm: maerkteMitKinderprogramm,
          weihnachtsmann: maerkteMitWeihnachtsmann,
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
