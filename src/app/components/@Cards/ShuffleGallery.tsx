"use client";
import { iFlohmarkt, iPost, iSpielplatz } from "@app/utils/types";
import React, { useMemo, useRef } from "react";
import TriangleIcon from "../@Icons/TriangleIcon";
import ShuffleIcon from "../@Icons/ShuffleIcon";
import SpielplatzPoster from "./SpielplatzPoster";
import Link from "next/link";
import {
  cn,
  getPlainText,
  isTypeFlohmarkt,
  isTypePost,
  isTypeSpielplatz,
} from "@app/utils/functions";
import PostPoster from "./PostPoster";
import FlohmarktPoster from "./FlohmarktPoster";
import TextPriorityCard from "./TextPriorityCard";
import ImageCard from "./ImageCard";

export default function ShuffleGallery({
  children,
  list,
  size = "medium",
  shuffle,
  idSetter,
  titleUnder = false,
  dark = false,
  transparent = false,
  posterClassname,
  postPoster = true,
  shuffleContainerClassName,
}: {
  shuffleContainerClassName?: string;
  postPoster?: boolean;
  posterClassname?: string;
  transparent?: boolean;
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
    } else {
      const backupImg = currentArticle?.image?.[0];
      return { currentArticle, backupImg };
    }
  }, [currentIndex, originalList]);
  if (article === undefined) return null;
  const { currentArticle, backupImg } = article;
  return (
    <div
      className={cn(
        `relative flex flex-col items-center rounded-md min-w-full bg-opacity-25 h-full gap-2 p-2
        ${transparent ? "" : dark ? "bg-hh-700" : "bg-hh-400"}
        ${shuffle ? "pb-12" : ""}`,
        shuffleContainerClassName
      )}
    >
      <article
        className={cn(
          "h-full w-full md:aspect-square shadow rounded bg-hh-400 bg-opacity-25 flex flex-col items-center gap-2 relative hover:shadow-2xl overflow-hidden",
          posterClassname
        )}
      >
        {isTypeFlohmarkt(currentArticle) ? (
          <FlohmarktPoster
            contain
            bezirk={currentArticle.bezirk}
            date={currentArticle.date}
            endDate={currentArticle.endDate}
            stadtteil={currentArticle.stadtteil}
            eventType={currentArticle.type || "flohmarkt"}
            title={currentArticle.title}
            image={currentArticle.image ? currentArticle.image : backupImg}
            prefixLink={!!currentArticle.type ? "/events/" : "/flohmaerkte/"}
            size={size}
            id={currentArticle.id}
          />
        ) : isTypePost(currentArticle) && !postPoster ? (
          !!currentArticle.image?.length ? (
            <ImageCard
              cardContainerClassname="w-full h-full max-w-none aspect-auto sm:w-full md:w-full sm:max-w-full md:max-w-full"
              title={currentArticle.title}
              image={currentArticle.image[0]}
              size={size}
              id={currentArticle.id}
              description={getPlainText(currentArticle.text).slice(0, 10)}
            />
          ) : (
            <TextPriorityCard
              cardContainerClassname="w-full h-full max-w-none aspect-auto sm:w-full md:w-full sm:max-w-full md:max-w-full"
              title={currentArticle.title}
              size={size}
              id={currentArticle.id}
              image={currentArticle.image ? currentArticle.image[0] : ""}
              description={getPlainText(currentArticle.text).slice(0, 220)}
            />
          )
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
            } p-1 ml-1 aspect-square -rotate-90 rounded focus:outline-hh-800 focus-visible:outline-hh-800 focus:-outline-offset-4 focus-visible:-outline-offset-4`}
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
              className="aspect-square hover:p-0 h-fit hover:bg-opacity-10 hover:bg-hh-50 rounded-lg  focus:outline-hh-800 focus-visible:outline-hh-800 focus:outline-offset-2 focus-visible:outline-offset-2"
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
            } p-1 mr-1 aspect-square rotate-90 rounded focus:outline-hh-800 focus-visible:outline-hh-800 focus:-outline-offset-4 focus-visible:-outline-offset-4`}
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
