import React from "react";
import StatusSetter from "../StatusSetter";
import AdminRoute from "@app/providers/AdminRoute";
import FlohmarktPoster from "@app/components/FlohmarktPoster";
import AddLatLon from "@app/components/AddLatLon";
import OldButtonSetter from "./OldButtonSetter";
import { iFlohmarkt } from "@app/utils/types";
import ErrorFetchingData from "@components/@NotFound/ErrorFetchingData";
import HorizontalCard from "@app/components/@Cards/HorizontalCard";
import { addressWithoutCity } from "@app/utils/functions";

const fetchFlohmaerkteByStatus = async (url: string) => {
  try {
    const allFlohs = await fetch(url, {
      headers: {
        "Cache-Control": "no-cache",
        Accept: "application/json",
        method: "GET",
      },
      next: { revalidate: 15 },
    });
    if (allFlohs) {
      return (await allFlohs.json()) as
        | {
            pending: iFlohmarkt[];
            approved: iFlohmarkt[];
            rejected: iFlohmarkt[];
            old: iFlohmarkt[];
          }
        | false;
    }
  } catch (e) {
    console.error(e);
    return false;
  }
};

export default async function AllFlohmaerktePage() {
  const url = `${process.env.BASE_URL}api/flohmaerkteByStatus`;
  const allFlohs = await fetchFlohmaerkteByStatus(url);
  if (!allFlohs) return <ErrorFetchingData type="Flohmärkte" />;
  const status: Array<keyof typeof allFlohs> = [
    "pending",
    "approved",
    "rejected",
    "old",
  ];
  return (
    <AdminRoute>
      <main className="flex flex-col gap-4">
        <OldButtonSetter />
        {status.map(
          (st) =>
            !!allFlohs[st].length && (
              <section
                key={st}
                className="w-full gap-2 bg-hh-400 text-white rounded-md p-4"
              >
                <h2 className="font-semibold text-center text-2xl p-2 capitalize">
                  {st}
                </h2>
                <article className="flex flex-wrap gap-2 justify-center">
                  {[...allFlohs[st]]
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
                            type="flohmarkt"
                            id={floh.id}
                            title={floh.title}
                            link={`/flohmarkt/${floh.id}`}
                            image={floh.image || ""}
                          >
                            <HorizontalCard.FlohmarktInfo
                              title={floh.title}
                              address={addressWithoutCity(floh.address)}
                              stadtteil={floh.stadtteil}
                              date={floh.date}
                              time={floh.time}
                            />
                          </HorizontalCard>
                        </div>
                        <div className="h-full flex items-center justify-center gap-4 text-hh-800">
                          <StatusSetter
                            type="flohmarkt"
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
