import { iFlohmarkt, iPost } from "@app/utils/types";
import Link from "next/link";
import React from "react";
import DisplayTypeText from "./@PostForm/DisplayTypeText";
import PostLogo from "./@Icons/PostLogo";
import UserAvatar from "./UserAvatar";
import {
  getDate,
  getEndTime,
  getStartTime,
  separateAddress,
} from "@app/utils/functions";

export default function FlohmarktTemplate({
  flohmarkt: {
    title,
    bezirk,
    addedBy,
    date,
    address,
    image,
    location,
    time,
    optionalComment,
    stadtteil,
  },
  creator,
  children,
}: {
  flohmarkt: iFlohmarkt;
  children?: React.ReactNode;
  creator?: boolean;
}) {
  const { street, number, PLZ, city } = separateAddress(address);
  const startTime = getStartTime(time);
  const endTime = getEndTime(time);

  return (
    <>
      {children}
      <main
        className={`w-full ${
          image ? "max-w-[1200px]" : "max-w-[800px]"
        } bg-hh-100 sm:rounded-lg p-6 relative flex flex-col items-center gap-4`}
      >
        <div className="flex justify-between items-center gap-4 w-full">
          <Link
            href={creator ? "/dashboard" : "/flohmaerkte"}
            className="text-sm text-hh-700 px-2 py-1 hover:underline hover:underline-offset-4 min-w-fit"
          >
            ← {creator ? "Dashboard" : "All Flea Markets"}
          </Link>
          <div
            id="categories"
            className="flex justify-end gap-1 h-fit flex-wrap"
          >
            <Link
              className="px-2 py-1 h-fit leading-tight rounded-md align-middle font-semibold bg-transparent transition-all text-hh-700 hover:text-white hover:bg-hh-700"
              href={`/bezirke/${encodeURIComponent(bezirk)}`}
            >
              {bezirk}
            </Link>
          </div>
        </div>
        <div className="flex gap-4 flex-wrap justify-center  w-full min-h-[40vh] ">
          {!!image && (
            <aside
              key={image}
              className="min-w-[300px] max-w-[400px] md:w-1/2 w-full h-fit  p-4 bg-hh-800 my-4 rounded-md"
            >
              <img
                src={image}
                alt={title}
                className="w-full h-auto object-cover rounded-md"
              />
            </aside>
          )}
          <section className="w-full md:w-1/2 flex-grow flex flex-col justify-between">
            <div className="w-full">
              <div
                id="flohmarkt-hero"
                className="w-full p-4 my-4 rounded-md bg-hh-50 "
              >
                <h1 className="text-4xl text-center font-bold">{title}</h1>

                {optionalComment && (
                  <div className="mt-4">
                    <DisplayTypeText text={optionalComment} type="paragraph" />
                  </div>
                )}
              </div>

              <div className="flex flex-wrap justify-between gap-2 w-full max-w-[800px] mx-auto">
                <div
                  id="location"
                  className="flex flex-col w-full max-w-[calc(50%-4px)]"
                >
                  <div className="w-full pl-4 my-2">
                    <h2 className="text-lg font-semibold">Standort:</h2>
                    {bezirk && (
                      <div className="flex gap-1 items-center">
                        <PostLogo logo="hamburg" color="#1F262E" />

                        <Link
                          href={`/bezirke/${encodeURIComponent(bezirk)}`}
                          id="bezirk"
                          className="block font-semibold italic hover:underline hover: underline-offset-2"
                        >
                          {bezirk}
                        </Link>
                      </div>
                    )}
                    {!!stadtteil && (
                      <div className="flex gap-1 items-center">
                        <PostLogo logo="stadtteil" color="#1F262E" />
                        <p
                          id="stadtteil"
                          className="block font-semibold italic hover:underline hover: underline-offset-2"
                        >
                          {stadtteil}
                        </p>
                      </div>
                    )}
                    {!!address && (
                      <div className="flex gap-[6px] ml-[2px]">
                        <div className="min-w-5 mt-1">
                          <PostLogo logo="map" color="#1F262E" size="20px" />
                        </div>
                        <Link
                          href={
                            "https://www.google.com/maps/place/" +
                            street +
                            "+" +
                            number +
                            "+" +
                            PLZ +
                            "+" +
                            city
                          }
                          className="italic hover:underline hover:underline-offset-2 flex flex-col flex-grow"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <span className="block font-semibold">
                            {location}
                          </span>
                          <span className="flex flex-wrap gap-1">
                            <span className="block">
                              {street} {number},
                            </span>
                            <span className="block">
                              {PLZ} {city}
                            </span>
                          </span>
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
                <div
                  id="date"
                  className="w-full max-w-[calc(50%-4px)] px-4 my-2"
                >
                  <h2 className="text-lg font-semibold">Datum:</h2>
                  <div className="flex flex-wrap gap-1 items-center">
                    <div className="flex gap-1 flex-wrap">
                      <PostLogo logo="date" color="#1F262E" />
                      <h3 className="block font-semibold">{getDate(date)}</h3>
                    </div>
                    {time && (
                      <h3 className="block font-semibold">
                        {"("}
                        {startTime && <span>{startTime}</span>}
                        {endTime && <span> - {endTime}</span>}
                        {" Uhr)"}
                      </h3>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div id="addedBy" className="w-full px-4 mb-2 mt-auto lg:ml-auto">
              <h2 className="text-lg font-semibold">Hinzugefügt von:</h2>
              <div className="flex items-center transition-all">
                <UserAvatar
                  avatar={addedBy.image}
                  name={addedBy.name}
                  email={addedBy.email}
                  link={`/posts/suggestedBy/${addedBy.email}`}
                />
                <p className="addedByName hidden">{addedBy.name}</p>
              </div>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
