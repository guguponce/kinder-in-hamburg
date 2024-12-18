import { getFutureApprovedEventsFromType } from "@app/api/dbActions";
import NotFound from "@components/@NotFound/NotFound";
import React from "react";
import { getTodayNexMonday, separateByDate } from "@app/utils/functions";
import dynamic from "next/dynamic";
import AdminServerComponent from "@app/providers/AdminServerComponents";
import Link from "next/link";
import AddLatLon from "@app/components/@Buttons/AddLatLon";
import { iFlohmarkt } from "@app/utils/types";
import { Metadata } from "next";
import Attraktionen from "./Attraktionen";
import AdventsEvents from "./AdventsEvents";
import WeihnachtsmaerkteHero from "./WeihnachtsmaerkteHero";
import WeihMapContainer from "./WeihMapContainer";

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

export default async function WeihnachtszeitPage() {
  const weihnachtsmaerkte =
    await getFutureApprovedEventsFromType("weihnachtsmarkt");
  const adventsEvents: iFlohmarkt[] =
    (await getFutureApprovedEventsFromType("adventsevent")) || [];
  if (!weihnachtsmaerkte) return <NotFound multiples type="event" />;
  if (!weihnachtsmaerkte.length) return;
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
