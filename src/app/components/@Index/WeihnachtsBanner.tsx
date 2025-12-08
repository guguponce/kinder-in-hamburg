import React from "react";
import EventsGallery from "./laternenumzug/EventsGallery";
import PageTitle from "../PageTitle";
import Link from "next/link";
import WeihnachtsmarktIcon from "../@Icons/@Events/WeihnachtsmarktIcon";
import { cn, getTodayNexMonday } from "@app/utils/functions";
import {
  getFutureApprovedEventsFromType,
  getQuantityThisWeekEvents,
} from "@app/api/dbActions";
import { iEventType, iFlohmarkt } from "@app/utils/types";
import { unstable_cache } from "next/cache";
import dynamic from "next/dynamic";
import { MapIndexes } from "../@Map/PopUpsMarkers/MapIndexes";
import StandortIcon from "../@Icons/StandortIcon";

const getThisWeekWeihnachtsEvents = async (type: iEventType[]) => {
  const { nextMonday } = getTodayNexMonday();
  const events = (await getFutureApprovedEventsFromType(type)) || [];
  const { weihnachtsmaerkte, adventsEvents } = events.reduce(
    (acc, event) => {
      if (event.type?.includes("weihnachtsmarkt")) {
        acc.weihnachtsmaerkte.push(event);
      }
      if (event.type?.includes("adventsevent") && event.date < nextMonday) {
        acc.adventsEvents.push(event);
      }
      return acc;
    },
    { weihnachtsmaerkte: [] as iFlohmarkt[], adventsEvents: [] as iFlohmarkt[] }
  );
  return { weihnachtsmaerkte, adventsEvents };
};

const cachedQuantityFlohmaerkte = unstable_cache(
  getQuantityThisWeekEvents,
  ["flohmaerkte", "events"],
  {
    revalidate: 600,
  }
);

const cachedWeihnachtsEvents = unstable_cache(
  getThisWeekWeihnachtsEvents,
  ["flohmaerkte", "events"],
  {
    revalidate: 600,
  }
);

const DynamicWeihMap = dynamic(() => import("@components/@Map/WeihMap"), {
  ssr: false,
});

export default async function WeihnachtsBanner() {
  const { todaysMonth, todaysDate, today } = getTodayNexMonday();
  if (![1, 10, 11].includes(todaysMonth)) {
    return null;
  }
  const { weihnachtsmaerkte, adventsEvents } = await cachedWeihnachtsEvents([
    "weihnachtsmarkt",
    "adventsevent",
  ]);
  const quantityFlohs = (await cachedQuantityFlohmaerkte("flohmaerkte")) || 0;

  return (
    <section
      className={cn(
        "relative rounded-lg bg-gradient-to-b w-fit p-4 flex flex-column md:flex-row justify-around md:items-stretch flex-wrap gap-2 md:gap-4 from-positive-700 via-positive-700 to-[#628d5a50] text-white bg-opacity-10 transition-all overflow-hidden",
        !quantityFlohs
          ? "w-fit max-w-[420px] md:max-w-full"
          : "w-fit max-w-[420px]"
      )}
    >
      <div className="sm:gap-2 flex flex-col items-center w-fit md:max-w-full max-h-full min-h-fit">
        <div className="min-h-fit min-w-[280px] w-full max-w-[300px] flex-grow flex items-center justify-around flex-col rounded">
          <PageTitle
            title="Weihnachtszeit"
            className="text-4xl"
            link="/weihnachtszeit"
          />

          <h4 className="text-center text-sm sm:text-base italic lg:backdrop-blur-sm mb-2">
            {todaysMonth === 10 && todaysDate <= 15
              ? "Die Weihnachtssaison hat gerade erst begonnen! Entdecke jetzt die kommenden Events und Märkte."
              : todaysMonth === 11 && todaysDate >= 20
                ? "Die Weihnachtssaison ist fast zu Ende, aber es gibt noch ein paar Events und Märkte!"
                : "Die Weihnachtssaison ist in vollem Gange! Entdecke jetzt die kommenden Events und Märkte."}
          </h4>
          <EventsGallery eventType="adventsevent" />
        </div>
        <div className="h-12 relative flex justify-between items-end w-full pb-2">
          <Link
            href={"/weihnachtszeit"}
            className="underline underline-offset-2 font-semibold px-2 text-end text-white self-end hover:scale-[1.01] transition-all hover:underline-offset-4"
          >
            alle entdecken
          </Link>
          <div className="h-12 aspect-square">
            <WeihnachtsmarktIcon desaturate size="h-12" />
          </div>
        </div>
      </div>

      {!quantityFlohs && (
        <div className="max-h-full md:min-h-[400px] min-w-[300px]  aspect-[0.75] lg:aspect-[1.5] rounded flex flex-col justify-center items-center gap-2">
          <DynamicWeihMap
            events={adventsEvents}
            weihnachtsmaerkte={weihnachtsmaerkte}
            eventTypes={["adventsevent", "weihnachtsmarkt"]}
          />
          <MapIndexes kommendeEvents={false} eventTypes={["weihnachtsmarkt"]}>
            <>
              <StandortIcon color="#2d3d2a" />
              <p>Adventsprogramm</p>
            </>
          </MapIndexes>
        </div>
      )}
    </section>
  );
}
