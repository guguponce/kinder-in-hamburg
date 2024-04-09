"use client";

import React, { useState } from "react";

import Link from "next/link";
import { type iPost } from "@app/utils/types";
import CardsDisplayArrows from "./CardsDisplayArrows";
import { getImagesArray, getPlainText } from "@app/utils/functions";
import Card from "./Card";
import ImgPriorityCard from "./ImgPriorityCard";

export default function CardsDisplay({ cardPosts }: { cardPosts: iPost[] }) {
  return (
    <div
      className={`${
        cardPosts.length >= 4 ? "gap-2" : "gap-0"
      } flex md:flex-row flex-col  items-stretch min-h-[300px] overflow-auto p-2 w-fit`}
    >
      {cardPosts.map(({ id, title, text, image }) => {
        return (
          <React.Fragment key={id}>
            <ImgPriorityCard
              size="small"
              id={id}
              title={title}
              image={
                image
                  ? image[0]
                  : `https://dummyimage.com/200x100/47596b/fff.jpg&text=${title}`
              }
              description={getPlainText(text)}
            />
          </React.Fragment>
          // <Link
          //   href={`/posts/${post.id}`}
          //   key={post.id}
          //   className="flex flex-col justify-center w-1/3 min-w-[175px] max-w-[225px]  rounded-md shadow-md hover:shadow-2xl"
          //   // minW={cardType === "bezirke" ? "190px" : "170px"}
          // >
          //   <div className="recommendedImg p-0 flex justify-center items-center h-[250px]">
          //     <img
          //       id={post.title}
          //       className="w-full h-full object-cover rounded-sm"
          //       loading="lazy"
          //       src={post.image ? post.image[0] : "/assets/icons/baby.svg"}
          //       alt={post.title}
          //     />
          //     {}
          //   </div>
          //   <div
          //     className="w-full flex flex-col justify-start p-2 overflow-x-hidden flex-grow"
          //     id="text-card-homepage"
          //   >
          //     <div className="cardBody py-1 overflow-hidden">
          //       <h3 className="recommendedCardTitle overflow-hidden text-lg font-semibold">
          //         {post.title}
          //       </h3>
          //     </div>
          //   </div>
          // </Link>
        );
      })}
    </div>
  );
}
