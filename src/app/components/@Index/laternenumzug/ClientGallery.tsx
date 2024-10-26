"use client";
import TriangleIcon from "@app/components/@Icons/TriangleIcon";
import FlohmarktPoster from "@app/components/FlohmarktPoster";
import { getDate } from "@app/utils/functions";
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
          className="min-h-12 min-w-12 p-2 backdrop-blur-[1px] bg-hh-950 bg-opacity-10 rounded-full z-50 border  border-hh-100 hover:bg-hh-100 transition-all text-white flex justify-center items-center -rotate-90"
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
          className="min-h-12 min-w-12 p-2  backdrop-blur-[1px] bg-hh-950 bg-opacity-10  rounded-full z-50 border border-hh-100 hover:bg-hh-100 transition-all text-white flex justify-center items-center rotate-90"
          onClick={() => handleIndex("next")}
        >
          <TriangleIcon color="#fefefe" size="1rem" />
        </button>
      </div>
    </div>
  );
}

export default function ClientGallery({
  laternenList,
}: {
  laternenList: iFlohmarkt[];
}) {
  const [index, setIndex] = React.useState(0);
  const handleIndex = (direction: "next" | "back") => {
    if (direction === "next") {
      const newIndex = (index + 1) % laternenList.length;
      setIndex(newIndex);
    } else {
      const newIndex = index === 0 ? laternenList.length - 1 : index - 1;
      setIndex(newIndex);
    }
  };
  const currentLatern = laternenList[index];
  if (!currentLatern.lat || !currentLatern.lon) handleIndex("next");
  return (
    <ArrowGallery length={laternenList.length} handleIndex={handleIndex}>
      <div className="relative w-[180px] aspect-[2/3] flex flex-col rounded border-2 border-hh-600">
        {!currentLatern.image ? (
          <div className="absolute top-0 left-0 w-full h-full flex justify-around flex-col items-center text-orange-200">
            <h3 className="text-center text-sm font-semibold bg-hh-950 bg-opacity-50 p-1 rounded">
              {currentLatern.title}
            </h3>
            <div className="flex items-center flex-col gap-1">
              <h4 className="text-center text-xs font-semibold bg-hh-950 bg-opacity-50 p-1 rounded">
                {currentLatern.bezirk}
              </h4>
              <h4 className="text-center text-xs font-semibold bg-hh-950 bg-opacity-50 p-1 rounded">
                {getDate(currentLatern.date)}
              </h4>
            </div>
          </div>
        ) : (
          <div className="w-full h-full bg-hh-800 z-50">
            <FlohmarktPoster
              bezirk={currentLatern.bezirk}
              date={currentLatern.date}
              id={currentLatern.id}
              image={currentLatern.image}
              title={currentLatern.title}
              index={index}
              prefixLink="/events/"
              size="small"
              contain
            />
          </div>
        )}
      </div>
    </ArrowGallery>
  );
}
