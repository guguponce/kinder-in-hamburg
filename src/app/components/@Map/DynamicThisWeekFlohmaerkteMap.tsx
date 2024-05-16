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
    <section className="flex flex-col items-center gap-2 w-full">
      <h2 className="text-2xl font-semibold dark:text-hh-100 text-hh-800">
        Flohmärkte Karte
      </h2>
      {currentTarget ? (
        <ul className="flex flex-wrap justify-around w-full max-w-[800px] gap-2 px-4">
          <li className="font-semibold bg-currentLocation text-white px-2 py-1 rounded">
            {currentTarget.title} - am{" "}
            {new Date(currentTarget?.date)
              .toLocaleDateString("de-DE")
              .split(".")
              .slice(0, 2)
              .join(".")}
          </li>
          <li className="font-semibold bg-stadtteilLocation text-white px-2 py-1 rounded">
            Flohmärkte dieser Woche ({todayDisplay} - {nextMondayDisplay})
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
