import React from "react";

import { iSpielplatz, type iPost } from "@app/utils/types";
import {
  getPlainText,
  isTypePost,
  isTypeSpielplatz,
} from "@app/utils/functions";
import ImgPriorityCard from "./ImgPriorityCard";

const ImgPriorityCardMemo = React.memo(ImgPriorityCard);
export default function CardsListDisplay({
  children,
  cardPosts,
}: {
  cardPosts: iPost[] | iSpielplatz[];
  children?: React.ReactNode;
}) {
  return (
    <div
      className={`rounded-lg bg-hh-100 gap-2 lg:gap-8 min-h-[350px] h-full overflow-auto p-2 lg:p-4 w-full grid grid-cols-[repeat(auto-fit,minmax(160px,1fr))] justify-items-center`}
      style={{
        boxShadow: "inset 4px 4px 8px #bfc2c3, inset -4px -4px 8px #ffffff",
      }}
    >
      {cardPosts.map((card) => {
        const { id, title, image } = card;
        const categories = isTypePost(card) ? card.categories : card.type;
        const description = isTypePost(card)
          ? getPlainText(card.text)
          : card.text;
        return (
          <React.Fragment key={id}>
            <ImgPriorityCardMemo
              size="small"
              id={id}
              title={title}
              aspectRatio={0.75}
              image={
                !!image?.length
                  ? image[0]
                  : categories.includes("Badeplatz")
                    ? "/assets/icons/swim.svg"
                    : title.includes("Bücherhalle")
                      ? `/assets/buecherhalle${(id % 2) + 1}.webp`
                      : isTypeSpielplatz(card)
                        ? card.id % 2
                          ? "/assets/spielplatz.webp"
                          : "/assets/spielplatz2.webp"
                        : "/assets/icons/spielplatz/spielplatz.svg"
              }
              description={description}
              link={isTypePost(card) ? `/posts/${id}` : `/spielplaetze/${id}`}
            />
          </React.Fragment>
        );
      })}
      {cardPosts.length === 0 && (
        <div className=" text-gray-500 text-lg h-1/2 flex items-center justify-center flex-col">
          <h3 className="text-lg md:text-2xl font-semibold">
            Oops! Nichts gefunden
          </h3>
          <h4 className="md:text-xl">
            Vielleicht hilft es, die Filter zu ändern.
          </h4>
          {children}
        </div>
      )}
    </div>
  );
}
