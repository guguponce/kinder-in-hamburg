import { getFutureApprovedEventsFromType } from "@app/api/dbActions";
import ShuffleGallery from "@app/components/ShuffleGallery";
import React from "react";

export default async function LaternenGallery() {
  const laterneEvents =
    (await getFutureApprovedEventsFromType("laterne")) || [];
  if (laterneEvents.length === 0) return null;

  return (
    <>
      <ShuffleGallery list={laterneEvents} />
    </>
  );
}
