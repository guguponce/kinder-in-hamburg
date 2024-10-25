import { getAllEventsFromType } from "@app/api/dbActions";
import NotFound from "@app/components/@NotFound/NotFound";
import BezirkableEventsList from "@app/components/BezirkableEventsList";
import AdminRoute from "@app/providers/AdminRoute";
import React from "react";
import { getTodayNexMonday } from "@app/utils/functions";
import dynamic from "next/dynamic";

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
  const laternenEvents = await getAllEventsFromType("laterne");
  if (!laternenEvents) return <NotFound multiples type="event" />;
  if (!laternenEvents.length) return;
  const { today, nextMonday } = getTodayNexMonday();
  const lastMidnight = today - 1000 * 60 * 60 * 2;
  const orderedEvents = laternenEvents.sort((a, b) => a.date - b.date);
  return (
    <main className="flex flex-col w-full max-w-[800px] p-1">
      <section className="p-4 rounded-lg bg-gradient-to-b from-hh-950 to-hh-800 w-full flex gap-4 flex-col items-center sm:max-w-[800px] text-white shadow-xl bg-opacity-10 transition-all">
        <div className="w-full flex gap-2 justify-between items-stretch">
          {/* <div className="h-10 laterneWalkerIcon aspect-square "></div> */}
          <h1 className="text-3xl flex-grow font-bold ">
            Laternenumzüge in Hamburg
          </h1>
        </div>
        {/* <div className="h-10 laterneWalkerIcon aspect-square "></div> */}

        <p className="italic">
          Eine der bekanntesten Herbsttraditionen bringt Familien und Freunde
          zusammen, die mit bunten Laternen durch die Straßen ziehen und dabei
          Lieder singen. Diese Umzüge, oft zu Ehren des Heiligen Sankt Martin,
          sind in Hamburg in vielen Stadtteilen vertreten – von kleinen
          Nachbarschaftsumzügen bis zu großen öffentlichen Veranstaltungen. Hier
          haben wir eine Übersicht der kommenden Termine für euch
          zusammengestellt, damit ihr die herbstlichen Abende in Hamburg
          gemeinsam erleben könnt.
        </p>
        <section className="self-start max-w-full">
          <BezirkableEventsList
            type="events"
            variant="transparent-dark"
            eventsList={orderedEvents.filter(
              ({ date }) => date >= lastMidnight
            )}
          />
        </section>
        <article className="md:p-4">
          <DynamicEventsMap
            darkBackground
            thisWeek={orderedEvents.filter((event) => event.date < nextMonday)}
            future={orderedEvents.filter((event) => event.date > nextMonday)}
            today={lastMidnight}
          />
        </article>
      </section>
    </main>
  );
}
