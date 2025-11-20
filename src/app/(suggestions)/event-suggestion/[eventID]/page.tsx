import { getEventWithID } from "@app/api/dbActions";
import FlohmarktTemplate from "@components/FlohmarktTemplate";
import React from "react";
import dynamic from "next/dynamic";
import NotFound from "@components/@NotFound/NotFound";
import AdminEditButtons from "@components/@Buttons/AdminEditButtons";
import AdminRoute from "@app/providers/AdminRoute";
import StatusDisplay from "@components/StatusDisplay";

const SuggestedEventMap = dynamic(() => import("@components/@Map/GeneralMap"), {
  ssr: false,
});

export default async function EventSuggestionPage({
  params: { eventID },
}: {
  params: { eventID: string };
}) {
  const suggestion = await getEventWithID(eventID, "events");
  if (!suggestion) return <NotFound type="event" />;
  return (
    <AdminRoute>
      <main className="flex flex-col items-center w-full p-1">
        <FlohmarktTemplate flohmarkt={suggestion}>
          <StatusDisplay status={suggestion.status}>
            <StatusDisplay.Title>
              {suggestion.status === "approved"
                ? "Diese Veranstaltung wurde schon angenommen"
                : suggestion.status === "rejected"
                  ? "Diese Veranstaltung wurde abgelehnt"
                  : "Diese Veranstaltung wurde noch nicht angenommen"}
            </StatusDisplay.Title>
            <StatusDisplay.Link
              href={
                suggestion.status === "approved"
                  ? `/events/${suggestion.id}`
                  : `/update-event/${eventID}`
              }
              status={suggestion.status}
            >
              <>
                <small className="block text-xs">
                  (You can modify it if you want)
                </small>
                {suggestion.status === "approved"
                  ? "Check it out!"
                  : "Update suggestion"}
              </>
            </StatusDisplay.Link>
          </StatusDisplay>{" "}
          <AdminEditButtons
            updateButton={{
              size: "medium",
              link: `/update-event/${eventID}`,
              status: suggestion.status || "pending",
              type: "event",
            }}
            deleteButton={{
              deleteFrom:
                suggestion.status === "approved" ? "approved" : "suggested",
              id: suggestion.id,
              title: suggestion.title,
              type: "event",
              size: "medium",
            }}
            copyButton={{ type: "event", id: suggestion.id }}
            addLatLonButton={
              !suggestion.lat && !suggestion.lon
                ? { item: suggestion }
                : undefined
            }
            approveButton={
              suggestion.status !== "approved"
                ? {
                    size: "medium",
                    contributor: suggestion.addedBy,
                    eventID: eventID,
                  }
                : undefined
            }
          />
          {/* {suggestion.lat && suggestion.lon && (
            <SuggestedEventMap currentTarget={suggestion} zoom={13} />
          )} */}
        </FlohmarktTemplate>
      </main>
    </AdminRoute>
  );
}
