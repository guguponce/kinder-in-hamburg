import { getAllPostsSeparatedByStatus } from "@app/api/dbActions";
import HorizontalCard from "@app/components/@Cards/HorizontalCard";
import NotFound from "@components/@NotFound/NotFound";
import { getPlainText } from "@app/utils/functions";
import React from "react";
import StatusSetter from "../StatusSetter";
import AdminRoute from "@app/providers/AdminRoute";

export default async function AllPostsPage() {
  const allPosts = await getAllPostsSeparatedByStatus();
  if (!allPosts) return <NotFound multiples type="post" />;

  return (
    <AdminRoute>
      <main className="flex flex-col gap-4">
        {Object.entries(allPosts).map(([status, posts]) => (
          <section
            key={status}
            className="w-full gap-2 bg-hh-400 text-white rounded-md p-4"
          >
            <h2 className="font-semibold text-center text-2xl p-2 capitalize">
              {status}
            </h2>
            <article className="flex flex-wrap gap-2 justify-center">
              {posts.map((p) => (
                <div
                  key={p.id}
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
                      type="post"
                      id={p.id}
                      title={p.title}
                      link={`/${
                        p.status === "approved" ? "posts" : "post-suggestions"
                      }/${p.id}`}
                      image={(p.image && p.image[0]) || ""}
                    >
                      <HorizontalCard.PostInfo
                        title={p.title}
                        description={getPlainText(p.text).slice(0, 100) + "..."}
                        stadtteil={p.stadtteil}
                      />
                    </HorizontalCard>
                  </div>
                  <div className="border border-hh-800 rounded p-2 flex flex-wrap items-center justify-center gap-4 text-hh-800 min-w-[100px]">
                    <StatusSetter
                      status={p.status || "pending"}
                      target={p}
                      type="post"
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
