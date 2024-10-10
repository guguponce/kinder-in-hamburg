"use client";
import {
  clearLatLonFromFlohmarkt,
  clearLatLonFromPost,
} from "@app/api/dbActions";
import { clearLatLonFromSpielplatz } from "@app/api/spActions";
import Button from "@app/components/Button";
import React from "react";

export default function ClearLatLonButton({
  type,
  id,
}: {
  type: "flohmarkt" | "post" | "spielplatz";
  id: string;
}) {
  return (
    <Button
      variant="negative-dark"
      fontWeight="semibold"
      size="medium"
      onClick={() => {
        if (type === "flohmarkt") clearLatLonFromFlohmarkt(id);
        if (type === "post") clearLatLonFromPost(id);
        if (type === "spielplatz") clearLatLonFromSpielplatz(id);
      }}
    >
      Clear Lat/Lon
    </Button>
  );
}
