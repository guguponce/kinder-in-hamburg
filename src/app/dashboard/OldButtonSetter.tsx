"use client";
import { setAllPreviousEventsAsOld } from "@app/api/dbActions";
import React from "react";

export default function OldButtonSetter({
  type,
}: {
  type: "flohmaerkte" | "events";
}) {
  return (
    <button
      className="bg-orange-300 p-2"
      onClick={async () => {
        const oldFlohs = await setAllPreviousEventsAsOld(type);
        if (!oldFlohs) throw new Error("Could not set old Flohmaerkte as old");
      }}
    >
      Set old {type === "flohmaerkte" ? "Flohmärkte" : "Events"} as Old
    </button>
  );
}
