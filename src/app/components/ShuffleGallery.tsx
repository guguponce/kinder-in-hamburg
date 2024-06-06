"use client";
import { iSpielplatz } from "@app/utils/types";
import React, { useMemo, useRef } from "react";
import TriangleIcon from "./@Icons/TriangleIcon";
import ShuffleIcon from "./@Icons/ShuffleIcon";
import SpielplatzPoster from "./SpielplatzPoster";
import Link from "next/link";

export default function ShuffleGallery({
  children,
  list,
  shuffle,
  idSetter,
}: {
  shuffle?: boolean;
  size?: "small" | "medium" | "large";
  list: iSpielplatz[];
  children?: React.ReactNode;
  idSetter?: React.Dispatch<React.SetStateAction<number>>;
}) {
  const originalList = useRef(list || []);
  const randomSPGeraeteIndex = useRef(Math.random());

  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [sortedList, setSortedList] = React.useState<iSpielplatz[]>(
    originalList.current
  );

  const article = useMemo(() => {
    if (originalList.current.length === 0) return undefined;
    const currentArticle = sortedList[currentIndex];
    const { spielgeraete = [] } = currentArticle;
    const backupImg = ["spielplatz", ...(spielgeraete || [])][
      (Math.floor(randomSPGeraeteIndex.current * spielgeraete?.length + 1) +
        currentIndex) %
        spielgeraete.length
    ];
    return { currentArticle, backupImg };
  }, [currentIndex, sortedList]);

  if (article === undefined) return null;
  const { currentArticle, backupImg } = article;
  return (
    <div
      className={`relative flex flex-col items-center rounded-md w-full bg-hh-400 bg-opacity-25 h-full lg:aspect-[1.25] gap-2 p-2 ${
        shuffle ? "pb-12" : ""
      }`}
    >
      <article className="h-full w-full md:aspect-square border border-hh-200 shadow-sm rounded bg-hh-400 bg-opacity-25 flex flex-col items-center gap-2 relative">
        <Link
          href={`/spielplaetze/${currentArticle.id}`}
          className="hover:brightness-110 hover:shadow-2xl shadow-sm w-full h-full rounded-md overflow-hidden"
        >
          <SpielplatzPoster
            bezirk={currentArticle.bezirk}
            stadtteil={currentArticle.stadtteil}
            backupImg={backupImg}
            title={currentArticle.title}
            image={currentArticle.image ? currentArticle.image[0] : undefined}
            spielgeraete={currentArticle.spielgeraete}
          />
        </Link>
      </article>
      <div
        className={`absolute ${
          shuffle
            ? "bottom-1 justify-around"
            : "top-1/2 -translate-y-1/2 -translate-x-1/2 left-1/2 justify-between px-1"
        } flex items-center w-3/4 gap-2`}
      >
        <button
          title="Previous Post"
          className={`${
            shuffle
              ? ""
              : "bg-hh-900 bg-opacity-15 hover:bg-hh-950 hover:bg-opacity-20 rounded-md shadow-md hover:shadow-lg transition-all duration-200 ease-in-out"
          } p-1 ml-1 aspect-square -rotate-90`}
          onClick={() => {
            const index =
              currentIndex === 0 ? sortedList.length - 1 : currentIndex - 1;
            setCurrentIndex(index);

            if (idSetter) idSetter(index);
          }}
        >
          <TriangleIcon size="2rem" color="#fefefe" />
        </button>
        {shuffle && (
          <button
            title="Shuffle"
            className="aspect-square hover:p-0 h-fit hover:bg-opacity-10 hover:bg-hh-50 rounded-full"
            onClick={() => {
              setSortedList(
                [...originalList.current].sort(() => 0.5 - Math.random())
              );
            }}
          >
            <ShuffleIcon size="2rem" color="#fefefe" />
          </button>
        )}
        <button
          title="Next Post"
          className={`${
            shuffle
              ? ""
              : "bg-hh-900 hover:bg-hh-950 hover:bg-opacity-20 bg-opacity-15 rounded-md shadow-md hover:shadow-lg transition-all duration-200 ease-in-out"
          } p-1 mr-1 aspect-square rotate-90`}
          onClick={() => {
            const index = (currentIndex + 1) % sortedList.length;
            setCurrentIndex(index);
            if (idSetter) idSetter(index);
          }}
        >
          <TriangleIcon size="2rem" color="#fefefe" />
        </button>
      </div>
    </div>
  );
}
