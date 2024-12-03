import { getFutureApprovedEventsFromType } from "@app/api/dbActions";
import NotFound from "@components/@NotFound/NotFound";
import BezirkableEventsList from "@components/BezirkableEventsList";
import React from "react";
import {
  addressWithoutCity,
  getDate,
  getTodayNexMonday,
  separateByDate,
} from "@app/utils/functions";
import dynamic from "next/dynamic";
import AdminServerComponent from "@app/providers/AdminServerComponents";
import Link from "next/link";
import AddLatLon from "@app/components/@Buttons/AddLatLon";
import ClientLaterneGallery from "@app/components/@Index/laternenumzug/ClientEventsGallery";
import HorizontalCard from "@app/components/@Cards/HorizontalCard";
import ScrollableContainer from "@app/components/ScrollableContainer";
import { iFlohmarkt } from "@app/utils/types";
import FlohmarktPoster from "@app/components/@Cards/FlohmarktPoster";
import { Metadata } from "next";
import Attraktionen from "./Attraktionen";
import AdventsEvents from "./AdventsEvents";

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

const WeihnachtsmaerkteMap = dynamic(() => import("./WeihnachtsmaerkteMap"), {
  ssr: false,
  loading: () => (
    <article className="w-full max-w-[800px] aspect-square sm:aspect-video max-h-[60vh]">
      <img
        src="/assets/bezirke/hamburg.webp"
        alt="Hamburg"
        className="w-full h-full object-cover"
      />
    </article>
  ),
});
export default async function WeihnachtszeitPage() {
  const weihnachtsmaerkte =
    await getFutureApprovedEventsFromType("weihnachtsmarkt");
  const adventsEvents: iFlohmarkt[] =
    (await getFutureApprovedEventsFromType("adventsevent")) || [];
  if (!weihnachtsmaerkte) return <NotFound multiples type="event" />;
  if (!weihnachtsmaerkte.length) return;
  const { today } = getTodayNexMonday();
  const lastMidnight = new Date(today).setHours(0, 0, 0, 0);

  const orderedEvents = [...weihnachtsmaerkte].sort((a, b) => a.date - b.date);
  const [futureEvents, thisWeekEvents] = orderedEvents.reduce(
    (acc, event) => {
      if (event.date < today) {
        acc[1].push(event);
      } else {
        acc[0].push(event);
      }
      return acc;
    },
    [[], []] as [typeof weihnachtsmaerkte, typeof weihnachtsmaerkte]
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
  const maerkteMitNikolaus = weihnachtsmaerkte.filter(
    ({ optionalComment }) =>
      optionalComment && /nikolaus/gi.test(optionalComment)
  );
  const maerkteMitWeihnachtsmann = weihnachtsmaerkte.filter(
    ({ optionalComment }) =>
      optionalComment && /weihnachtsmann/gi.test(optionalComment)
  );
  const nikolausEvents = weihnachtsmaerkte.filter(({ title }) =>
    /nikolaus/gi.test(title)
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
        <div className="flex flex-col gap-1 outline outline-2 outline-negative-200">
          <h2 className="text-2xl font-semibold">Nikolaus events</h2>
          {nikolausEvents.map((event, i) => (
            <Link
              key={event.id}
              href={"/events/" + event.id}
              className="flex gap-2 items-center flex-wrap bg-negative-600 text-negative-50"
            >
              {i + 1}
              {event.title}
            </Link>
          ))}
        </div>
        <div className="flex flex-col gap-1 outline outline-2 my-4 outline-negative-200">
          <h2 className="text-2xl font-semibold">Märkte mit Nikolaus</h2>
          {maerkteMitNikolaus.map((event, i) => (
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
      <section className="rounded-lg bg-gradient-to-b shadow-2xl from-negative-600 to-negative-700 text-negative-100 p-4 md:py-8 w-full flex gap-4 flex-col items-center max-w-full bg-opacity-10 transition-all">
        <div className="w-full max-w-[720px] flex flex-col gap-2 justify-between items-stretch">
          <h1 className="text-3xl flex-grow font-bold ">
            Weihnachtsmärkte in Hamburg <span className="text-2xl">🎄👧🧑‍🎄</span>
          </h1>

          <p className="italic">
            Die Weihnachtszeit bringt in Hamburg eine zauberhafte Stimmung mit
            sich, und die vielen Weihnachtsmärkte in der Stadt laden Familien
            und Freunde zum gemeinsamen Entdecken ein. Von kleinen, gemütlichen
            Nachbarschaftsmärkten bis hin zu großen, festlichen Veranstaltungen
            ist für jeden etwas dabei. Hier findet ihr eine Übersicht der
            kinderfreundlichsten Weihnachtsmärkte in Hamburg – perfekt, um die
            Vorweihnachtszeit in vollen Zügen zu genießen.
          </p>
        </div>
        <section className="self-start max-w-full flex justify-center items-center flex-wrap gap-4">
          {!!todayLaternenumzuege.length && (
            <div className="flex flex-col items-center gap-1 w-[300px]">
              <h2 className="text-2xl font-semibold">Heute</h2>
              <ClientLaterneGallery eventsList={todayLaternenumzuege} />
            </div>
          )}
          <div
            className={`flex-grow ${!!todayLaternenumzuege.length && "md:max-w-[calc(100%-332px)]"}`}
          >
            <BezirkableEventsList
              type="events"
              variant="transparent-dark"
              eventsList={orderedEvents}
            />
          </div>
        </section>
      </section>
      <article
        className="p-2 md:p-4 max-w-[800px] w-full mx-auto rounded-lg"
        style={{
          background: "linear-gradient(45deg, #4e7247 0%, #628d5a   100%)",
        }}
      >
        <WeihnachtsmaerkteMap
          darkBackground
          square={false}
          currentEvents={thisWeekEvents}
          future={futureEvents}
          today={lastMidnight}
        />
      </article>
      <Attraktionen
        attraktionen={{
          karussell: maerkteMitCarousell,
          kinderprogramm: maerkteMitKinderprogramm,
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
