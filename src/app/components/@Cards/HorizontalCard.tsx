import { iCard } from "@app/utils/types";
import Link from "next/link";
import React from "react";
import CardLogo from "../@Icons/CardLogo";
import dynamic from "next/dynamic";
import { addressWithoutCity, getDate } from "@app/utils/functions";

const SpielplatzgeraeteBackground = dynamic(
  () => import("../SpielplatzgeraeteBackground"),
  { ssr: false }
);

interface iHorizontalCard {
  type?: "spielplatz" | "flohmarkt" | "post";
  id: string | number;
  title: string;
  image?: string;
  link?: string;
  spielgeraete?: string[];
  children: React.ReactNode;
}

export default function HorizontalCard({
  type = "spielplatz",
  id,
  title,
  image,
  link,
  spielgeraete,
  children,
}: iHorizontalCard) {
  return (
    <Link
      aria-label={`Explore ${title}`}
      href={link || `/flohmaerkte/${id}`}
      className="HorizontalCard w-full h-32 sm:flex-grow justify-center flex gap-2 items-center bg-white text-hh-900 rounded-md overflow-hidden hover:shadow-md"
    >
      <>
        <div
          className={`cardImage h-full aspect-square min-w-1/3 w-1/3 bg-hh-50 overflow-hidden flex justify-center items-center ${
            spielgeraete && "bg-opacity-5"
          } ${!image && "p-2"}`}
        >
          {!!image || type === "flohmarkt" ? (
            <img
              loading="lazy"
              src={image || "/assets/icons/market.svg"}
              alt={title}
              className={`w-full h-full object-contain`}
            />
          ) : (
            <>
              {spielgeraete ? (
                <SpielplatzgeraeteBackground
                  spList={spielgeraete}
                  color="#1F262E"
                  size="2rem"
                />
              ) : (
                <CardLogo logo="Indoor" color="#ACBAC8" size="3rem" />
              )}
            </>
          )}
        </div>
        {children}
      </>
    </Link>
  );
}

HorizontalCard.FlohmarktInfo = function FlohmarktInfo({
  title,
  date,
  time,
  address,
  stadtteil,
}: {
  title: string;
  date: number;
  time?: string;
  address: string;
  stadtteil: string;
}) {
  return (
    <div className="flex flex-col w-2/3 h-full hover:text-hh-950 justify-between gap-2  p-2 pl-0 sm:pr-4 sm:p-2">
      <span className="truncate-2 font-semibold text-base block text-hh-950">
        {title}
      </span>
      <div className="flex flex-col">
        <small className="font-semibold italic">
          {getDate(date)} ({time})
        </small>
        <p className="text-xs">
          {addressWithoutCity(address)} {stadtteil}
        </p>
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
      <h2 className="truncate-2 break-words cardTitle font-bold text-sm sm:text-md md:text-lg text-hh-950  break-word max-w-full text-md sm:text-base">
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
