import { iFlohmarkt } from "@app/utils/types";
import React from "react";
import FlohmarktPoster from "./@PostForm/FlohmarktPoster";

export default function FlohPostersList({
  flohList,
  prefixLink,
}: {
  flohList: iFlohmarkt[];
  prefixLink?: string;
}) {
  return (
    <>
      {!!flohList.length &&
        flohList.map(({ title, image, date, id, bezirk }) => (
          <React.Fragment key={id}>
            <article className="w-1/3 min-w-[150px] max-w-[180px] md:min-w-[180px] md:max-w-[200px] md:w-1/5 aspect-[0.66] bg-hh-200 rounded-sm ">
              <FlohmarktPoster
                id={id}
                title={title}
                image={image}
                date={date}
                bezirk={bezirk}
                prefixLink={prefixLink || ""}
              />
            </article>{" "}
          </React.Fragment>
        ))}
    </>
  );
}