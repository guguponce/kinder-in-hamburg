import { getFutureEventsWithTitle } from "@app/api/dbActions";
import ShuffleGallery from "@app/components/@Cards/ShuffleGallery";
import { cn } from "@app/utils/functions";
import { iFlohmarkt } from "@app/utils/types";
import Link from "next/link";
import React from "react";

export default async function Nikolaus({
  events,
  shuffleContainerClassname,
}: {
  events?: iFlohmarkt[];
  shuffleContainerClassname?: string;
}) {
  const eventsList =
    events || (await getFutureEventsWithTitle("Nikolaus ")) || [];
  return (
    <article
      id="nikolaus"
      className="p-2 md:p-4 w-fit min-w-[280px] max-w-[300px] rounded-lg mx-auto self-stretch flex flex-col items-center gap-1 text-positive-100"
      style={{
        background: "linear-gradient(45deg, #405b3a 0%, #4e7247   100%)",
      }}
    >
      <Link href="weihnachtszeit#nikolaus" className="text-xl font-semibold">
        Nikolausbesuche
      </Link>
      <p className="text-xs italic max-w-[170px] pb-1">
        Am 6. Dezember kommt er bei welchen Weihnachtsmärkten vorbei
      </p>
      <div className={cn("max-w-full aspect-[5/8]", shuffleContainerClassname)}>
        <ShuffleGallery
          list={eventsList}
          size="medium"
          shuffle
          titleUnder
          transparent
        />
      </div>
    </article>
  );
}
