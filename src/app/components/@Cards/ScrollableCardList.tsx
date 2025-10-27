import { iFlohmarkt, iPost, iSpielplatz } from "@app/utils/types";
import React from "react";
import ImageCard from "./ImageCard";
import ImgPriorityCard from "./ImgPriorityCard";
import TextPriorityCard from "./TextPriorityCard";
import {
  addressWithoutCity,
  cn,
  getDate,
  getPlainText,
  isTypeFlohmarkt,
  isTypePost,
  isTypeSpielplatz,
  parseDescriptionWithTags,
} from "@app/utils/functions";
import ScrollableContainer from "../ScrollableContainer";
import FlohmarktPoster from "./FlohmarktPoster";
import HorizontalCard from "./HorizontalCard";

export default function ScrollableCardList({
  posts,
  size = "small",
  cardType = "text-priority",
  key,
  linkPrefix,
  withDate,
  cardClassname,
}: {
  cardClassname?: string;
  key?: string;
  size: "small" | "medium" | "large";
  posts: iPost[] | iFlohmarkt[] | iSpielplatz[];
  cardType?: "image" | "img-priority" | "text-priority" | "horizontal";
  descriptions?: boolean;
  linkPrefix?: string;
  withDate?: boolean;
}) {
  const Card =
    cardType === "image"
      ? ImageCard
      : cardType === "img-priority"
        ? ImgPriorityCard
        : cardType === "horizontal"
          ? HorizontalCard
          : TextPriorityCard;
  return (
    <ScrollableContainer>
      {isTypePost(posts[0]) || isTypeSpielplatz(posts[0])
        ? (posts as iPost[]).map(({ id, image, title, text, stadtteil }) => (
            <React.Fragment key={id + title + (key || "")}>
              {cardType === "horizontal" ? (
                <HorizontalCard
                  id={id}
                  image={image ? image[0] : ""}
                  title={title}
                  link={linkPrefix ? `${linkPrefix}${id}` : `/posts/${id}`}
                  imgSize="object-contain"
                  className="min-w-96"
                >
                  <HorizontalCard.PostInfo
                    title={title}
                    stadtteil={stadtteil}
                    description={parseDescriptionWithTags(getPlainText(text))}
                  />
                </HorizontalCard>
              ) : (
                Card({
                  id: id,
                  image: image ? image[0] : "",
                  title: title,
                  aspectRatio: 0.66,
                  link: linkPrefix ? `${linkPrefix}${id}` : `/posts/${id}`,
                  size: size,
                  cardContainerClassname: cardClassname,
                  description: parseDescriptionWithTags(getPlainText(text)),
                })
              )}
            </React.Fragment>
          ))
        : isTypeFlohmarkt(posts[0])
          ? (posts as iFlohmarkt[]).map(
              ({
                id,
                image,
                title,
                address,
                date,
                bezirk,
                stadtteil,
                endDate,
                type,
              }) => (
                <article
                  className={cn(
                    "flex flex-col items-center min-w-fit mr-4",
                    cardType !== "horizontal" ? "aspect-[3/4]" : "",
                    cardClassname
                  )}
                  key={id + title + (key || "")}
                >
                  {cardType === "horizontal" ? (
                    <div key={id} className="w-[240px] sm:w-[280px]">
                      <HorizontalCard
                        key={id}
                        type={type}
                        title={title}
                        id={id}
                        link={`${linkPrefix || "/events/"}${id}`}
                        image={image}
                      >
                        <HorizontalCard.FlohmarktInfo
                          title={title}
                          address={addressWithoutCity(address)}
                          stadtteil={stadtteil}
                          date={date}
                          bezirk={bezirk}
                        />
                      </HorizontalCard>
                    </div>
                  ) : (
                    <div className="w-[144px] sm:w-[180px] h-full">
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
                        prefixLink={linkPrefix || "/events/"}
                      />
                    </div>
                  )}

                  {withDate && (
                    <div className="absolute z-50 -translate-x-1/2 bottom-0 left-1/2 rounded-[4px_4px_0_0] flex justify-center w-3/4  p-1 text-xs bg-hh-800 backdrop-blur-sm bg-opacity-50 text-white">
                      {getDate(date, true).replace(/(\w+)/, (_, p1) => {
                        return p1.slice(0, 2) + ".";
                      })}
                    </div>
                  )}
                </article>
              )
            )
          : null}
    </ScrollableContainer>
  );
}
