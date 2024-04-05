import { iParsedRetrievedPost } from "@app/utils/types";
import React from "react";
import ImageCard from "./ImageCard";
import ImgPriorityCard from "./ImgPriorityCard";
import TextPriorityCard from "./Card";
import { getPlainText } from "@app/utils/functions";

export default function ScrollableCardList({
  posts,
  size = "small",
  cardType = "text-priority",
}: {
  size: "small" | "medium" | "large";
  posts: iParsedRetrievedPost[];
  cardType: "image" | "img-priority" | "text-priority";
  descriptions?: boolean;
}) {
  const Card =
    cardType === "image"
      ? ImageCard
      : cardType === "img-priority"
      ? ImgPriorityCard
      : TextPriorityCard;
  return (
    <div className="flex  items-center w-fit max-w-full overflow-hidden">
      <div className="horizontalScrollbar overflow-x-auto w-fit max-w-full flex gap-2 items-stretch py-4">
        {posts.map(({ id, image, title, text }) => (
          <React.Fragment key={id}>
            {Card({
              id: id,
              image: image ? image[0] : "",
              title: title,
              aspectRatio: 0.66,
              link: `/posts/${id}`,
              size: size,
              description: getPlainText(text),
            })}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
