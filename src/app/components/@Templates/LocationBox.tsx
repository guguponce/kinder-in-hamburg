import React from "react";
import PostLogo from "../@Icons/@PostLogo/PostLogo";
import Link from "next/link";
import { iAddress } from "@app/utils/types";
import BezirkIcon from "../@Icons/@BezirkIcon/BezirkIcon";

export default function LocationBox({
  bezirk,
  stadtteil,
  address,
}: {
  bezirk?: string;
  stadtteil?: string;
  address?: iAddress;
}) {
  const addressQuery = address
    ? Object.values(address)
        .map((part) => part.replace(" ", "+"))
        .join("+")
    : "";
  const { number } = address || { number: "" };

  return (
    <div
      id="location"
      className="relative flex w-full max-w-[400px] h-fit rounded text-white bg-hh-700 bg-opacity-75 py-2 px-4"
    >
      <div className="flex flex-col justify-between flex-grow max-w-[66%]">
        <h2 className="text-lg font-semibold">Standort:</h2>
        {bezirk && (
          <div className="flex gap-1 items-center">
            <PostLogo logo="hamburg" color="#fefefe" />
            <Link
              href={`/bezirke/${encodeURIComponent(bezirk)}`}
              id="bezirk"
              className="block font-semibold italic hover:underline hover:underline-offset-2"
            >
              {bezirk}
            </Link>
          </div>
        )}
        {!!stadtteil && (
          <div className="ml-6 flex gap-1 items-center">
            {/* <PostLogo logo="stadtteil" color="#1F262E" /> */}
            <p id="stadtteil" className="ml-1 block font-semibold italic">
              {stadtteil}
            </p>
          </div>
        )}

        <section id="location" className="flex gap-[6px] ml-[2px]">
          <div className="min-w-5 mt-1">
            <PostLogo logo="map" color="#fefefe" size="20px" />
          </div>
          <Link
            href={"https://www.google.com/maps/place/" + addressQuery}
            className="italic hover:underline hover:underline-offset-2 flex flex-col flex-grow"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="flex flex-wrap gap-1">
              <span className="block">
                {address?.street}
                {number && parseInt(number) > 0 && " " + number},
              </span>
              <span className="block">
                {address?.PLZ} {address?.city}
              </span>
            </span>
          </Link>
        </section>
      </div>
      {bezirk && (
        <div className="absolute right-4 h-full aspect-square w-32 top-0 flex justify-center items-center">
          <BezirkIcon bezirk={bezirk} />
        </div>
      )}
    </div>
  );
}
