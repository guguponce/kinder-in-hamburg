import { getDate } from "@app/utils/functions";
import Link from "next/link";
import React from "react";
import FlohmarktBackground from "../@Icons/@Flohmarkt/FlohmarktBackground";

export default function FlohmarktPoster({
  title,
  image,
  date,
  bezirk,
  prefixLink,
  id,
}: {
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
      } w-full min-w-[180px] h-full shadow-md rounded-sm flex flex-col items-center  justify-between text-center hover:scale-[1.01] hover:shadow-xl`}
    >
      <FlohmarktBackground />
      {!!image ? (
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover rounded"
        />
      ) : (
        <>
          <h2 className="text-lg md:text-xl font-bold px-2 text-negative-400 my-4">
            {title}
          </h2>
          <div className="flex flex-col items-center p-1 mb-4">
            <h2 className="text-lg font-semibold text-hh-800">{bezirk}</h2>
            <h3 className="text- font-semibold">{getDate(date)}</h3>
          </div>
        </>
      )}
    </Link>
  );
}
