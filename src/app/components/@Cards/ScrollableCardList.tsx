import { iPost } from "@app/utils/types";
import React from "react";
import ImageCard from "./ImageCard";
import ImgPriorityCard from "./ImgPriorityCard";
import TextPriorityCard from "./TextPriorityCard";
import { getPlainText } from "@app/utils/functions";
import ScrollableContainer from "../ScrollableContainer";

export default function ScrollableCardList({
  posts,
  size = "small",
  cardType = "text-priority",
  key,
  linkPrefix,
}: {
  key?: string;
  size: "small" | "medium" | "large";
  posts: iPost[];
  cardType: "image" | "img-priority" | "text-priority";
  descriptions?: boolean;
  linkPrefix?: string;
}) {
  const Card =
    cardType === "image"
      ? ImageCard
      : cardType === "img-priority"
        ? ImgPriorityCard
        : TextPriorityCard;
  return (
    <ScrollableContainer>
      {posts.map(({ id, image, title, text }) => (
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
      ))}
    </ScrollableContainer>
  );
}
