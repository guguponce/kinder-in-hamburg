"use client";
import {
  clearLatLonFromFlohmarkt,
  clearLatLonFromPost,
} from "@app/api/dbActions";
import { clearLatLonFromSpielplatz } from "@app/api/spActions";
import React from "react";

export default function ClearLatLonButton({
  type,
  id,
}: {
  type: "flohmarkt" | "post" | "spielplatz";
  id: string;
}) {
  return (
    <button
      className="p-2 font-semibold text-white bg-negative-600 rounded-md hover:bg-negative-700"
      onClick={() => {
        if (type === "flohmarkt") clearLatLonFromFlohmarkt(id);
        if (type === "post") clearLatLonFromPost(id);
        if (type === "spielplatz") clearLatLonFromSpielplatz(id);
      }}
    >
      Clear Lat/Lon
    </button>
  );
}
