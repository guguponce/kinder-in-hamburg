import React from "react";
import ScrollableContainer from "./ScrollableContainer";
import { iFlohmarkt } from "@app/utils/types";
import FlohmarktPoster from "./@PostForm/FlohmarktPoster";

export default function ScrollableFlohmaerkte({
  flohmaerkte,
  bezirk,
  title,
}: {
  flohmaerkte: iFlohmarkt[];
  bezirk: string;
  title?: string;
}) {
  return (
    <div className="w-fit max-w-full rounded">
      {title && (
        <h2 className="text-2xl font-semibold text-white text-center p-2 lg:p-4">
          {title}{" "}
        </h2>
      )}
      <ScrollableContainer>
        {flohmaerkte.map(({ id, title, date, image }, i) => (
          <article
            key={id}
            className={`overflow-hidden h-[250px] min-w-[180px] ${
              i === flohmaerkte.length - 1 ? "" : "mr-4"
            }`}
          >
            <FlohmarktPoster
              bezirk={bezirk}
              id={id}
              title={title}
              date={date}
              image={image}
              prefixLink={`/flohmaerkte/${id}`}
            />
          </article>
        ))}
      </ScrollableContainer>
    </div>
  );
}
