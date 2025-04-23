import React from "react";
import StatusSetter from "./StatusSetter";
import AdminRoute from "@app/providers/AdminRoute";
import AddLatLon from "@components/@Buttons/AddLatLon";
import OldButtonSetter from "./OldButtonSetter";
import ErrorFetchingData from "@components/@NotFound/ErrorFetchingData";
import HorizontalCard from "@components/@Cards/HorizontalCard";
import { addressWithoutCity, isTypeFlohmarkt } from "@app/utils/functions";
import { getAllFlohmaerteSeparatedByStatus } from "@app/api/dbActions";
import { unstable_cache } from "next/cache";
import RevalidateButton from "../components/@Buttons/RevalidateButton";

export default async function AllEventsStatusSetter({
  eventsType,
}: {
  eventsType: "flohmaerkte" | "events";
}) {
  const cachedEvents = unstable_cache(
    getAllFlohmaerteSeparatedByStatus,
    ["allFlohmaerkte"],
    {
      revalidate: 600,
      tags: [eventsType],
    }
  );
  const allEventsByStatus = await cachedEvents(false, eventsType);
  if (!allEventsByStatus)
    return (
      <ErrorFetchingData
        type={eventsType === "flohmaerkte" ? "Flohmärkte" : "Events"}
      />
    );
  const status: Array<keyof typeof allEventsByStatus> = [
    "pending",
    "approved",
    "rejected",
    "old",
  ];

  const prefixLink = {
    flohmaerkte: {
      pending: "flohmarkt-suggestion",
      approved: "flohmaerkte",
      rejected: "flohmarkt-suggestion",
      old: "flohmarkt-suggestion",
    },
    events: {
      pending: "event-suggestion",
      approved: "events",
      rejected: "event-suggestion",
      old: "event-suggestion",
    },
  };
  return (
    <AdminRoute>
      <main className="flex flex-col gap-4">
        <RevalidateButton />
        <OldButtonSetter type={eventsType} />
        {status.map(
          (st) =>
            !!allEventsByStatus[st].length && (
              <section
                key={st}
                className="w-full gap-2 bg-hh-400 text-white rounded-md p-4"
              >
                <h2 className="font-semibold text-center text-2xl p-2 capitalize">
                  {st}
                </h2>
                <article className="flex flex-wrap gap-2 justify-center">
                  {[...allEventsByStatus[st]]
                    .sort((a, b) => a.date - b.date)
                    .map((floh) => (
                      <div
                        key={floh.id}
                        className={`${
                          st === "approved"
                            ? "bg-positive-300"
                            : st === "rejected"
                              ? "bg-negative-300"
                              : "bg-hh-300"
                        } floh-2 rounded-md flex flex-col justify-around gap-4 items-center w-[360px] p-2`}
                      >
                        <div className="flex  flex-col items-center">
                          <HorizontalCard
                            type={floh.type || "flohmarkt"}
                            id={floh.id}
                            title={floh.title}
                            link={`/${prefixLink[eventsType][floh.status]}/${floh.id}`}
                            image={floh.image || ""}
                          >
                            <HorizontalCard.FlohmarktInfo
                              title={floh.title}
                              address={addressWithoutCity(floh.address)}
                              stadtteil={floh.stadtteil}
                              date={floh.date}
                              time={floh.time}
                              endDate={floh.endDate}
                            />
                          </HorizontalCard>
                        </div>
                        <div className="h-full flex items-center justify-center gap-4 text-hh-800">
                          <StatusSetter
                            type={
                              eventsType === "events" ? "event" : "flohmarkt"
                            }
                            status={floh.status || "pending"}
                            target={floh}
                          ></StatusSetter>
                          {!floh.lat && !floh.lon && <AddLatLon item={floh} />}
                        </div>
                      </div>
                    ))}
                </article>
              </section>
            )
        )}
      </main>
    </AdminRoute>
  );
}
