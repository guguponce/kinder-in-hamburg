import { getDate } from "@app/utils/functions";
import { iFlohmarkt } from "@app/utils/types";
import React from "react";

export default function FlohmarktPoster({
  flohmarkt: { title, image, date, location, bezirk },
}: {
  flohmarkt: iFlohmarkt;
}) {
  return (
    <div className="w-full h-full rounded flex flex-col items-center p-2 justify-around">
      {image ? (
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover rounded"
        />
      ) : (
        <>
          <h2 className="text-lg font-bold">{title}</h2>
          <div className="flex flex-col items-center p-1">
            <h3 className="text- font-semibold">{getDate(date)}</h3>
            <h2 className="text-lg font-semibold">{bezirk}</h2>
          </div>
        </>
      )}
    </div>
  );
}
