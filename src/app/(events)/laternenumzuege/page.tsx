import { getFutureApprovedEventsFromType } from "@app/api/dbActions";
import NotFound from "@components/@NotFound/NotFound";
import BezirkableEventsList from "@components/BezirkableEventsList";
import React from "react";
import {
  addressWithoutCity,
  getTodayNexMonday,
  separateByDate,
} from "@app/utils/functions";
import dynamic from "next/dynamic";
import AdminServerComponent from "@app/providers/AdminServerComponents";
import Link from "next/link";
import AddLatLon from "@components/AddLatLon";
import ClientLaterneGallery from "@app/components/@Index/laternenumzug/ClientEventsGallery";
import HorizontalCard from "@app/components/@Cards/HorizontalCard";
import ScrollableContainer from "@app/components/ScrollableContainer";

export const metadata = {
  title: "Laternenumzüge",
  icons: "/favicon.ico",
  description:
    "Hier findet ihr eine Zusammenstellung der Laternenumzüge in Hamburg sowie der dazugehörigen Aktivitäten für die Kleinen oder die ganze Familie.",
  keywords: [
    "hamburg mit kinder",
    "hamburg familie laternenumzug",
    "hamburg kinder laternenumzug",
    "hamburg laternenumzuege",
    "hamburg laternenumzug",
    "hamburg kinder laternenumzuege",
    "kinder in hamburg",
    "kinder hamburg",
    "laternenumzuege",
    "laternenumzüge",
    "laternenumzug",
    "kinder",
    "familie",
    "laternenumzuege hamburg",
    "laternenumzuege kinder",
    "laternenumzuege familie",
    "laternenumzuege hamburg kinder",
    "laternenumzuege hamburg familie",
    "laternenumzug hamburg",
    "laternenumzug kinder",
    "laternenumzug familie",
    "laternenumzug hamburg kinder",
    "laternenumzug hamburg familie",
    "flea market hamburg",
  ],
  openGraph: {
    title: "Laternenumzüge - Kinder in Hamburg",
    description:
      "Hier findet ihr eine Zusammenstellung der kinderfreundlichen Laternenumzüge in Hamburg sowie der dazugehörigen Aktivitäten für die Kleinen oder die ganze Familie.",
    url: "https://www.kinder-in-hamburg.de",
    images: process.env.BASE_URL + "opengraph-image.png",
  },
  twitter: {
    card: "summary_large_image",
    title: "Laternenumzüge - Kinder in Hamburg",

    description:
      "Hier findet ihr eine Zusammenstellung der kinderfreundlichen Laternenumzüge in Hamburg sowie der dazugehörigen Aktivitäten für die Kleinen oder die ganze Familie.",

    images: [process.env.BASE_URL + "/opengraph-image.png"], // Relative path to the image
  },
  metadataBase: new URL("https://www.kinder-in-hamburg.de"), // Base URL for resolving relative URLs
};

const DynamicEventsMap = dynamic(
  () => import("../../components/@Map/DynamicEventsMap"),
  {
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
  }
);
export default async function LaternenumzuegePage() {
  const laternenEvents = await getFutureApprovedEventsFromType("laterne");
  const laterneBastelnEvents =
    (await getFutureApprovedEventsFromType("laternewerkstatt")) || [];
  if (!laternenEvents) return <NotFound multiples type="event" />;
  if (!laternenEvents.length) return;
  const { today, nextMonday } = getTodayNexMonday();
  const lastMidnight = new Date(today).setHours(0, 0, 0, 0);
  const todayLaternenumzuege = [
    ...laterneBastelnEvents,
    ...laternenEvents,
  ].filter((event) => event.date < today);

  const orderedEvents = laternenEvents.sort((a, b) => a.date - b.date);
  const [futureEvents, thisWeekEvents] = orderedEvents.reduce(
    (acc, event) => {
      if (event.date < nextMonday - 1000 * 60 * 60 * 2) {
        acc[1].push(event);
      } else {
        acc[0].push(event);
      }
      return acc;
    },
    [[], []] as [typeof laternenEvents, typeof laternenEvents]
  );
  const bastelEventsByDate = separateByDate(laterneBastelnEvents);

  return (
    <main
      className={`flex flex-col gap-4 items-center w-full  ${!!todayLaternenumzuege.length ? "sm:max-w-[1000px]" : "sm:max-w-[800px]"} p-1 mb-4`}
    >
      <AdminServerComponent>
        <div className="flex flex-col gap-1 outline outline-2 outline-hh-200">
          {laternenEvents.map((event) =>
            event.status !== "approved" || !event.lat || !event.lon ? (
              <Link
                key={event.id}
                href={"/events/" + event.id}
                className="flex gap-2 items-center flex-wrap bg-hh-600 text-hh-50"
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
      </AdminServerComponent>
      <section className="p-4 rounded-lg bg-gradient-to-b from-hh-950 to-hh-800 w-full flex gap-4 flex-col items-center max-w-full text-white shadow-xl bg-opacity-10 transition-all">
        <div className="w-full max-w-[720px] flex flex-col gap-2 justify-between items-stretch">
          <h1 className="text-3xl flex-grow font-bold ">
            Laternenumzüge in Hamburg
          </h1>

          <p className="italic">
            Eine der bekanntesten Herbsttraditionen bringt Familien und Freunde
            zusammen, die mit bunten Laternen durch die Straßen ziehen und dabei
            Lieder singen. Diese Umzüge, oft zu Ehren des Heiligen Sankt Martin,
            sind in Hamburg in vielen Stadtteilen vertreten – von kleinen
            Nachbarschaftsumzügen bis zu großen öffentlichen Veranstaltungen.
            Hier haben wir eine Übersicht der kommenden Termine für euch
            zusammengestellt, damit ihr die herbstlichen Abende in Hamburg
            gemeinsam erleben könnt.
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
              variant="transparent-light"
              eventsList={orderedEvents.filter(
                ({ date }) => date >= lastMidnight
              )}
            />
          </div>
        </section>
        <article className="md:p-4 max-w-[800px] mx-auto">
          <DynamicEventsMap
            darkBackground
            thisWeek={thisWeekEvents}
            future={futureEvents}
            today={lastMidnight}
          />
        </article>
      </section>
      {!!laterneBastelnEvents.length && (
        <section
          id="laterneBasteln"
          className="p-4 rounded-lg bg-gradient-to-b shadow-2xl from-hh-100 to-hh-200 w-full max-w-[800px] flex gap-4 flex-wrap items-center text-white transition-all"
        >
          <div className="w-full flex flex-col gap-2 text-hh-800">
            <h2 className="text-3xl flex-grow font-bold ">Laternenwerkstatt</h2>

            <p className="italic">
              Vor jedem Laternenumzug muss man sich eine Laterne besorgen. Zwar
              kann man eine kaufen, doch Kinder lieben es, ihre eigene Laterne
              aus Karton, Transparentpapier, Kleber und kleinen Lichtern zu
              basteln, verziert mit Motiven wie Tieren, Sternen oder Figuren.
            </p>
            <p className="italic">
              Hier sind einige Angebote in Hamburg, wo ihr gemeinsam Laternen
              basteln könnt.
            </p>
          </div>
          <ScrollableContainer>
            {Object.entries(bastelEventsByDate).map(([date, events]) => (
              <article
                key={date}
                className="bg-gradient-to-br from-hh-900 to-hh-800 bg-opacity-25 transition-all flex flex-col rounded p-2 pt-0 min-w-fit"
              >
                <h3 className="font-semibold p-2">{date}</h3>
                <div className="min-w-fit flex gap-4 items-center">
                  {events.map(
                    ({
                      id,
                      type,
                      title,
                      image,
                      address,
                      date,
                      time,
                      stadtteil,
                    }) => (
                      <div key={id} className="w-[360px] min-w-[300px]">
                        <HorizontalCard
                          key={id}
                          type={type}
                          title={title}
                          id={id}
                          link={`/events/${id}`}
                          image={image}
                        >
                          <HorizontalCard.FlohmarktInfo
                            title={title}
                            address={addressWithoutCity(address)}
                            stadtteil={stadtteil}
                            date={date}
                            time={time}
                          />
                        </HorizontalCard>
                      </div>
                    )
                  )}
                </div>
              </article>
            ))}
          </ScrollableContainer>
        </section>
      )}
    </main>
  );
}
