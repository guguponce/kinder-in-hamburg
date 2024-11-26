"use client";
import TriangleIcon from "@app/components/@Icons/TriangleIcon";
import FlohmarktPoster from "@app/components/@Cards/FlohmarktPoster";
import { getDate } from "@app/utils/functions";
import { iFlohmarkt } from "@app/utils/types";
import Link from "next/link";
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
      <div className="relative w-[180px] aspect-[2/3] flex flex-col items-center">
        {!currentEvent.image ? (
          <Link
            href={`/events/${currentEvent.id}`}
            className="w-full h-full flex justify-between bg-positive-700 bg-opacity-50 flex-col items-center text-orange-200 border-2 border-hh-600 rounded overflow-hidden"
            style={{
              backgroundImage: !currentEvent.type
                ? ""
                : ["laternewerkstatt", "laterne"].includes(currentEvent.type)
                  ? `url("/assets/icons/laterne/laterne.svg")`
                  : ["weihnachtsmarkt", "adventsevent"].includes(
                        currentEvent.type
                      )
                    ? 'url("/assets/icons/weihnachtsmarkt.svg")'
                    : "",
              backgroundSize: currentEvent.title.includes("Apostelkirche")
                ? "contain"
                : "50%",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          >
            <h3 className="text-center text-sm font-semibold bg-hh-950 bg-opacity-75 p-1 rounded">
              {currentEvent.title}
            </h3>
            <div className="flex items-center flex-col">
              <h4 className="text-center text-xs font-semibold bg-hh-950 bg-opacity-75 p-1 rounded">
                {currentEvent.bezirk}
              </h4>
            </div>
          </Link>
        ) : (
          <div
            className={`w-full h-full ${currentEvent.type && (["laterne", "laternewerkstatt"].includes(currentEvent.type) ? "bg-hh-800" : ["adventsevent", "weihnachtsmarkt"].includes(currentEvent.type) && "bg-positive-800")} z-50  border-2 border-hh-600 rounded overflow-hidden`}
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
            />
          </div>
        )}
        <div className="flex justify-between bg-gradient-to-r from-hh-800 to-hh-700 rounded-[0_0_4px_4px] w-[95%] py-1">
          <h5 className="text-xs font-semibold text-orange-50 w-fit px-2">
            {today === date
              ? "Heute"
              : !endDate
                ? date
                : date > today
                  ? "Ab dem " + date
                  : date <= today && "Bis " + endDate}
          </h5>
          <h5 className="text-xs font-semibold text-orange-200 px-1 h-fit text-end">
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
