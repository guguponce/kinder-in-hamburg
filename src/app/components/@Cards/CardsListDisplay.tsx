import React from "react";

import { type iPost } from "@app/utils/types";
import { getPlainText } from "@app/utils/functions";
import ImgPriorityCard from "./ImgPriorityCard";

export default function CardsListDisplay({
  cardPosts,
}: {
  cardPosts: iPost[];
}) {
  return (
    <div
      className={`gap-2 lg:gap-8 min-h-[350px] h-full overflow-auto p-2 w-full grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] justify-items-center`}
    >
      {cardPosts.map(({ id, title, text, image, categories }, index) => {
        return (
          <React.Fragment key={id}>
            <ImgPriorityCard
              size="small"
              id={id}
              title={title}
              aspectRatio={0.75}
              image={
                !!image?.length
                  ? image[0]
                  : categories.includes("Badeplatz")
                    ? "/assets/icons/swim.svg"
                    : "/assets/icons/spielplatz/spielplatz.svg"
              }
              description={getPlainText(text)}
            />
          </React.Fragment>
        );
      })}
    </div>
  );
}
