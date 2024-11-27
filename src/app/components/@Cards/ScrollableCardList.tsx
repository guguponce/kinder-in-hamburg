import { iFlohmarkt, iPost } from "@app/utils/types";
import React from "react";
import ImageCard from "./ImageCard";
import ImgPriorityCard from "./ImgPriorityCard";
import TextPriorityCard from "./TextPriorityCard";
import {
  getDate,
  getPlainText,
  isTypeFlohmarkt,
  isTypePost,
} from "@app/utils/functions";
import ScrollableContainer from "../ScrollableContainer";
import FlohmarktPoster from "./FlohmarktPoster";

export default function ScrollableCardList({
  posts,
  size = "small",
  cardType = "text-priority",
  key,
  linkPrefix,
  withDate,
}: {
  key?: string;
  size: "small" | "medium" | "large";
  posts: iPost[] | iFlohmarkt[];
  cardType: "image" | "img-priority" | "text-priority";
  descriptions?: boolean;
  linkPrefix?: string;
  withDate?: boolean;
}) {
  const Card =
    cardType === "image"
      ? ImageCard
      : cardType === "img-priority"
        ? ImgPriorityCard
        : TextPriorityCard;
  return (
    <ScrollableContainer>
      {isTypePost(posts[0])
        ? (posts as iPost[]).map(({ id, image, title, text }) => (
            <React.Fragment key={id + title + (key || "")}>
              {Card({
                id: id,
                image: image ? image[0] : "",
                title: title,
                aspectRatio: 0.66,
                link: linkPrefix ? `${linkPrefix}${id}` : `/posts/${id}`,
                size: size,
                description: getPlainText(text),
              })}
            </React.Fragment>
          ))
        : isTypeFlohmarkt(posts[0])
          ? (posts as iFlohmarkt[]).map(
              ({
                id,
                image,
                title,
                optionalComment,
                date,
                bezirk,
                stadtteil,
                endDate,
                type,
              }) => (
                <div
                  className="flex flex-col items-center min-w-[160px]"
                  key={id + title + (key || "")}
                >
                  {image ? (
                    Card({
                      id: id,
                      image: image || "",
                      title: title,
                      aspectRatio: 0.66,
                      link: linkPrefix ? `${linkPrefix}${id}` : `/posts/${id}`,
                      size: size,
                      description: optionalComment,
                    })
                  ) : (
                    <FlohmarktPoster
                      id={id}
                      title={title}
                      bezirk={bezirk}
                      date={date}
                      stadtteil={stadtteil}
                      contain
                      endDate={endDate}
                      eventType={type}
                      image={image}
                      size="small"
                      prefixLink="/events/"
                    />
                  )}
                  {withDate && (
                    <p className="text-sm bg-black bg-opacity-25 text-hh-50 font-semibold w-[calc(100%-1rem)] text-center rounded-[0_0_2px_2px]">
                      {getDate(date, true).replace(/(\w+)/, (_, p1) => {
                        return p1.slice(0, 2) + ".";
                      })}
                    </p>
                  )}
                </div>
              )
            )
          : null}
    </ScrollableContainer>
  );
}
