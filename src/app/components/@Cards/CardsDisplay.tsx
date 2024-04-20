import React from "react";

import { type iPost } from "@app/utils/types";
import { getPlainText } from "@app/utils/functions";
import ImgPriorityCard from "./ImgPriorityCard";

export default function CardsDisplay({ cardPosts }: { cardPosts: iPost[] }) {
  return (
    <div
      className={`gap-2 lg:gap-8 flex md:flex-row justify-center items-start flex-row flex-wrap min-h-[350px] h-full overflow-auto p-2 w-full min-w-fit`}
    >
      {cardPosts.map(({ id, title, text, image }, index) => {
        return (
          <React.Fragment key={id}>
            <ImgPriorityCard
              size="small"
              id={id}
              title={title}
              aspectRatio={0.75}
              image={
                image
                  ? image[0]
                  : `https://dummyimage.com/200x100/47596b/fff.jpg&text=${title}`
              }
              description={getPlainText(text)}
            />
          </React.Fragment>
        );
      })}
    </div>
  );
}
