import { getThisWeekFlohmaerkte } from "@app/api/dbActions";
import { getTodayNexMonday } from "@app/utils/functions";
import { iFlohmarktWithCoordinates } from "@app/utils/types";
import dynamic from "next/dynamic";

const FlohmaerkteMap = dynamic(() => import("./FlohmaerkteMap"), {
  ssr: false,
});

export default async function DynamicThisWeekFlohmaerkteMap({
  flohmarktID,
  flohmarkt,
}: {
  flohmarkt?: iFlohmarktWithCoordinates;
  flohmarktID?: string;
}) {
  const { today, nextMonday } = getTodayNexMonday();
  const thisWeekFlohmaerkte = await getThisWeekFlohmaerkte();
  if (!thisWeekFlohmaerkte) return null;
  const flohmaerkteWithCoordinates = thisWeekFlohmaerkte.filter(
    (floh) => !!floh.lat && !!floh.lon
  ) as iFlohmarktWithCoordinates[];
  if (flohmaerkteWithCoordinates.length === 0) return null;
  const currentTarget = flohmarkt
    ? flohmarkt
    : flohmarktID
    ? flohmaerkteWithCoordinates.find((p) => p.id === parseInt(flohmarktID))
    : undefined;
  const todayDisplay = new Date(today)
    .toLocaleDateString("de-DE")
    .split(".")
    .slice(0, 2)
    .join(".");
  const nextMondayDisplay = new Date(nextMonday - 1000 * 60 * 60 * 12)
    .toLocaleDateString("de-DE")
    .split(".")
    .slice(0, 2)
    .join(".");
  return (
    <section className="flex flex-col items-center gap-2 w-[calc(100vw-2rem)] max-w-[600px] md:max-w-[800px] md:w-fit rounded border-2 border-hh-800 p-2">
      <h2 className="text-2xl self-end font-semibold dark:text-hh-100 text-hh-800 p-4">
        Flohmärkte Karte
      </h2>
      {currentTarget ? (
        <ul className="flex flex-col self-start w-full md:w-[800px] max-w-[800px] gap-2 px-4">
          <li className="flex">
            <span className="font-semibold bg-currentLocation text-white px-2 py-1 rounded">
              {currentTarget.title} - am{" "}
              {new Date(currentTarget?.date)
                .toLocaleDateString("de-DE")
                .split(".")
                .slice(0, 2)
                .join(".")}
            </span>
          </li>
          <li className="flex">
            <span className="font-semibold bg-stadtteilLocation text-white px-2 py-1 rounded">
              Dieser Woche ({todayDisplay} - {nextMondayDisplay})
            </span>
          </li>
        </ul>
      ) : (
        <p className="text-hh-800">
          (von {todayDisplay} bis {nextMondayDisplay})
        </p>
      )}

      <FlohmaerkteMap
        flohmarktID={flohmarktID}
        currentTarget={currentTarget}
        flohmaerkteWithCoordinates={flohmaerkteWithCoordinates}
      />
    </section>
  );
}
