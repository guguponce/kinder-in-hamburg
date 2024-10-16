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
  image,
}: {
  image?: string;
  id: number;
  title: string;
  categories: string[];
  address: iAddress;
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
          <Link href={`/posts/${id}`} className="font-semibold text-base block">
            {title}
          </Link>
          <small className="font-semibold italic">
            {categories.join(" - ")}
          </small>
          <p className="text-xs">{joinAddress(address)}</p>
        </div>
      </div>
    </Popup>
  );
}
