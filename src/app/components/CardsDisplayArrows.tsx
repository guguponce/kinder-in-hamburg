"use client";

import { iPost } from "@app/utils/types";
import Link from "next/link";
import React, { useState } from "react";

interface Props {
  cardPosts: iPost[];
}

export default function CardsDisplayArrows({ cardPosts }: Props) {
  const [recIndex, setRecIndex] = useState<number>(0);
  const cardText = /.+()$/.exec(cardPosts[recIndex].text)![0];
  return (
    <div
      id="card-display-container"
      className="w-full flex md:hidden min-h-[50vh] justify-center items-center relative "
    >
      <Link
        href={`/posts/${cardPosts[recIndex].id}`}
        className="arrowCardBox w-full max-w-[500px] aspect-[0.66] flex flex-col lg:flex-row justify-between bg-white rounded-md max-h-[80dvh] duration-1000 shadow-md hover:outline-2 hover:outline-white hover:shadow-2xl"
      >
        <div className="p-0 md:min-w-[200px] max-h-[40dvh] aspect-1.33 w-full self-center md:mx-4">
          <img
            className="text-center object-cover max-h-40vh h-full w-full rounded-sm"
            id={cardPosts[recIndex].title + recIndex}
            loading="lazy"
            src={cardPosts[recIndex].image![0]}
            alt={cardPosts[recIndex].title}
          />
        </div>

        <div
          id="text-card-homepage"
          className="relative pb-4 md:pb-0 md:pl-4 overflow-x-hidden bg-white flex-grow flex items-center"
        >
          <button
            role="button"
            className={`arrowButton ${
              cardPosts.length > 1 ? "flex" : "hidden"
            } absolute text-white bg-[#84b8c6dc] rounded-full flex justify-center items-center z-50 -translate-y-1/2 w-10 h-10 left-0 mx-2  top-1/2 hover:border-2 hover:border-[#47596b]`}
            onClick={(e) => {
              e.stopPropagation();

              setRecIndex((i) => (i === 0 ? cardPosts!.length - 1 : i - 1));
            }}
          >
            {"<-"}
          </button>
          <div
            className="w-full flex flex-col justify-start p-2 overflow-x-hidden flex-grow px-16"
            id="text-card-homepage"
          >
            <div className="cardBody py-1 overflow-hidden">
              <h3 className="recommendedCardTitle overflow-hidden text-lg font-semibold">
                {cardPosts[recIndex].title}
              </h3>
              <p className="cardText md:py-2">
                {cardPosts[recIndex].text?.split(" ").slice(0, 75).join(" ")}
                {/* {cardText} */}
              </p>
            </div>
          </div>

          <button
            role="button"
            className={`arrowButton z-50 -translate-y-1/2 ${
              cardPosts.length > 1 ? "flex" : "hidden"
            } absolute text-white bg-[#84b8c6dc] rounded-full flex justify-center items-center w-10 h-10 mx-2 right-0 top-1/2 hover:border-2 hover:border-[#47596b]`}
            onClick={(e) => {
              e.stopPropagation();
              setRecIndex((i) => (i === 0 ? cardPosts!.length - 1 : i - 1));
            }}
          >
            {"->"}
          </button>
        </div>
      </Link>
    </div>
  );
}
