import { cn, getDate } from "@app/utils/functions";
import Link from "next/link";
import React from "react";
import FlohmarktBackground from "../@Icons/@Flohmarkt/FlohmarktBackground";
import { iEventType } from "@app/utils/types";

const FlohmarktBackgroundMemo = React.memo(FlohmarktBackground);

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
      className={cn(
        `relative w-full h-full shadow-md rounded flex flex-col items-center justify-between text-center hover:scale-[1.01] hover:shadow-xl focus-visible:border-2 focus-visible:border-hh-900`,
        image ? "" : "bg-gradient-to-b from-[#e1e4e59f] to-[#d0d7da9f] p-2",
        size === "small" ? "min-w-[144px]" : "min-w-[180px]"
      )}
    >
      {image ? (
        <div
          className="absolute w-full h-full top-0 left-0 blur-sm"
          style={{
            backgroundImage: `url(${image})`,
            backgroundPosition: "center",
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
          }}
        />
      ) : eventType === "flohmarkt" ? (
        <FlohmarktBackgroundMemo
          randomNumber={
            typeof index === "number"
              ? Number("0." + (index + 1) * 72584270527)
              : undefined
          }
        />
      ) : (
        (eventType === "laterne" || eventType === "laternewerkstatt") && (
          <>
            <div className="absolute w-[30%] aspect-square rounded-full -translate-x-full top-1/2 left-[48%] bg-gradient-radial from-orange-300 via-transparent to- transparent  z-20" />
            <div
              className="absolute w-full h-full top-0 bg-hh-950 flex justify-between flex-col items-center text-orange-200 border-2 border-hh-600 rounded overflow-hidden"
              style={{
                backgroundImage: `url("/assets/icons/laterne/laterne.svg")`,
                backgroundSize: "50%",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
              }}
            />
          </>
        )
      )}
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
            className={cn(
              "text-sm font-extrabold p-2 my-4 max-w-[180px] break-words rounded bg-hh-300 backdrop-blur-sm text-positive-900",
              image
                ? "bg-opacity-80"
                : eventType === "laterne" || eventType === "laternewerkstatt"
                  ? "text-orange-300 bg-opacity-30"
                  : "bg-opacity-50"
            )}
          >
            {title}
          </h2>
          <div
            className={cn(
              "flex flex-col items-center p-1 mb-4 bg-hh-300 bg-opacity-50 backdrop-blur-sm rounded mx-1 font-semibold",
              image
                ? "bg-opacity-80"
                : eventType === "laterne" || eventType === "laternewerkstatt"
                  ? "text-orange-300 bg-opacity-30"
                  : "bg-opacity-50"
            )}
          >
            <h2 className="text-base ">{stadtteil || bezirk}</h2>
            {endDate ? (
              <h3
                className={cn(
                  "text-xs ",
                  ["laterne", "laternewerkstatt"].includes(eventType)
                    ? "text-orange-200"
                    : "text-hh-800"
                )}
              >
                {date > today
                  ? `Ab dem ${getDate(date)}`
                  : `Bis zum ${getDate(endDate)}`}
              </h3>
            ) : getDate(date) === getDate(today) ? (
              <h3 className="text-sm  outline-2 outline-hh-800 rounded w-full outline">
                Heute
              </h3>
            ) : (
              <h3 className="text-sm ">{getDate(date)}</h3>
            )}
          </div>
        </>
      )}
    </Link>
  );
}
