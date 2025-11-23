import React from "react";
import EventsGallery from "./EventsGallery";
import LaterneImage from "./LaterneImage";
import Image from "next/image";
import Link from "next/link";
import PageTitle from "@app/components/PageTitle";
import { iEventType } from "@app/utils/types";
import {
  getAllEventsThisWeek,
  getFutureApprovedEventsFromType,
} from "@app/api/dbActions";
import { unstable_cache } from "next/cache";
import { getTodayNexMonday } from "@app/utils/functions";

const getBannerEvents = async (eventType: iEventType[]) => {
  const eventsThisWeek = (await getAllEventsThisWeek(eventType)) || [];
  if (eventsThisWeek.length > 3) return eventsThisWeek;
  return (await getFutureApprovedEventsFromType(eventType)) || [];
};

const cachedEvents = unstable_cache(
  getBannerEvents,
  ["events", "flohmaerkte"],
  {
    revalidate: 300,
    tags: ["events", "flohmaerkte"],
  }
);
export default async function LaternenBanner() {
  const { todaysMonth, todaysDate } = getTodayNexMonday();
  const laterneEvents = await cachedEvents(["laternewerkstatt", "laterne"]);

  if (laterneEvents.length === 0 || todaysMonth < 8 || todaysMonth >= 11) {
    return null;
  }
  return (
    <section className="p-4 relative rounded-lg bg-gradient-to-b  min-w-fit flex gap-2 flex-col items-center from-hh-950 to-hh-800  w-fit max-w-full xs:max-w-[420px] text-white bg-opacity-10 transition-all overflow-hidden">
      <div className="sm:gap-2 flex flex-col items-center w-full min-h-full ">
        <Image
          style={{ left: "-6px" }}
          fill
          src={"/assets/icons/laterne/stars.svg"}
          alt="stars"
          className="absolute top-0 min-w-[1200px] max-h-[150px] bg-opacity-25 rounded-lg opacity-50 -z-1"
        />
        <div className="h-full flex flex-col items-center justify-between gap-2 w-fit rounded-3xl overflow-hidden bg-hh-950 bg-opacity-5">
          <div className="min-h-fit min-w-[280px] w-full max-w-[300px] flex-grow flex items-center justify-around flex-col rounded">
            <PageTitle
              title="Laternenumzüge"
              className="text-4xl"
              link="/laternenumzuege"
            />

            <h4 className="text-center text-sm sm:text-base italic lg:backdrop-blur-sm mb-2">
              {todaysMonth === 9 && todaysDate <= 15 //
                ? "Die Laternensaison hat gerade erst begonnen! Schau dir die kommenden Umzüge an."
                : todaysMonth === 10 && todaysDate >= 20
                  ? "Die Laternensaison ist fast zu Ende, aber es gibt noch ein paar Lichterumzüge vor dem Dezember!"
                  : "Die Laternensaison ist in vollem Gange! Schau dir die kommenden Umzüge an."}
            </h4>
            <EventsGallery eventType="laterne" events={laterneEvents} />
          </div>
          <div className="relative flex justify-between items-end w-full pb-2">
            <div
              className="h-12 aspect-square"
              style={{ transform: "scaleX(-1)" }}
            >
              <LaterneImage />
            </div>
            <Link
              href={"/laternenumzuege"}
              className="underline underline-offset-2 font-semibold px-2 text-end text-white self-end hover:scale-[1.01] transition-all hover:underline-offset-4"
            >
              {"alle entdecken"}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
