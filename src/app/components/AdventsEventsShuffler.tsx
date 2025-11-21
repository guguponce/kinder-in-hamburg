import { getFutureEventsWithTitle } from "@app/api/dbActions";
import ShuffleGallery from "@components/@Cards/ShuffleGallery";
import { cn, getDate, getTodayNexMonday } from "@app/utils/functions";
import { iFlohmarkt } from "@app/utils/types";
import Link from "next/link";
import React, { useMemo, useRef } from "react";

export default function AdventsEventsShuffler({
  events,
  shuffleContainerClassname,
  idSetter,
}: {
  idSetter?: React.Dispatch<React.SetStateAction<number>>;
  events?: iFlohmarkt[];
  shuffleContainerClassname?: string;
}) {
  const { today, yesterdayEvening } = getTodayNexMonday();
  const { current: eventsList } = useRef(events || []);
  const nikolausDate = 1765004400000; // 6. Dezember 2025
  const isNikolausTime =
    getDate(today) === getDate(nikolausDate) && Date.now() >= 1764745200000;
  const date =
    getDate(today) === getDate(nikolausDate)
      ? "Heute"
      : getDate(yesterdayEvening) === getDate(nikolausDate)
        ? "Morgen"
        : "Am 6. Dezember";
  const shuffleList = useMemo(
    () =>
      isNikolausTime
        ? eventsList.filter(({ title }) =>
            title.toLowerCase().includes("nikolaus")
          )
        : eventsList,
    [isNikolausTime, eventsList]
  );
  if (!events?.length) return null;

  return (
    <article
      id="adventsEvents"
      className="p-2 md:p-4 w-fit min-w-[280px] max-w-[300px] rounded-lg mx-auto self-stretch flex flex-col items-center gap-1 text-positive-100"
      style={{
        background: "linear-gradient(45deg, #405b3a 0%, #4e7247 100%)",
      }}
    >
      <Link
        href="weihnachtszeit#adventsEvents"
        className="text-xl font-semibold"
      >
        {isNikolausTime ? "Nikolausbesuche" : "Veranstaltungen"}
      </Link>
      <p className="text-xs italic max-w-[170px] pb-1">
        {isNikolausTime
          ? `${date} kommt er bei welchen Weihnachtsmärkten vorbei`
          : "Fast jeden Tag gibt es Advents-Events in verschiedenen Stadtteilen."}
      </p>
      <div className={cn("max-w-full aspect-[5/8]", shuffleContainerClassname)}>
        <ShuffleGallery
          idSetter={idSetter}
          list={shuffleList}
          size="small"
          dark
          transparent
          posterClassname="max-w-[180px] min-w-[180px] aspect-[3/4] bg-positive-900"
        />
      </div>
    </article>
  );
}
