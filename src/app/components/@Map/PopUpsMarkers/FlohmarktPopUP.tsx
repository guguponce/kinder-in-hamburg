"use client";
import StandortIcon from "@app/components/@Icons/StandortIcon";
import { getDate } from "@app/utils/functions";
import Link from "next/link";
import React from "react";
import { Popup } from "react-leaflet";

export default function FlohmarktPopUP({
  id,
  title,
  address,
  date,
  image,
  endDate,
  type = "flohmaerkte",
}: {
  image?: string;
  id: number;
  title: string;
  address: string;
  date: number;
  endDate?: number;
  type?: "flohmaerkte" | "events";
}) {
  return (
    <Popup className="font-sans">
      <div className="flex justify-stretch gap-2 ">
        {image && (
          <div className="w-16 h-24">
            <img
              src={image}
              alt={title}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <div className="flex-1">
          <Link
            href={`/${type}/${id}`}
            className="font-semibold text-base block"
          >
            {title}
          </Link>
          <div className="flex gap-1 items-center font-sans">
            {/* <PostLogo logo="date" color="#1F262E" /> */}
            <small className="font-semibold italic">
              <span className="not-italic">📅 </span>
              {endDate ? "Vom " : "Am "}
              {getDate(date)}
              {endDate ? ` bis ${getDate(endDate)}` : ""}
            </small>
          </div>
          <div className="flex gap-1 items-center font-sans">
            <StandortIcon size="1rem" color="#343b3e" />
            <p className="text-xs">{address}</p>
          </div>
        </div>
      </div>
    </Popup>
  );
}
