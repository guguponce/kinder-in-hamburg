import ScrollableFlohmaerkte from "@app/components/ScrollableFlohmaerkte";
import React from "react";
import BezirkableFlohmaerkteList from "../(flohmaerkte)/flohmaerkte/BezirkableFlohmaerkteList";
import { getTodayNexMonday } from "@app/utils/functions";
import { getApprovedFlohmaerkte } from "@app/api/dbActions";
import FlohmarktPoster from "./FlohmarktPoster";
import ScrollableContainer from "./ScrollableContainer";
const FlohmaerkteMap = dynamic(() => import("./@Map/FlohmaerkteMap"), {
  ssr: false,
});
import dynamic from "next/dynamic";

export const revalidate = 0;
export default async function FlohmaerkteContainer() {
  const flohmaerkte = await getApprovedFlohmaerkte();
  if (!flohmaerkte) return <div>Keine Flohmärkte gefunden</div>;
  const { today, nextMonday } = getTodayNexMonday();
  const thisWeekFlohmaerkte = flohmaerkte.filter(
    ({ date }) => date > today && date < nextMonday
  );
  const futureFlohmaerkte = flohmaerkte
    .filter(({ date }) => date > nextMonday)
    .sort((a, b) => a.date - b.date);
  const timezoneOffset = -120 * 60 * 1000;
  const utcMidnight = new Date(new Date().getTime());
  utcMidnight.setHours(24, 0, 0, 0);
  const nextMidnight = utcMidnight.getTime() + timezoneOffset;
  const todayFlohmaerkte = thisWeekFlohmaerkte.filter(
    ({ date }) => date < nextMidnight
    //  today + 1000 * 60 * 60 * 24
  );
  return (
    <main className="rounded bg-hh-100 bg-opacity-25 w-[calc(100%-2rem)] p-4 flex flex-col items-center min-h-[50vh]">
      <h1 className="text-4xl font-bold my-2 p-2 rounded text-hh-900">
        Flohmärkte
      </h1>

      <div className="flex flex-col items-center gap-4 lg:gap-8 max-w-full">
        <section
          id="current-week-section"
          className="flex flex-wrap gap-4 w-full"
        >
          <div
            id="heute-map-container"
            className="w-full max-w-[400px] flex flex-col gap-4 align-center rounded bg-hh-200 bg-opacity-50 p-2 shadow-sm"
          >
            {!!todayFlohmaerkte.length && (
              <div className="relative flex justify-center flex-col rounded-md bg-hh-200 w-full">
                <h2 className="text-2xl font-semibold text-hh-800 text-center p-4  self-start">
                  Heute
                </h2>

                <ScrollableContainer>
                  {todayFlohmaerkte.map((floh) => (
                    <article
                      key={floh.id}
                      className="relative flex flex-col items-center overflow-hidden h-[275px] min-w-[180px] gap-1"
                    >
                      <h3 className="text-hh-600 text-center h-[20px] w-full font-semibold text-sm truncate-1">
                        {floh.stadtteil}
                      </h3>
                      <div className="overflow-hidden h-[250px] min-w-[180px] bg-white">
                        <FlohmarktPoster
                          key={floh.id}
                          title={floh.title}
                          bezirk={floh.bezirk}
                          date={floh.date}
                          image={floh.image}
                          id={floh.id}
                        />
                      </div>
                    </article>
                  ))}
                </ScrollableContainer>
              </div>
            )}
            <FlohmaerkteMap
              displayList={false}
              flohmaerkteWithCoordinates={thisWeekFlohmaerkte.filter(
                (floh) => floh.lat && floh.lon
              )}
              flohmarktID={thisWeekFlohmaerkte[0].id}
            ></FlohmaerkteMap>
          </div>
          <div className="flex flex-grow justify-center w-1/4">
            <ScrollableFlohmaerkte
              title={`Diese Woche gibt es ${thisWeekFlohmaerkte.length} ${
                thisWeekFlohmaerkte.length === 1 ? "Flohmarkt" : "Flohmärkte"
              }`}
              flohmaerkte={thisWeekFlohmaerkte}
            />
          </div>
        </section>
        <BezirkableFlohmaerkteList
          title="Ab nächster Woche"
          flohList={futureFlohmaerkte}
        ></BezirkableFlohmaerkteList>
      </div>
    </main>
  );
}
