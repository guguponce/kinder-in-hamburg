"use client";
import StandortIcon from "@components/@Icons/StandortIcon";
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
  distance,
  icon,
}: {
  icon?: React.JSX.Element;
  image?: string;
  distance?: number;
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
          {address && (
            <div className="mt-auto flex items-center gap-1">
              {icon || <StandortIcon color="#0078A8" />}
              <p className="text-xs m-0 font-sans">{joinAddress(address)}</p>
              {distance && (
                <h4 className="text-sm font-semibold flex flex-col items-center px-1 border-2 border-[#0078A8] rounded-sm min-w-fit">
                  <span className="block">
                    {distance > 500
                      ? (distance / 1000).toFixed(2) + "km"
                      : distance.toFixed(0) + "m"}
                  </span>{" "}
                  <span className="block text-[10px]">entfernt</span>
                </h4>
              )}
            </div>
          )}
        </div>
      </div>
    </Popup>
  );
}
