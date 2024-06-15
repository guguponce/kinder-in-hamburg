"use client";
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
  address: string;
}) {
  return (
    <Popup className="font-sans" keepInView={true} maxWidth={200}>
      <Link
        href={"/spielplaetze/" + id}
        className="font-semibold text-base block"
      >
        {title}
      </Link>

      <small className="text-sm font-bold capitalize block">
        {type?.join(" / ") || ""}
      </small>
      {spielgeraete && (
        <small className="text-xs font-semibold italic  capitalize block">
          {spielgeraete.slice(0, 8).join(" - ") || ""}
          {spielgeraete.length > 8 ? "..." : ""}
        </small>
      )}
      {address && <p className="text-xs">{address}</p>}
    </Popup>
  );
}
