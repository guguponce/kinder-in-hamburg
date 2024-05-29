"use client";
import { clearLatLonFromFlohmarkt } from "@app/api/dbActions";
import React from "react";

export default function ClearLatLonButton({ id }: { id: string }) {
  return (
    <button
      className="p-2 font-semibold text-white bg-negative-600 rounded-md hover:bg-negative-700"
      onClick={() => {
        clearLatLonFromFlohmarkt(id);
      }}
    >
      Clear Lat/Lon
    </button>
  );
}
