import { getAllFlohmaerteSeparatedByStatus } from "@app/api/dbActions";
import PostNotFound from "@app/components/@PostForm/PostNotFound";
import React from "react";
import StatusSetter from "../StatusSetter";
import AdminRoute from "@app/providers/AdminRoute";
import FlohmarktPoster from "@app/components/FlohmarktPoster";
import AddLatLonFlohmarkt from "@app/components/AddLatLonFlohmarkt";

export default async function AllFlohmaerktePage() {
  const allFlohs = await getAllFlohmaerteSeparatedByStatus();
  if (!allFlohs) return <PostNotFound multiples type="post" />;

  return (
    <AdminRoute>
      <main className="flex flex-col gap-4">
        {Object.entries(allFlohs).map(([status, flohmarkt]) => (
          <section
            key={status}
            className="w-full gap-2 bg-hh-400 text-white rounded-md p-4"
          >
            <h2 className="font-semibold text-center text-2xl p-2 capitalize">
              {status}
            </h2>
            <article className="flex flex-wrap gap-2 justify-center">
              {flohmarkt.map((floh, i) => (
                <div
                  key={floh.id}
                  className={`${
                    status === "approved"
                      ? "bg-positive-300"
                      : status === "rejected"
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
                    />
                  </div>
                  <div className="h-full flex flex-col items-center justify-center gap-4 text-hh-800 w-[100px]">
                    <StatusSetter
                      type="flohmarkt"
                      status={floh.status || "pending"}
                      target={floh}
                    ></StatusSetter>
                    {!floh.lat && !floh.lon && (
                      <AddLatLonFlohmarkt flohmarkt={floh} />
                    )}
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
