/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState } from "react";

import Link from "next/link";
import { iRetrievedPost } from "@app/utils/types";
import CardsDisplayArrows from "./CardsDisplayArrows";

export default function CardsDisplay({
  id,
  cardPosts,
  cardType,
}: {
  id: string;
  cardType?: string;
  cardPosts: iRetrievedPost[];
}) {
  return (
    <div className="w-full h-fit py-2" id={`${id}-card-display-container`}>
      <div className="hidden md:block">
        <div
          className={`${
            cardPosts.length >= 4 ? "gap-2" : "gap-0"
          } flex md:flex-row flex-col justify-around items-stretch min-h-[300px] flex-wrap`}
        >
          {cardPosts.map((post) => {
            return (
              <Link
                href={`/posts/${post.id}`}
                key={post.id}
                className="flex flex-col justify-center w-1/3 min-w-[175px] max-w-[225px]  rounded-md shadow-md hover:shadow-2xl"
                // minW={cardType === "bezirke" ? "190px" : "170px"}
              >
                <div className="recommendedImg p-0 flex justify-center items-center h-[250px]">
                  <img
                    id={post.data.title}
                    className="w-full h-full object-cover rounded-sm"
                    loading="lazy"
                    src={post.data.image![0]}
                    alt={post.data.title}
                  />
                </div>
                <div
                  className="w-full flex flex-col justify-start p-2 overflow-x-hidden flex-grow"
                  id="text-card-homepage"
                >
                  <div className="cardBody py-1 overflow-hidden">
                    <h3 className="recommendedCardTitle overflow-hidden text-lg font-semibold">
                      {post.data.title}
                    </h3>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
      <div className="md:hidden block">
        <CardsDisplayArrows cardPosts={cardPosts} />
      </div>
    </div>
  );
}
