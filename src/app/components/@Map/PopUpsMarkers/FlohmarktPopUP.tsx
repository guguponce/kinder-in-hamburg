"use client";
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
}: {
  image?: string;
  id: number;
  title: string;
  address: string;
  date: number;
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
            href={`/flohmaerkte/${id}`}
            className="font-semibold text-base block"
          >
            {title}
          </Link>
          <small className="font-semibold italic">{getDate(date)}</small>

          <p className="text-xs">{address}</p>
        </div>
      </div>
    </Popup>
  );
}
