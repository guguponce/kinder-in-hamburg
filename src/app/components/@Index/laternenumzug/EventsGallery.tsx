import {
  getAllFutureEventsFromType,
  getFutureApprovedEventsFromType,
} from "@app/api/dbActions";
import React from "react";
import ClientEventsGallery from "./ClientEventsGallery";
import { iEventType } from "@app/utils/types";

export default async function EventsGallery({
  eventType,
}: {
  eventType: iEventType;
}) {
  // ---------------------
  const eventsList =
    // (eventType === "weihnachtsmarkt"
    //   ? await getAllFutureEventsFromType("weihnachtsmarkt")
    //   :
    (await getFutureApprovedEventsFromType(eventType)) || [];
  const extra =
    eventType === "weihnachtsmarkt"
      ? (await getFutureApprovedEventsFromType("adventsevent")) || []
      : [];
  if (eventsList.length === 0) return null;

  return <ClientEventsGallery eventsList={[...extra, ...eventsList]} />;
}
