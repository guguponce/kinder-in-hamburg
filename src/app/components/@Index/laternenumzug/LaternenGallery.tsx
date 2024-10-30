import { getFutureApprovedEventsFromType } from "@app/api/dbActions";
import React from "react";
import ClientLaterneGallery from "./ClientLaterneGallery";

export default async function LaternenGallery() {
  const laterneEvents =
    (await getFutureApprovedEventsFromType("laterne")) || [];
  if (laterneEvents.length === 0) return null;

  return (
    <>
      <ClientLaterneGallery laternenList={laterneEvents} />
    </>
  );
}
