import BezirkeScrollableFlohmaerkte from "@app/components/BezirkeScrollableFlohmaerkte";
import React from "react";
import BezirkableFlohmaerkteList from "../(flohmaerkte)/flohmaerkte/BezirkableFlohmaerkteList";
import { getTodayNexMonday } from "@app/utils/functions";
import { getApprovedFlohmaerkte } from "@app/api/dbActions";
const FlohmaerkteMap = dynamic(() => import("./@Map/FlohmaerkteMap"), {
  ssr: false,
});
import dynamic from "next/dynamic";
import TodaysFlohmaerkte from "./TodaysFlohmaerkte";

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
  const isSunday = new Date().getDay() === 0;
  return (
    <div className="rounded bg-hh-100 bg-opacity-25 w-[calc(100%-2rem)] p-1 sm:p-4 flex flex-col items-center min-h-[50vh]">
      <h1 className="text-4xl font-bold my-2 p-2 rounded text-hh-900">
        Flohmärkte
      </h1>

      <div className="flex flex-col items-center gap-4 lg:gap-8 max-w-full">
        <section
          id="current-week-section"
          className={`flex ${
            isSunday ? "flex-wrap-reverse" : "flex-wrap"
          } gap-4 w-full justify-center`}
        >
          <div
            id="heute-map-container"
            className="w-full lg:max-w-[400px] flex flex-col gap-4 items-center rounded bg-hh-200 bg-opacity-50 p-2 shadow-md"
          >
            {!!todayFlohmaerkte.length && !isSunday && (
              <TodaysFlohmaerkte todayFlohmaerkte={todayFlohmaerkte} />
            )}
            <FlohmaerkteMap
              displayList={false}
              flohmaerkteWithCoordinates={thisWeekFlohmaerkte.filter(
                (floh) => floh.lat && floh.lon
              )}
              flohmarktID={thisWeekFlohmaerkte[0].id}
            ></FlohmaerkteMap>
          </div>
          <div className="flex flex-grow w-full sm:min-w-[400px] justify-center sm:w-1/4">
            <BezirkeScrollableFlohmaerkte
              title={`${isSunday ? "Heute" : "Diese Woche"} gibt es ${
                thisWeekFlohmaerkte.length
              } ${
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
    </div>
  );
}
