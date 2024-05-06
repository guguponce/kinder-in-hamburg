import { getDate } from "@app/utils/functions";
import Link from "next/link";
import React from "react";
import FlohmarktBackground from "./@Icons/@Flohmarkt/FlohmarktBackground";

export default async function FlohmarktPoster({
  title,
  image,
  date,
  bezirk,
  prefixLink,
  id,
  index,
}: {
  index?: number;
  title: string;
  image?: string;
  date: number;
  bezirk: string;
  prefixLink?: string;
  id: number;
}) {
  return (
    <Link
      href={!!prefixLink ? `${prefixLink}${id}` : `/flohmaerkte/${id}`}
      className={`relative ${
        image ? "" : "bg-gradient-to-b from-white to-hh-100"
      } w-full min-w-[180px] h-full shadow-md rounded-sm flex flex-col items-center  justify-between text-center hover:scale-[1.01] hover:shadow-xl p-2`}
    >
      <FlohmarktBackground
        randomNumber={
          typeof index === "number"
            ? Number("0." + (index + 1) * 72584270527)
            : undefined
        }
      />
      {!!image ? (
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover rounded"
        />
      ) : (
        <>
          <h2 className="text-lg md:text-xl font-extrabold p-2 text-negative-600 my-4 max-w-[180px] break-words rounded bg-hh-300 bg-opacity-50 backdrop-blur-sm">
            {title}
          </h2>
          <div className="flex flex-col items-center p-1 mb-4 bg-hh-300 bg-opacity-50 backdrop-blur-sm rounded">
            <h2 className="text-lg font-semibold text-hh-800">{bezirk}</h2>
            <h3 className="text- font-semibold">{getDate(date)}</h3>
          </div>
        </>
      )}
    </Link>
  );
}
