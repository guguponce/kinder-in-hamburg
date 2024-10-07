import { getAllFlohmaerteSeparatedByStatus } from "@app/api/dbActions";
import PostNotFound from "@app/components/@PostForm/PostNotFound";
import React from "react";
import StatusSetter from "../StatusSetter";
import AdminRoute from "@app/providers/AdminRoute";
import FlohmarktPoster from "@app/components/FlohmarktPoster";
import AddLatLon from "@app/components/AddLatLon";
import OldButtonSetter from "./OldButtonSetter";
import { iFlohmarkt } from "@app/utils/types";
import { GetServerSideProps } from "next";

export const revalidate = 20;

const fetchFlohmaerkteByStatus = async () => {
  const url = `${process.env.BASE_URL}api/flohmaerkteByStatus`;
  const allFlohs = await fetch(url, {
    headers: {
      method: "GET",
      Accept: "application/json",
    },
    next: {
      revalidate: 20,
    },
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
};

export default async function AllFlohmaerktePage() {
  const allFlohs = await fetchFlohmaerkteByStatus();
  if (!allFlohs) return <PostNotFound multiples type="post" />;
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
        {status.map((st) => (
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
                .map((floh, i) => (
                  <div
                    key={floh.id}
                    className={`${
                      st === "approved"
                        ? "bg-positive-300"
                        : st === "rejected"
                        ? "bg-negative-300"
                        : "bg-hh-300"
                    } floh-2 rounded-md flex  justify-around gap-4 items-center w-[400px] lg:w-[600px]  h-[400px] p-2`}
                  >
                    <div className="h-full aspect-[0.66]">
                      <FlohmarktPoster
                        index={i}
                        title={floh.title}
                        image={floh.image}
                        date={floh.date}
                        bezirk={floh.bezirk}
                        id={floh.id}
                        prefixLink={
                          floh.status === "approved"
                            ? "/flohmaerkte/"
                            : "/flohmarkt-suggestion/"
                        }
                      />
                    </div>
                    <div className="h-full flex flex-col items-center justify-center gap-4 text-hh-800 w-[100px]">
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
        ))}
      </main>
    </AdminRoute>
  );
}
