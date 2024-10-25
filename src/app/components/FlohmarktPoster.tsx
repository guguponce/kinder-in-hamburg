import { getDate } from "@app/utils/functions";
import Link from "next/link";
import React from "react";
import FlohmarktBackground from "./@Icons/@Flohmarkt/FlohmarktBackground";

export default function FlohmarktPoster({
  title,
  image,
  date,
  bezirk,
  prefixLink,
  id,
  index,
  contain = false,
  size = "medium",
}: {
  contain?: boolean;
  size?: "small" | "medium" | "large";
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
      style={
        title.includes("Goldbekhaus")
          ? {
              backgroundImage: "url(/assets/flohmarkt-images/goldbekhaus.webp)",
              backgroundPosition: "center",
              backgroundSize: "contain",
            }
          : {}
      }
      className={`relative ${
        image ? "" : "bg-gradient-to-b from-white to-hh-100 p-2"
      } w-full ${
        size === "small" ? "min-w-[144px]" : "min-w-[180px]"
      } h-full shadow-md rounded-sm flex flex-col items-center  justify-between text-center hover:scale-[1.01] hover:shadow-xl`}
    >
      {!image && (
        <FlohmarktBackground
          randomNumber={
            typeof index === "number"
              ? Number("0." + (index + 1) * 72584270527)
              : undefined
          }
        />
      )}
      {!!image ? (
        <img
          loading="lazy"
          src={image}
          alt={title}
          className={`w-full h-full rounded ${contain ? "object-contain" : "object-cover"}`}
        />
      ) : (
        <>
          <h2 className="text-base font-extrabold p-2 text-negative-700 my-4 max-w-[180px] break-words rounded bg-hh-300 bg-opacity-50 backdrop-blur-sm">
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
