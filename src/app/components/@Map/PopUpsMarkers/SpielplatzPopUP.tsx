"use client";
import StandortIcon from "@app/components/@Icons/StandortIcon";
import Link from "next/link";
import React from "react";
import { Popup } from "react-leaflet";

export default function SpielplatzPopUP({
  title,
  id,
  type,
  spielgeraete,
  address,
}: {
  title: string;
  id: number;
  type: string[];
  spielgeraete: string[];
  address?: string;
}) {
  return (
    <Popup className="font-sans" keepInView={true} maxWidth={200}>
      <Link
        href={"/spielplaetze/" + id}
        className="font-semibold text-sm sm:text-base block"
      >
        {title}
      </Link>

      <small className="text-xs font-semibold capitalize block">
        {type?.join(" / ") || ""}
      </small>
      {spielgeraete && (
        <small className="font-semibold italic  capitalize block">
          <span className="sm:hidden inline">
            {spielgeraete.slice(0, 5).join(" - ") || ""}
            {spielgeraete.length > 5 ? "..." : ""}
          </span>
          <span className="hidden sm:inline">
            {spielgeraete.slice(0, 8).join(" - ") || ""}
            {spielgeraete.length > 8 ? "..." : ""}
          </span>
        </small>
      )}
      {address && (
        <div className="mt-auto flex items-center gap-1">
          {" "}
          <StandortIcon color="#0078A8" />
          <p className="text-xs m-0 font-sans">{address}</p>
        </div>
      )}
    </Popup>
  );
}
