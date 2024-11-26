import React from "react";
import {
  checkIfEventOrFlohmarktExists,
  getAllEventsThisWeek,
  getEventMetadata,
  getEventWithID,
} from "@app/api/dbActions";
import NotFound from "@components/@NotFound/NotFound";
import FlohmarktTemplate from "@app/components/FlohmarktTemplate";
import AdminServerComponent from "@app/providers/AdminServerComponents";
import { Metadata } from "next";
import EventPageMapContainer from "./EventPageMapContainer";
import { getSpielplatzFromBezirkStadtteil } from "@app/api/spActions";
import { PROXIMATE_STADTTEILE_FROM_OTHER_BEZIRK } from "@app/utils/constants";
import AdminEditButtons from "@app/components/@Buttons/AdminEditButtons";
import OldEventSign from "./OldEventSign";
import { redirect } from "next/navigation";
import { parseDescriptionWithTags } from "@app/utils/functions";
// import Image from "./opengraph-image";

interface EventPageProps {
  params: { eventID: string };
}

export async function generateMetadata({
  params,
}: EventPageProps): Promise<Metadata> {
  const eventInfo = await getEventMetadata(params.eventID, "events");
  if (!eventInfo)
    return {
      title: "Event nicht gefunden",
      description: "Der Event wurde nicht gefunden.",
    };
  return {
    title: eventInfo.title,
    description:
      "Event in " + eventInfo.bezirk + " " + eventInfo.optionalComment,
    openGraph: {
      type: "website",
      url: "https://www.kinder-in-hamburg.de/events/" + params.eventID,
      title: eventInfo.title,
      description: parseDescriptionWithTags(
        eventInfo.optionalComment?.slice(0, 100)
      ),
      images: eventInfo.image || process.env.BASE_URL + "opengraph-image.png",
      siteName: "Kinder in Hamburg",
    },
    twitter: {
      description: parseDescriptionWithTags(
        eventInfo.optionalComment?.slice(0, 100)
      ),
      title: eventInfo.title,
      images: eventInfo.image || process.env.BASE_URL + "opengraph-image.png",
      site: "https://www.kinder-in-hamburg.de/events/" + params.eventID,
      card: "summary_large_image",
    },
  };
}

export default async function EventPage({
  params: { eventID },
}: EventPageProps) {
  const event = await getEventWithID(eventID, "events");
  if (event === false) {
    const flohmarktID = await checkIfEventOrFlohmarktExists(
      eventID,
      "flohmaerkte"
    );
    if (!!flohmarktID) {
      redirect("/flohmaerkte/" + flohmarktID);
    }
  }
  if (!event || event.status === null || event.status === "rejected")
    return <NotFound type="event" />;
  if (!["approved", "old"].includes(event.status))
    redirect("/event-suggestion/" + eventID);

  const spielplaetzeNearby =
    (await getSpielplatzFromBezirkStadtteil(
      event.bezirk!,
      PROXIMATE_STADTTEILE_FROM_OTHER_BEZIRK[event.bezirk!] || [event.stadtteil]
    )) || [];
  const proximateStadtteile = PROXIMATE_STADTTEILE_FROM_OTHER_BEZIRK[
    event.bezirk!
  ] || [event.stadtteil];
  const eventsNearby =
    (await getAllEventsThisWeek(undefined, event.bezirk, [
      ...proximateStadtteile,
    ])) || [];

  return (
    <main className="flex flex-col items-center w-full p-1">
      <FlohmarktTemplate flohmarkt={event}>
        {event.status === "old" && <OldEventSign />}

        <AdminServerComponent>
          <AdminEditButtons
            updateButton={{
              size: "medium",
              link: `/update-event/${event.id}`,
              status: event.status || "pending",
              type: "event",
            }}
            deleteButton={{
              deleteFrom: "approved",
              id: event.id,
              title: event.title,
              type: "event",
              size: "medium",
            }}
            copyButton={{ type: "event", id: event.id }}
            addLatLonButton={{ item: event }}
          />
        </AdminServerComponent>
      </FlohmarktTemplate>
      <section className="w-full flex flex-wrap-reverse xl:flex-wrap justify-center gap-2">
        <EventPageMapContainer
          spielplaetzeAround={spielplaetzeNearby}
          currentTarget={event}
          events={eventsNearby}
        />
      </section>
    </main>
  );
}
