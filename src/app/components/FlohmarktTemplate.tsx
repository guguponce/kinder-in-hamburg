import type { iFlohmarkt } from "@app/utils/types";
import Link from "next/link";
import React from "react";
import DisplayTypeText from "./@PostForm/DisplayTypeText";
import PostLogo from "./@Icons/@PostLogo/PostLogo";
import AdminServerComponent from "@app/providers/AdminServerComponents";
import FlohmarktBackground from "./@Icons/@Flohmarkt/FlohmarktBackground";
import PageTitle from "./PageTitle";
import { SharingButton } from "./@Buttons/SharingButtons/SharingButton";
import LocationDate from "./LocationDate";

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
  const openHoursRegex = /(ÖFFNUNGSZEITEN[\s\S]*?)(?=\n\s*<link>|$)/i;
  const openHours = (optionalComment?.match(openHoursRegex) || [])[0]
    ?.replace(/ÖFFNUNGSZEITEN/i, "")
    .trim();
  const description = optionalComment?.replace(openHoursRegex, "").trim();
  const attribution = optionalComment?.match(
    /<attribution>([\s\S]*?)<attribution>/,
  )?.[1];
  return (
    <>
      {children}
      <section
        id="flohmarkt-template"
        className={`w-full ${
          image ? "max-w-[1000px]" : "max-w-[800px]"
        } ${type === "laterne" || type === "laternewerkstatt" ? "bg-gradient-to-b from-hh-950 to-hh-800 w-full" : "bg-hh-100"} rounded sm:rounded-lg p-2 sm:px-4 relative overflow-hidden flex flex-col gap-2`}
      >
        <aside className="flex justify-between items-center gap-4 w-full">
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
              <SharingButton />
            </AdminServerComponent>
          </div>
        </aside>
        <div
          id={!!image ? "FT-Grid" : "FT-Flex"}
          className="w-full min-h-[40vh]"
        >
          {!!image && (
            <aside
              key={image}
              id="FT-image"
              className="min-w-[300px] max-w-[400px] w-full h-fit mx-auto p-4 bg-hh-800 rounded-md flex flex-col items-center"
            >
              <img
                loading="lazy"
                src={image}
                alt={title}
                className="w-full h-auto object-cover rounded-md"
              />
              {attribution &&
                (attribution.includes("www") ? (
                  <Link
                    href={attribution}
                    className="text-hh-400 hover:underline hover:underline-offset-2 italic text-[0.5rem] flex flex-wrap gap-1 items-center"
                  >
                    <span>© Bild von:</span>
                    <span>{attribution}</span>
                  </Link>
                ) : (
                  <small className="text-hh-400 italic text-[0.5rem] flex flex-wrap gap-1 items-center">
                    © Bild von: {attribution}
                  </small>
                ))}
            </aside>
          )}

          <div
            id="flohmarkt-hero"
            className={`relative w-full p-4 ${!image && "sm:px-10 pt-4 md:px-16 md:pb-10 "} mb-4 rounded-md ${type === "laterne" || type === "laternewerkstatt" ? "text-hh-100" : "bg-hh-50"} min-h-[50%] ${!image && "max-w-[640px]"} mx-auto flex-grow overflow-hidden flex flex-col gap-4`}
          >
            {" "}
            {type && ["laterne", "laternewerkstatt"].includes(type) && (
              <div className="absolute top-0 left-2 w-full h-full opacity-50 -z-1">
                <img
                  src="/assets/icons/laterne/stars.svg"
                  alt="*"
                  style={{ left: "-6px", position: "absolute" }}
                  className="min-w-[1200px] max-h-[150px] bg-opacity-25 rounded-lg opacity-50 -z-1"
                />
              </div>
            )}
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
            <PageTitle
              title={title}
              className="text-hh-50 lg:mb-2"
              textShadow="0 0 16px #40607a80, 0px 0px 16px #40607adb, 2px 2px 8px #40607adb, 2px 2px 4px #40607adb"
            />
            <div
              id="location-date"
              className="flex flex-col sm:flex-row md:hidden flex-wrap flex-grow  items-stretch gap-2 w-fit sm:w-full max-w-[800px] mx-auto rounded  text-hh-950"
            >
              <LocationDate
                address={address}
                date={date}
                time={time}
                image={image}
                endDate={endDate}
                bezirk={bezirk}
                stadtteil={stadtteil}
                location={location}
              />
            </div>
            {optionalComment && (
              <div className="h-[calc(100%-4rem)] relative">
                <div id="optional-comment-box" className="max-w-full">
                  <DisplayTypeText
                    text={description || optionalComment}
                    type="paragraph"
                    className={
                      type === "laterne" || type === "laternewerkstatt"
                        ? "text-hh-50"
                        : "text-hh-900"
                    }
                    linkClassName={
                      type === "laterne" || type === "laternewerkstatt"
                        ? "text-hh-200 hover:text-hh-100 focus:outline-hh-100 active:text-hh-300"
                        : ""
                    }
                  />
                </div>
              </div>
            )}
            {openHours && (
              <div className="relative border-2 border-hh-800 rounded p-2 md:px-4 mx-auto min-w-[280px] max-w-full">
                <div className="absolute right-2 top-2">
                  <PostLogo logo="clock" color="#2a4150" size="1.25rem" />
                </div>
                <h3 className="font-semibold">Öffnungszeiten:</h3>
                <DisplayTypeText text={openHours} type="paragraph" />
              </div>
            )}
          </div>

          <div
            id="location-date"
            className="hidden md:flex flex-wrap flex-grow  items-stretch gap-2 w-fit sm:w-full max-w-[800px] mx-auto rounded  text-hh-950"
          >
            <LocationDate
              address={address}
              date={date}
              time={time}
              image={image}
              endDate={endDate}
              bezirk={bezirk}
              stadtteil={stadtteil}
              location={location}
            />
          </div>
          {/* {externalLink && (
            <div
              id="external-link"
              className={` ${image ? "w-full" : "max-w-full md:max-w-[600px] md:w-fit break-words"} mx-auto h-fit mb-4 p-4 rounded bg-hh-800 text-hh-100 text-base`}
            >
              <h3 className="font-semibold">{linkText || "Externer Link:"}</h3>
              <Link
                href={externalLink}
                className="block font-semibold italic hover:underline hover:underline-offset-2 text-hh-200 hover:text-hh-300 active:text-hh-50 text-sm break-words truncate-1"
                target="_blank"
                rel="noopener noreferrer"
              >
                {externalLink}
              </Link>
            </div>
          )} */}
        </div>
        {/* {process.env.ADMIN_EMAIL !== addedBy.email && (
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
        )} */}
      </section>
    </>
  );
}
