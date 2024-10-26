import React from "react";
import { getEventMetadata, getEventWithID } from "@app/api/dbActions";
import NotFound from "@components/@NotFound/NotFound";
import FlohmarktTemplate from "@app/components/FlohmarktTemplate";
import AdminServerComponent from "@app/providers/AdminServerComponents";
import { Metadata } from "next";
import FlohmarktPageMapContainer from "./EventPageMapContainer";
import { getSpielplatzFromBezirkStadtteil } from "@app/api/spActions";
import { PROXIMATE_STADTTEILE_FROM_OTHER_BEZIRK } from "@app/utils/constants";
import AdminEditButtons from "@app/components/AdminEditButtons";
import OldEventSign from "./OldEventSign";
import { redirect } from "next/navigation";
import Image from "./opengraph-image";

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
      description: eventInfo.optionalComment.slice(0, 100),
      images: (await Image({ params })) || eventInfo.image,
      siteName: "Kinder in Hamburg",
    },
  };
}

export default async function EventPage({
  params: { eventID },
}: EventPageProps) {
  const event = await getEventWithID(eventID, "events");
  if (!event || event.status === null) return <NotFound type="event" />;
  if (!["approved", "old"].includes(event.status))
    redirect("/event-suggestion/" + eventID);

  const spielplaetzeNearby =
    (await getSpielplatzFromBezirkStadtteil(
      event.bezirk!,
      PROXIMATE_STADTTEILE_FROM_OTHER_BEZIRK[event.bezirk!] || [event.stadtteil]
    )) || [];

  return (
    <>
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
        <FlohmarktPageMapContainer
          spielplaetzeAround={spielplaetzeNearby}
          currentTarget={event}
        />
      </section>
    </>
  );
}
