import { getDate } from "@app/utils/functions";
import Link from "next/link";
import React from "react";
import FlohmarktBackground from "../@Icons/@Flohmarkt/FlohmarktBackground";
import { iEventType } from "@app/utils/types";

interface iFlohmarktPosterProps {
  contain?: boolean;
  size?: "small" | "medium" | "large";
  index?: number;
  title: string;
  image?: string;
  date: number;
  stadtteil?: string;
  bezirk: string;
  prefixLink?: string;
  eventType?: iEventType;
  id: number;
  endDate?: number;
}

export default function FlohmarktPoster({
  title,
  image,
  date,
  bezirk,
  prefixLink,
  id,
  index,
  eventType = "flohmarkt",
  contain = false,
  size = "medium",
  endDate,
  stadtteil,
}: iFlohmarktPosterProps) {
  const today = new Date().setHours(0, 0, 0, 0);
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
      {!image &&
        (eventType === "flohmarkt" ? (
          <FlohmarktBackground
            randomNumber={
              typeof index === "number"
                ? Number("0." + (index + 1) * 72584270527)
                : undefined
            }
          />
        ) : (
          eventType === "laterne" ||
          (eventType === "laternewerkstatt" && (
            <div
              className="absolute w-full h-full flex justify-between flex-col items-center text-orange-200 border-2 border-hh-600 rounded overflow-hidden"
              style={{
                backgroundImage: `url("/assets/icons/laterne/laterne.svg")`,
                backgroundSize: "50%",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
              }}
            />
          ))
        ))}
      {!!image && !["adventsevent", "weihnachtsmarkt"].includes(eventType) ? (
        <img
          loading="lazy"
          src={image}
          alt={title}
          className={`w-full h-full rounded ${contain ? "object-contain" : "object-cover"}`}
        />
      ) : (
        <>
          {image ? (
            <img
              loading="lazy"
              src={image}
              alt={title}
              className={`absolute w-full h-full rounded ${contain ? "object-contain" : "object-cover"}`}
            />
          ) : eventType === "adventsevent" ||
            eventType === "weihnachtsmarkt" ? (
            <img
              loading="lazy"
              src={"/assets/icons/weihnachtsmarkt.svg"}
              alt={title}
              className={`absolute rounded object-contain w-1/2 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2`}
            />
          ) : null}
          <h2
            className={`text-sm font-extrabold p-2 text-positive-900 my-4 max-w-[180px] break-words rounded bg-hh-300 backdrop-blur-sm ${image ? "bg-opacity-80" : "bg-opacity-50"}`}
          >
            {title}
          </h2>
          <div
            className={`flex flex-col items-center p-1 mb-4 bg-hh-300 bg-opacity-50 backdrop-blur-sm rounded mx-1 ${image ? "bg-opacity-75" : "bg-opacity-50"}`}
          >
            <h2 className="text-lg font-semibold text-hh-800">
              {stadtteil || bezirk}
            </h2>
            {endDate ? (
              <h3 className="text-xs font-semibold text-hh-800">
                {date > today
                  ? `Ab dem ${getDate(date)}`
                  : `Bis zum ${getDate(endDate)}`}
              </h3>
            ) : (
              <h3 className="text-sm font-semibold text-hh-800">
                {getDate(date)}
              </h3>
            )}
          </div>
        </>
      )}
    </Link>
  );
}
