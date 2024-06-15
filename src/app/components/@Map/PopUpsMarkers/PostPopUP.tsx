"use client";
import { joinAddress } from "@app/utils/functions";
import { iAddress } from "@app/utils/types";
import Link from "next/link";
import React from "react";
import { Popup } from "react-leaflet";

export default function PostPopUP({
  id,
  title,
  categories,
  address,
}: {
  id: number;
  title: string;
  categories: string[];
  address: iAddress;
}) {
  return (
    <Popup className="font-sans">
      <Link href={`/posts/${id}`} className="font-semibold text-base block">
        {title}
      </Link>
      <small className="font-semibold italic">{categories.join(" - ")}</small>
      <p className="text-xs">{joinAddress(address)}</p>
    </Popup>
  );
}
