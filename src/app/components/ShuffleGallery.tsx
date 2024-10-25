"use client";
import { iFlohmarkt, iPost, iSpielplatz } from "@app/utils/types";
import React, { useMemo, useRef } from "react";
import TriangleIcon from "./@Icons/TriangleIcon";
import ShuffleIcon from "./@Icons/ShuffleIcon";
import SpielplatzPoster from "./SpielplatzPoster";
import Link from "next/link";
import {
  isTypeFlohmarkt,
  isTypePost,
  isTypeSpielplatz,
} from "@app/utils/functions";
import PostPoster from "./PostPoster";
import FlohmarktPoster from "./FlohmarktPoster";

export default function ShuffleGallery({
  children,
  list,
  size = "medium",
  shuffle,
  idSetter,
  titleUnder = false,
  dark = false,
}: {
  titleUnder?: boolean;
  dark?: boolean;
  shuffle?: boolean;
  size?: "small" | "medium" | "large";
  list: iSpielplatz[] | iPost[] | Array<iPost | iSpielplatz> | iFlohmarkt[];
  children?: React.ReactNode;
  idSetter?: React.Dispatch<React.SetStateAction<number>>;
}) {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const originalList = useMemo(() => {
    setCurrentIndex(0);
    return list;
  }, [list]);

  const randomSPGeraeteIndex = useRef(Math.random());

  const article = useMemo(() => {
    if (originalList.length === 0) return undefined;
    const currentArticle = originalList[currentIndex];
    if (isTypeSpielplatz(currentArticle)) {
      const { spielgeraete = [] } = currentArticle as iSpielplatz;
      const backupImg = ["spielplatz", ...(spielgeraete || [])][
        (Math.floor(randomSPGeraeteIndex.current * spielgeraete?.length + 1) +
          currentIndex) %
          spielgeraete.length
      ];
      return { currentArticle, backupImg };
    } else if (isTypePost(currentArticle)) {
      const backupImg = currentArticle.image
        ? currentArticle.image[0]
        : undefined;
      return { currentArticle, backupImg };
    } else {
      const backupImg = currentArticle.image ? currentArticle.image : undefined;
      return { currentArticle, backupImg };
    }
  }, [currentIndex, originalList]);
  if (article === undefined) return null;
  const { currentArticle, backupImg } = article;
  return (
    <div
      className={`relative flex flex-col items-center rounded-md min-w-full ${
        dark ? "bg-hh-700" : "bg-hh-400"
      } bg-opacity-25 h-full gap-2 p-2 ${shuffle ? "pb-12" : ""}`}
    >
      <article className="h-full w-full md:aspect-square border border-hh-200 shadow-sm rounded overflow-hidden bg-hh-400 bg-opacity-25 flex flex-col items-center gap-2 relative">
        {isTypeFlohmarkt(currentArticle) ? (
          <div className="mx-auto h-full object-contain aspect-square sm:w-full  flex justify-center items-center">
            <FlohmarktPoster
              contain
              bezirk={currentArticle.bezirk}
              date={currentArticle.date}
              title={currentArticle.title}
              image={currentArticle.image ? currentArticle.image : backupImg}
              prefixLink={!!currentArticle.type ? "/events/" : "/flohmaerkte/"}
              size={size}
              id={currentArticle.id}
            />
          </div>
        ) : (
          <Link
            href={`${
              isTypeSpielplatz(currentArticle) ? "/spielplaetze/" : "/posts/"
            }${currentArticle.id}`}
            className="hover:brightness-110 hover:shadow-2xl shadow-sm w-full h-full overflow-hidden"
          >
            {isTypeSpielplatz(currentArticle) ? (
              <SpielplatzPoster
                titleUnder={titleUnder}
                bezirk={currentArticle.bezirk}
                stadtteil={currentArticle.stadtteil}
                backupImg={backupImg as string}
                title={currentArticle.title}
                image={
                  currentArticle.image ? currentArticle.image[0] : undefined
                }
                spielgeraete={currentArticle.spielgeraete}
              />
            ) : (
              isTypePost(currentArticle) && (
                <PostPoster
                  titleUnder={titleUnder}
                  title={currentArticle.title}
                  image={
                    currentArticle.image ? currentArticle.image[0] : undefined
                  }
                  bezirk={currentArticle.bezirk}
                  stadtteil={currentArticle.stadtteil}
                />
              )
            )}
          </Link>
        )}
      </article>
      {originalList.length > 1 && (
        <div
          className={`absolute ${
            shuffle
              ? "bottom-1 justify-around w-3/4"
              : "top-1/2 -translate-y-1/2 -translate-x-1/2 left-1/2 justify-between px-1 w-[calc(100%-1rem)]"
          } flex items-center  gap-2`}
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
                currentIndex === 0 ? originalList.length - 1 : currentIndex - 1;
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
                const availableIndexes = Array.from(
                  { length: originalList.length },
                  (_, i) => i
                ).filter((i) => i !== currentIndex);
                const randomIndex =
                  availableIndexes[
                    Math.floor(Math.random() * availableIndexes.length)
                  ];
                setCurrentIndex(randomIndex);

                if (idSetter) idSetter(randomIndex);
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
              const index = (currentIndex + 1) % originalList.length;
              setCurrentIndex(index);
              if (idSetter) idSetter(index);
            }}
          >
            <TriangleIcon size="2rem" color="#fefefe" />
          </button>
        </div>
      )}
    </div>
  );
}
