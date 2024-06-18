"use client";
import React from "react";
import TriangleIcon from "./@Icons/TriangleIcon";

export default function ArrowGallery({
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
        length > 1 ? "w-full aspect-[0.75] lg:aspect-[0.9]" : "w-fit"
      } h-full relative xs:max-w-fit max-h-full flex bg-gray-500 bg-opacity-25 gap-1 items-center justify-center lg:justify-between rounded`}
    >
      <div
        className={`${
          length > 1 ? "flex" : "hidden"
        } absolute lg:relative left-0 h-full min-w-fit z-10 p-2 justify-center items-center rounded`}
      >
        <button
          className="min-h-12 min-w-12 p-2 backdrop-blur-[1px] bg-hh-950 bg-opacity-10 rounded-full z-50 border  border-hh-100 hover:bg-hh-100 transition-all text-white flex justify-center items-center -rotate-90"
          onClick={() => handleIndex("back")}
        >
          <TriangleIcon color="#fefefe" size="1rem" />
        </button>
      </div>
      <div className="max-h-72 lg:max-w-[180px] h-full overflow-hidden flex justify-center items-center rounded  border-gray-200">
        {children}
      </div>
      <div
        className={`${
          length > 1 ? "flex" : "hidden"
        } absolute lg:relative right-0 h-full min-w-fit z-10 p-2 justify-center items-center rounded`}
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
