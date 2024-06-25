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
}: {
  id: number;
  title: string;
  address: string;
  date: number;
}) {
  return (
    <Popup className="font-sans">
      <Link
        href={`/flohmaerkte/${id}`}
        className="font-semibold text-base block"
      >
        {title}
      </Link>
      <small className="font-semibold italic">{getDate(date)}</small>
      <p className="text-xs">{address}</p>
    </Popup>
  );
}
