import Link from "next/link";
import React from "react";
import CardLogo from "../@Icons/CardLogo";
import dynamic from "next/dynamic";
import { cn, getDate, separateAddress } from "@app/utils/functions";
import { iEventType } from "@app/utils/types";
import LaterneImage from "../@Index/laternenumzug/LaterneImage";
import DateIcon from "../@Icons/@PostLogo/DateIcon";
import HamburgIcon from "../@Icons/@PostLogo/HamburgIcon";
import HamburgFilledIcon from "../@Icons/@BezirkIcon/HamburgFilledIcon";
import StandortIcon from "../@Icons/StandortIcon";

const SpielplatzgeraeteBackground = dynamic(
  () => import("./SpielplatzgeraeteBackground"),
  { ssr: false }
);

interface iHorizontalCard {
  type?: "spielplatz" | "flohmarkt" | "post" | iEventType;
  id: string | number;
  title: string;
  image?: string;
  link: string;
  imgSize?: string;
  spielgeraete?: string[];
  children?: React.ReactNode;
  className?: string;
}

export default function HorizontalCard({
  type = "spielplatz",
  id,
  title,
  image,
  link,
  spielgeraete,
  imgSize,
  children,
  className,
}: iHorizontalCard) {
  return (
    <Link
      aria-label={`Explore ${title}`}
      href={link}
      className={cn(
        "HorizontalCard w-full h-32 sm:flex-grow justify-center flex gap-2 items-center bg-white text-hh-900 rounded-md overflow-hidden hover:shadow-md",
        className
      )}
    >
      <div
        className={`relative cardImage h-full aspect-[0.66] sm:aspect-square w-fit bg-hh-50 flex justify-center items-center ${
          spielgeraete && "bg-opacity-5"
        } ${!image && "p-2"}  ${["laternewerkstatt", "laterne"].includes(type) && !image && "bg-hh-800"}`}
      >
        {!!image || type === "flohmarkt" ? (
          <>
            <img
              loading="lazy"
              src={image || "/assets/icons/market.svg"}
              alt={title}
              className="absolute left-0 top-0 object-cover blur-sm w-full h-full"
            />
            <img
              loading="lazy"
              src={image || "/assets/icons/market.svg"}
              alt={title}
              className={`w-full h-full ${imgSize || "object-contain"}`}
            />
          </>
        ) : "laterne" === type ? (
          <div className="h-full aspect-square relative flex justify-center items-center">
            <LaterneImage
              ff={title.includes("Feuerwehr") || title.includes("FF")}
            />
          </div>
        ) : "laternewerkstatt" === type ? (
          <img
            loading="lazy"
            src={"/assets/icons/laterne/basteln.svg"}
            alt={title}
            className={`w-full h-full ${imgSize || "object-contain"}`}
          />
        ) : (
          <>
            {spielgeraete ? (
              <SpielplatzgeraeteBackground
                spList={spielgeraete}
                color="#343b3e"
                size="2rem"
              />
            ) : type === "spielplatz" ? (
              <img
                loading="lazy"
                src={`/assets/spielplatz${parseInt(`${id}`) % 2 ? "" : "2"}.webp`}
                alt={title}
                className={`w-full h-full ${imgSize || "object-contain"}`}
              />
            ) : (
              <CardLogo logo="Indoor" color="#ACBAC8" size="3rem" />
            )}
          </>
        )}
      </div>
      {children}
    </Link>
  );
}

HorizontalCard.FlohmarktInfo = function FlohmarktInfo({
  title,
  date,
  time,
  address,
  stadtteil,
  bezirk,
  endDate,
}: {
  title: string;
  date: number;
  time?: string;
  address: string;
  stadtteil: string;
  endDate?: number;
  bezirk?: string;
}) {
  return (
    <div className="flex flex-col w-2/3 h-full hover:text-hh-950 justify-between gap-1 p-2 pl-0 sm:pr-4 sm:p-2">
      <h3 className="truncate-2 font-semibold text-sm lg:text-base block text-hh-950">
        {title}
      </h3>
      <div className="flex flex-col gap-[2px]">
        <p className="font-semibold italic text-sm lg:text-base text-hh-800 leading-4">
          <span className="float-left flex justify-center items-center h-4 lg:h-6">
            <DateIcon size="0.8rem" color="#33404d" />
          </span>
          {getDate(date)} {endDate && <span>- {getDate(endDate)}</span>}
          {time && <span className="hidden lg:inline text-sm">({time})</span>}
        </p>

        <small className="text-xs font-semibold max-w-full">
          <span className="float-left flex justify-center items-center">
            <StandortIcon size="0.8rem" color="#33404d" />
          </span>
          <span>
            {stadtteil === "Andere Orte"
              ? separateAddress(address).city
              : stadtteil}
          </span>
          <span>{" - "}</span>
          <span>{bezirk}</span>
        </small>
      </div>
    </div>
  );
};

HorizontalCard.PostInfo = function PostInfo({
  title,
  description,
  stadtteil,
}: {
  title: string;
  description: string;
  stadtteil: string;
}) {
  return (
    <div
      className={`cardContent w-3/5 overflow-hidden flex-grow flex justify-center flex-col p-2 ${
        !stadtteil && "md:p-3 lg:p-4"
      }`}
    >
      {stadtteil && (
        <h4 className="text-hh-700 font-semibold text-sm">{stadtteil}</h4>
      )}
      <h2 className="truncate-2 break-words cardTitle font-bold text-sm sm:text-base md:text-lg text-hh-950  break-word max-w-full">
        {title}
      </h2>
      {description && (
        <p className="truncate-2 text-hh-700 italic max-w-full break-words text-sm">
          {description}
        </p>
      )}
    </div>
  );
};
