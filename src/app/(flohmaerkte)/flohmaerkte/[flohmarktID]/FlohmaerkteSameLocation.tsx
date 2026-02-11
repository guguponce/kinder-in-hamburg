import { getEventsInSameLocation } from "@app/api/dbActions";
import ScrollableCardList from "@app/components/@Cards/ScrollableCardList";
import { unstable_cache } from "next/cache";
import React from "react";

const getFlohmaerkteSameLocation = unstable_cache(
  getEventsInSameLocation,
  ["flohmaerkte"],
  { revalidate: 3600 },
);
export default async function FlohmaerkteSameLocation({
  location,
  image,
  flohmarktID,
}: {
  flohmarktID: string;
  location: string;
  image?: boolean;
}) {
  if (!location) return null;
  const flohmaerkteSameLocation =
    (await getFlohmaerkteSameLocation(flohmarktID, location)) || [];
  if (flohmaerkteSameLocation.length === 0) return null;
  return (
    <section
      className={`w-full ${image ? "max-w-[1000px]" : "max-w-[800px]"}
        max-w-[800px] flex flex-col gap-2 items-center my-4 px-1 xs:px-4 sm:px-8`}
    >
      <h3 className="text-hh-800 text-2xl font-bold">
        Weitere Veranstaltungen in diesem Ort
      </h3>
      <ScrollableCardList
        color="800"
        linkPrefix="/flohmaerkte/"
        posts={flohmaerkteSameLocation}
        cardType="horizontal"
        size="small"
        withDate
      />
    </section>
  );
}
