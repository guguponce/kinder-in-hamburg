"use client";
import React from "react";
import TriangleIcon from "./@Icons/TriangleIcon";

export default function ArrowGallery({
  handleIndex,
  children,
}: {
  children: JSX.Element;
  handleIndex: (direction: "next" | "back") => void;
}) {
  return (
    <div
      id="arrow-gallery"
      className="flex flex-col items-center gap-4 h-full aspect-[0.9] max-h-full bg-gray-500 bg-opacity-25 rounded"
    >
      <div className="flex gap-1 items-center flex-grow justify-between w-full rounded py-2">
        <div className="h-full min-w-fit p-2 flex justify-center items-center rounded">
          <button
            className="min-h-12 min-w-12 p-2  rounded-full z-50 border  border-hh-100 hover:bg-hh-100 transition-all text-white flex justify-center items-center -rotate-90"
            onClick={() => handleIndex("back")}
          >
            <TriangleIcon color="#fefefe" size="1rem" />
          </button>
        </div>
        <div className="w-full aspect-[0.66] max-w-[180px] overflow-hidden flex-grow flex justify-center items-center rounded  border-gray-200">
          {children}
        </div>
        <div className="h-full min-w-fit p-2 flex justify-center items-center rounded">
          <button
            className="min-h-12 min-w-12 p-2  rounded-full z-50 border border-hh-100 hover:bg-hh-100 transition-all text-white flex justify-center items-center rotate-90"
            onClick={() => handleIndex("next")}
          >
            <TriangleIcon color="#fefefe" size="1rem" />
          </button>
        </div>
      </div>
    </div>
  );
}
