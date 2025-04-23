"use client";
import { clearLatLonFromEvent, clearLatLonFromPost } from "@app/api/dbActions";
import { clearLatLonFromSpielplatz } from "@app/api/spActions";
import Button from "@components/@Buttons/Button";
import React from "react";

export default function ClearLatLonButton({
  type,
  id,
}: {
  type: "flohmarkt" | "post" | "spielplatz" | "event";
  id: string;
}) {
  return (
    <Button
      variant="negative-dark"
      fontWeight="semibold"
      size="medium"
      onClick={() => {
        if (type === "flohmarkt") clearLatLonFromEvent(id);
        if (type === "event") clearLatLonFromEvent(id, "events");
        if (type === "post") clearLatLonFromPost(id);
        if (type === "spielplatz") clearLatLonFromSpielplatz(id);
      }}
    >
      Clear Lat/Lon
    </Button>
  );
}
