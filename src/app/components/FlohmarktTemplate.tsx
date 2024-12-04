import { iFlohmarkt, iPost } from "@app/utils/types";
import Link from "next/link";
import React from "react";
import DisplayTypeText from "./@PostForm/DisplayTypeText";
import PostLogo from "./@Icons/@PostLogo/PostLogo";
import UserAvatar from "./UserAvatar";
import {
  getDate,
  getEndTime,
  getStartTime,
  separateAddress,
} from "@app/utils/functions";
import AdminServerComponent from "@app/providers/AdminServerComponents";
import FlohmarktBackground from "./@Icons/@Flohmarkt/FlohmarktBackground";
import Image from "next/image";

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
    endDate,
    type,
  },
  children,
}: {
  flohmarkt: iFlohmarkt;
  children?: React.ReactNode;
  creator?: boolean;
}) {
  const separated = separateAddress(address);
  const { street, number, PLZ, city } = separated;
  const startTime = getStartTime(time);
  const endTime = getEndTime(time);
  const regex = /(.*)\s(<link>)(https?:\/\/[^\s]+)(<\/link>)/;

  const match = optionalComment?.match(regex);
  const linkText = match ? match[1].trim() : null;
  const externalLink = match ? match[3] : null;

  const textWithoutLink = optionalComment?.replace(regex, "").trim();
  const openHoursRegex = /(ÖFFNUNGSZEITEN[\s\S]*?)(?=\n\s*<link>|$)/i;
  const openHours = (textWithoutLink?.match(openHoursRegex) || [])[0]
    ?.replace(/ÖFFNUNGSZEITEN/i, "")
    .trim();
  const description = textWithoutLink?.replace(openHoursRegex, "").trim();
  const attribution = optionalComment?.match(
    /<attribution>([\s\S]*?)<attribution>/
  )?.[1];

  return (
    <>
      {children}
      <section
        className={`w-full ${
          image ? "max-w-[1200px]" : "max-w-[800px]"
        } ${type === "laterne" ? "bg-gradient-to-b from-hh-950 to-hh-800 w-full" : "bg-hh-100"} rounded sm:rounded-lg p-4 sm:px-6 relative overflow-hidden flex flex-col gap-4`}
      >
        <div className="flex justify-between items-center gap-4 w-full">
          <Link
            href={
              type
                ? ["laterne", "laternewerkstatt"].includes(type)
                  ? "/laternenumzuege"
                  : ["weihnachtsmarkt", "adventsevent"].includes(type)
                    ? "/weihnachtszeit"
                    : "/events"
                : "/flohmaerkte"
            }
            className="text-sm text-hh-700 px-2 py-1 hover:no-underline hover:underline-offset-0 min-w-fit"
          >
            ← Alle
            {type
              ? ["laterne", "laternewerkstatt"].includes(type)
                ? " Laternenumzüge"
                : ["weihnachtsmarkt", "adventsevent"].includes(type)
                  ? " Adventsveranstaltungen"
                  : " Events"
              : " Flohmärkte"}
          </Link>
          <div
            id="categories"
            className="flex justify-end gap-1 h-fit flex-wrap"
          >
            <AdminServerComponent>
              <Link
                className="px-2 py-1 h-fit leading-tight rounded-md align-middle font-semibold bg-transparent transition-all text-hh-700 hover:text-white hover:bg-hh-700"
                href={`/bezirke/${encodeURIComponent(bezirk)}`}
              >
                {bezirk}
              </Link>
            </AdminServerComponent>
          </div>
        </div>
        <div className="flex gap-4 flex-wrap justify-center  w-full min-h-[40vh] ">
          {!!image && (
            <aside
              key={image}
              className="min-w-[300px] max-w-[400px] md:w-1/3 lg:w-1/2 w-full h-fit  p-4 bg-hh-800 rounded-md flex flex-col items-center"
            >
              <img
                loading="lazy"
                src={image}
                alt={title}
                className="w-full h-auto object-cover rounded-md"
              />
              {attribution && (
                <Link
                  href={attribution}
                  className="text-hh-400 hover:underline hover:underline-offset-2 italic text-[0.5rem] flex flex-wrap gap-1 items-center"
                >
                  <span>Entworfen von:</span>
                  <span>{attribution}</span>
                </Link>
              )}
            </aside>
          )}
          <section className="w-full md:w-1/2 flex-grow flex flex-col justify-between pb-4 gap-4">
            <div className="relative w-full flex-grow flex flex-col">
              {type && ["laterne", "laternewerkstatt"].includes(type) && (
                <div className="absolute top-0 left-0 w-full h-full opacity-50 -z-1">
                  <Image
                    style={{ left: "-6px" }}
                    fill
                    src={"/assets/icons/laterne/stars.svg"}
                    alt="stars"
                    className="min-w-[1200px] max-h-[150px] bg-opacity-25 rounded-lg opacity-50 -z-1"
                  />
                </div>
              )}
              <div
                id="flohmarkt-hero"
                className={`w-full p-4 ${!image && "sm:px-10 pt-4 md:px-16 md:pb-10 "} mb-4 rounded-md ${type === "laterne" ? "text-hh-100" : "bg-hh-50"} min-h-[50%] ${!image && "max-w-[640px]"} mx-auto flex-grow overflow-hidden flex flex-col gap-4`}
              >
                <h1 className="text-3xl md:text-4xl text-center font-bold break-words mt-2">
                  {title}
                </h1>
                {optionalComment && (
                  <div className="h-[calc(100%-4rem)] relative">
                    {!type && (
                      <div className="absolute top-0 left-0 w-full h-full flex-grow overflow-hidden bg-hh-100 bg-opacity-50 rounded-md flex flex-wrap opacity-20">
                        {Array(4)
                          .fill(0)
                          .map((_, i) => (
                            <div
                              className="w-1/2 h-1/2 min-h-[300px] flex justify-center items-center"
                              key={i}
                            >
                              <FlohmarktBackground />
                            </div>
                          ))}
                      </div>
                    )}
                    <div id="optional-comment-box" className="max-w-full">
                      <DisplayTypeText
                        text={description || optionalComment}
                        type="paragraph"
                      />
                    </div>
                  </div>
                )}
                {openHours && (
                  <div className="relative border-2 border-hh-800 rounded p-2 md:px-4 mx-auto min-w-[280px] max-w-full">
                    <div className="absolute right-2 top-2">
                      <PostLogo logo="clock" color="#1F262E" size="1.25rem" />
                    </div>
                    <h3 className="font-semibold">Öffnungszeiten:</h3>
                    <DisplayTypeText text={openHours} type="paragraph" />
                  </div>
                )}
              </div>
              {externalLink && (
                <div
                  id="external-link"
                  className={` ${image ? "w-full" : "max-w-full md:max-w-[600px] md:w-fit break-words"} mx-auto h-fit mb-4 p-4 rounded bg-hh-800 text-hh-100`}
                >
                  <h3 className="font-semibold">
                    {linkText || "Externer Link:"}
                  </h3>
                  <Link
                    href={externalLink}
                    className="block font-semibold italic hover:underline hover:underline-offset-2 text-hh-200 hover:text-hh-300 active:text-hh-50"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {externalLink}
                  </Link>
                </div>
              )}
              <div
                id="location-date"
                className="flex flex-col sm:flex-row flex-wrap flex-grow justify-stretch items-stretch gap-2 w-fit sm:w-full max-w-[800px] mx-auto rounded  text-hh-950"
              >
                <div
                  id="location"
                  className={`flex flex-col w-fit sm:w-full sm:max-w-[calc(50%-4px)] justify-stretch rounded bg-hh-300 ${type === "laterne" ? "bg-opa75" : "bg-opacity-25"} py-2 px-4`}
                >
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
                    <div className="ml-6 flex gap-1 items-center">
                      {/* <PostLogo logo="stadtteil" color="#1F262E" /> */}
                      <p
                        id="stadtteil"
                        className="ml-1 block font-semibold italic hover:underline hover: underline-offset-2"
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
                      {Object.values(separated).some(Boolean) ? (
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
                      ) : (
                        <Link
                          href={
                            "https://www.google.com/maps/place/" +
                            address.split(/[ \.\-\,]+/gi).join("+")
                          }
                          className="italic hover:underline hover:underline-offset-2 flex flex-col flex-grow"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <span className="block font-semibold">
                            {location}
                          </span>
                          <span className="flex flex-wrap gap-1">
                            {address}
                          </span>
                        </Link>
                      )}
                    </div>
                  )}
                </div>
                <div
                  id="date"
                  className={`w-full sm:max-w-[calc(50%-4px)] min-h-fit py-2 px-4 rounded bg-hh-300 ${type === "laterne" ? "bg-opa75" : "bg-opacity-25"}`}
                >
                  <h2 className="text-lg font-semibold">Datum:</h2>
                  <div className="flex flex-col gap-1">
                    <div className="flex gap-1 flex-wrap">
                      <PostLogo logo="date" color="#1F262E" />
                      <time
                        dateTime={new Date(date).toLocaleDateString()}
                        className="block font-semibold"
                      >
                        {getDate(date)} {endDate && ` - ${getDate(endDate)}`}
                      </time>
                    </div>
                    {!openHours && time && (
                      <div className="flex gap-1 items-center">
                        <div className="px-[2px]">
                          <PostLogo
                            logo="clock"
                            color="#1F262E"
                            size="1.25rem"
                          />
                        </div>
                        <h3 className="block font-semibold">
                          {startTime && <span>{startTime}</span>}
                          {endTime && <span> - {endTime}</span>}
                          {" Uhr"}
                        </h3>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            {process.env.ADMIN_EMAIL !== addedBy.email && (
              <div id="addedBy" className="w-fit px-4 lg:ml-auto self-end">
                <h2 className="text-lg font-semibold">Hinzugefügt von:</h2>
                <div className="flex items-center justify-end transition-all">
                  <UserAvatar
                    avatar={addedBy.image}
                    name={addedBy.name}
                    email={addedBy.email}
                    link={`/posts/suggestedBy/${addedBy.email}`}
                  />
                  <p className="addedByName hidden">{addedBy.name}</p>
                </div>
              </div>
            )}
          </section>
        </div>
      </section>
    </>
  );
}
