"use client";
import TriangleIcon from "@app/components/@Icons/TriangleIcon";
import FlohmarktPoster from "@app/components/FlohmarktPoster";
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
      <div className="w-[180px] aspect-[2/3] flex flex-col rounded">
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
    </ArrowGallery>
  );
}
