import { getAllPostsSeparatedByStatus } from "@app/api/dbActions";
import HorizontalCard from "@app/components/@Cards/HorizontalCard";
import PostNotFound from "@app/components/@PostForm/PostNotFound";
import { getPlainText } from "@app/utils/functions";
import React from "react";
import StatusSetter from "../StatusSetter";
import AdminRoute from "@app/providers/AdminRoute";

export default async function AllPostsPage() {
  const allPosts = await getAllPostsSeparatedByStatus();
  if (!allPosts) return <PostNotFound multiples type="post" />;

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
                  } p-2 rounded-md flex  justify-around gap-4 items-center w-[400px] lg:w-[600px]  h-[200px]`}
                >
                  <div className="w-[275px] lg:w-[450px] flex-grow h-full">
                    <HorizontalCard
                      id={p.id}
                      image={p.image ? p.image[0] : ""}
                      title={p.title}
                      description={getPlainText(p.text)}
                      link={
                        p.status === "approved"
                          ? `/posts/${p.id}`
                          : `/post-suggestion/${p.id}`
                      }
                    />
                  </div>
                  <div className="h-full flex flex-col items-center justify-center gap-4 text-hh-800 w-[100px]">
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
