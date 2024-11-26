import HorizontalCard from "@app/components/@Cards/HorizontalCard";
import NotFound from "@components/@NotFound/NotFound";
import React from "react";
import StatusSetter from "../StatusSetter";
import AdminRoute from "@app/providers/AdminRoute";
import { getAllSpielplaetzeSeparatedByStatus } from "@app/api/spActions";

export default async function AllSpielplaetzePage() {
  const allSpielplaetze = await getAllSpielplaetzeSeparatedByStatus();
  if (!allSpielplaetze) return <NotFound multiples type="spielplatz" />;

  return (
    <AdminRoute>
      <main className="flex flex-col gap-4">
        {Object.entries(allSpielplaetze).map(([status, spielplaetze]) => (
          <section
            key={status}
            className="w-full gap-2 bg-hh-400 text-white rounded-md p-4"
          >
            <h2 className="font-semibold text-center text-2xl p-2 capitalize">
              {status}
            </h2>
            <article className="flex flex-wrap gap-2 justify-center">
              {spielplaetze.map((sp) => (
                <div
                  key={sp.id}
                  className={`${
                    status === "approved"
                      ? "bg-positive-300"
                      : status === "rejected"
                        ? "bg-negative-300"
                        : "bg-hh-300"
                  } p-2 rounded-md flex justify-around flex-wrap gap-4 items-center min-w-[350px] max-w-[450px] w-2/5 lg:w-[600px]`}
                >
                  <div className="min-w-[275px] lg:max-w-[450px] h-[160px] flex-grow">
                    <HorizontalCard
                      type="spielplatz"
                      id={sp.id}
                      title={sp.title}
                      link={`/${"spielplaetze"}/${sp.id}`}
                      image={(sp.image && sp.image[0]) || ""}
                    >
                      <HorizontalCard.PostInfo
                        title={sp.title}
                        description={sp.text?.slice(0, 100) + "..."}
                        stadtteil={sp.stadtteil}
                      />
                    </HorizontalCard>
                  </div>
                  <div className="border border-hh-800 rounded p-2 flex flex-wrap items-center justify-center gap-4 text-hh-800 min-w-[100px]">
                    <StatusSetter
                      status={sp.status || "pending"}
                      target={sp}
                    ></StatusSetter>
                  </div>
                </div>
              ))}
            </article>
          </section>
        ))}
      </main>
    </AdminRoute>
  );
}
