"use client";
import TriangleIcon from "@components/@Icons/TriangleIcon";
import FlohmarktPoster from "@components/@Cards/FlohmarktPoster";
import { cn } from "@app/utils/functions";
import { iFlohmarkt } from "@app/utils/types";
import React from "react";

export function ArrowGallery({
  handleIndex,
  children,
  length,
}: {
  children: JSX.Element;
  handleIndex: (direction: "next" | "back") => void;
  length: number;
}) {
  return (
    <div
      id="arrow-gallery"
      className={`${
        length > 1 ? "w-full" : "w-fit"
      } h-full relative flex items-center justify-center`}
    >
      <div
        className={`${
          length > 1 ? "flex" : "hidden"
        } absolute left-0 h-full w-16 z-10 p-2 justify-center items-center rounded`}
      >
        <button
          className="min-h-10 min-w-10 p-2 backdrop-blur-[1px] bg-hh-950 bg-opacity-10 rounded-full z-50 border  border-hh-100 hover:bg-hh-100 transition-all text-white flex justify-center items-center -rotate-90"
          onClick={() => handleIndex("back")}
        >
          <TriangleIcon color="#fefefe" size="1rem" />
        </button>
      </div>
      <div className="w-full h-full overflow-hidden flex justify-center items-center rounded">
        {children}
      </div>
      <div
        className={`${
          length > 1 ? "flex" : "hidden"
        } absolute right-0 h-full w-16 z-10 p-2 justify-center items-center rounded`}
      >
        <button
          className="min-h-10 min-w-10 p-2 backdrop-blur-[1px] bg-hh-950 bg-opacity-10  rounded-full z-50 border border-hh-100 hover:bg-hh-100 transition-all text-white flex justify-center items-center rotate-90"
          onClick={() => handleIndex("next")}
        >
          <TriangleIcon color="#fefefe" size="1rem" />
        </button>
      </div>
    </div>
  );
}

export default function ClientEventsGallery({
  eventsList,
}: {
  eventsList: iFlohmarkt[];
}) {
  const { current: today } = React.useRef(
    new Date().toLocaleDateString("de-DE", {
      day: "2-digit",
      month: "2-digit",
    })
  );
  const [index, setIndex] = React.useState(0);
  const handleIndex = (direction: "next" | "back") => {
    if (direction === "next") {
      const newIndex = (index + 1) % eventsList.length;
      setIndex(newIndex);
    } else {
      const newIndex = index === 0 ? eventsList.length - 1 : index - 1;
      setIndex(newIndex);
    }
  };
  const currentEvent = eventsList?.[index];
  if (!currentEvent?.lat || !currentEvent?.lon) handleIndex("next");
  const date = new Date(currentEvent?.date).toLocaleDateString("de-DE", {
    day: "2-digit",
    month: "2-digit",
  });
  const endDate =
    currentEvent?.endDate &&
    new Date(currentEvent?.endDate).toLocaleDateString("de-DE", {
      day: "2-digit",
      month: "2-digit",
    });
  return (
    <ArrowGallery length={eventsList.length} handleIndex={handleIndex}>
      <div className="relative w-[180px] aspect-[2/3] md:aspect-[3/5] pb-10 flex flex-col items-center">
        <div
          className={cn(
            "w-full h-full  z-50 border-2 rounded overflow-hidden",
            currentEvent.type &&
              (["laterne", "laternewerkstatt"].includes(currentEvent.type) &&
                "bg-hh-800 border-hh-600",
              ["adventsevent", "weihnachtsmarkt"].includes(currentEvent.type) &&
                "bg-positive-900 border-negative-600")
          )}
        >
          <FlohmarktPoster
            bezirk={currentEvent.bezirk}
            date={currentEvent.date}
            id={currentEvent.id}
            stadtteil={currentEvent.stadtteil}
            image={currentEvent.image}
            title={currentEvent.title}
            index={index}
            eventType={currentEvent.type}
            prefixLink="/events/"
            size="small"
            contain
            endDate={currentEvent.endDate}
          />
        </div>

        <div
          className={cn(
            "h-10 flex absolute translate-y-full bottom-10 justify-between items-center bg-gradient-to-r rounded-[0_0_4px_4px] w-[95%]",
            currentEvent.type &&
              (["laterne", "laternewerkstatt"].includes(currentEvent.type) &&
                "from-hh-800 via-hh-900 to-hh-800",
              ["adventsevent", "weihnachtsmarkt"].includes(currentEvent.type) &&
                "from-negative-950 to-positive-950")
          )}
        >
          <h5 className="text-xs font-semibold text-orange-50 w-fit px-2 py-1">
            {today === date
              ? "Heute"
              : !endDate
                ? date
                : date > today
                  ? "Ab dem " + date
                  : date <= today && "Bis " + endDate}
          </h5>
          <h5 className="text-xs font-semibold text-orange-200 px-2 text-end py-1">
            {currentEvent.stadtteil === "Andere Orte"
              ? (currentEvent.address.match(
                  /\d{5}\s([A-Za-zäöüÄÖÜß\s]+)/
                )?.[1] ?? currentEvent.bezirk)
              : currentEvent.stadtteil}
          </h5>
        </div>
      </div>
    </ArrowGallery>
  );
}
