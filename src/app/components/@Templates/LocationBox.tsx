import React from "react";
import PostLogo from "../@Icons/@PostLogo/PostLogo";
import Link from "next/link";
import { iAddress } from "@app/utils/types";
import BezirkIcon from "../@Icons/@BezirkIcon/BezirkIcon";
import { getServerUser } from "@app/api/auth/supabaseAuth";
import { cn } from "@app/utils/functions";

export default async function LocationBox({
  bezirk,
  stadtteil,
  address,
  dark = false,
  className,
}: {
  bezirk?: string;
  stadtteil?: string;
  address?: iAddress;
  dark?: boolean;
  className?: string;
}) {
  const user = await getServerUser();
  const addressQuery = address
    ? Object.values(address)
        .map((part) => part.replace(" ", "+"))
        .join("+")
    : "";
  const { number } = address || { number: "" };

  return (
    <div
      id="location"
      className={cn(
        "relative flex xs:min-w-72 w-fit max-w-full h-fit mx-auto rounded p-2 gap-2",
        dark ? "text-hh-50" : "text-hh-800",
        className
      )}
    >
      <div className="flex flex-col justify-between flex-grow max-w-[66%] break-words">
        <h2 className="text-lg font-semibold">Standort:</h2>
        {bezirk && (
          <div className="flex gap-1 items-center">
            <PostLogo logo="hamburg" color={dark ? "#fefefe" : "#33404d"} />
            {!!user ? (
              <Link
                href={`/bezirke/${encodeURIComponent(bezirk)}`}
                id="bezirk"
                className="block font-semibold italic hover:underline hover:underline-offset-2"
              >
                {bezirk}
              </Link>
            ) : (
              <h3 className="block font-semibold italic ">{bezirk}</h3>
            )}
          </div>
        )}
        {!!stadtteil && (
          <div className="ml-6 flex gap-1 items-center">
            {/* <PostLogo logo="stadtteil" color="#343b3e" /> */}
            <p id="stadtteil" className="ml-1 block font-semibold italic">
              {stadtteil}
            </p>
          </div>
        )}

        <section id="location" className="flex gap-[6px] ml-[2px]">
          <div className="min-w-5 mt-1">
            <PostLogo
              logo="map"
              color={dark ? "#fefefe" : "#33404d"}
              size="20px"
            />
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
        // ---------
        <div
          className={`hidden xs:flex absolute right-0 h-full aspect-square -translate-y-1/2 top-1/2 w-28 justify-center items-center`}
        >
          <BezirkIcon bezirk={bezirk} color={dark ? "#fefefe" : "#33404D"} />
        </div>
      )}
    </div>
  );
}
