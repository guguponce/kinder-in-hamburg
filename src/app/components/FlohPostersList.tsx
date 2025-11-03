import { iFlohmarkt } from "@app/utils/types";
import React from "react";
import FlohmarktPoster from "./@Cards/FlohmarktPoster";

const afterNumber = (address: string) => {
  if (!address) return address;
  const m = address.match(/\d+/);
  if (!m || m.index == null) return undefined;
  const idx = m.index + m[0].length;
  return address
    .slice(idx)
    .replace(/^[\s,]+/, "")
    .trim();
};
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
        flohList.map(
          ({ title, image, date, id, bezirk, stadtteil, address }, i) => (
            <React.Fragment key={id}>
              <article className="w-full sm:w-1/2 min-w-[180px] max-w-[200px] min-h-[270px] h-auto bg-hh-200 rounded ">
                <FlohmarktPoster
                  id={id}
                  index={i}
                  title={title}
                  image={image}
                  date={date}
                  bezirk={bezirk}
                  prefixLink={prefixLink}
                  stadtteil={
                    stadtteil === "Andere Orte"
                      ? afterNumber(address)
                      : stadtteil
                  }
                />
              </article>{" "}
            </React.Fragment>
          )
        )}
    </>
  );
}
