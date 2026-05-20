import {
  cn,
  getDate,
  getEndTime,
  getStartTime,
  separateAddress,
} from "@app/utils/functions";
import PostLogo from "./@Icons/@PostLogo/PostLogo";
import Link from "next/link";

export default function LocationDate({
  address,
  date,
  time,
  image,
  endDate,
  location,
  bezirk,
  stadtteil,
  type,
  openHours,
}: {
  image?: string;
  address: string;
  date: number;
  time?: string;
  endDate?: number;
  location?: string;
  bezirk?: string;
  stadtteil?: string;
  type?: string;
  openHours?: string;
}) {
  if (!address || !date) return null;
  if (typeof address !== "string") {
    return null;
  }

  const separated = separateAddress(address);
  const { street, number, PLZ, city } = separated;
  const startTime = getStartTime(time);
  const endTime = getEndTime(time);
  return (
    <>
      <div
        id="date"
        className={cn(
          "w-full sm:max-w-[calc(50%-4px)] min-h-fit py-2 px-4 rounded bg-hh-50 bg-opacity-75 -outline-offset-4 outline outline-4 outline-hh-300",
          !!image && "md:max-w-full",
          type === "laterne" || type === "laternewerkstatt"
            ? "border-0 bg-hh-300"
            : "",
        )}
      >
        <h2 className="text-lg font-semibold">Datum:</h2>
        <div className="flex flex-col gap-1">
          <div className="flex gap-1 flex-wrap">
            <PostLogo logo="date" color="#2a4150" />
            <time
              dateTime={new Date(date).toLocaleDateString()}
              className="block font-semibold"
            >
              {getDate(date, endDate ? false : "short", false, !endDate)}{" "}
              {endDate && ` - ${getDate(endDate)}`}
            </time>
          </div>
          {!openHours && time && (
            <div className="flex gap-1 items-center">
              <div className="px-[2px]">
                <PostLogo logo="clock" color="#2a4150" size="1.25rem" />
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
      <div
        id="location"
        className={`flex flex-col w-fit sm:w-full sm:max-w-[calc(50%-4px)] ${!!image && "md:max-w-full"} justify-stretch rounded bg-hh-50 bg-opacity-75 -outline-offset-4 outline outline-4 outline-hh-300 ${type === "laterne" || type === "laternewerkstatt" ? "bg-opacity-75" : "bg-opacity-25"} py-2 px-4`}
      >
        <h2 className="text-lg font-semibold">Standort:</h2>
        {bezirk && (
          <div className="flex gap-1">
            <PostLogo logo="hamburg" color="#2a4150" />
            <div className="flex flex-wrap flex-grow gap-x-1">
              {!!stadtteil && stadtteil !== "Andere Orte" && (
                <p id="stadtteil" className="ml-1 block font-semibold italic">
                  {stadtteil + ", "}
                </p>
              )}
              <Link
                href={`/bezirke/${encodeURIComponent(bezirk)}`}
                id="bezirk"
                className="block font-semibold italic hover:underline hover:underline-offset-2"
              >
                {bezirk}
              </Link>
            </div>
          </div>
        )}
        {!!address && (
          <div className="flex gap-[6px] ml-[2px]">
            <div className="min-w-5 mt-1">
              <PostLogo logo="map" color="#2a4150" size="20px" />
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
                <span className="block font-semibold">{location}</span>
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
                <span className="block font-semibold">{location}</span>
                <span className="flex flex-wrap gap-1">{address}</span>
              </Link>
            )}
          </div>
        )}
      </div>
    </>
  );
}
