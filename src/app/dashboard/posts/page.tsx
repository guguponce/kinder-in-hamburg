import { getAllPostsSeparatedByStatus } from "@app/api/dbActions";
import HorizontalCard from "@app/components/@Cards/HorizontalCard";
import PostNotFound from "@app/components/@PostForm/PostNotFound";
import { getPlainText } from "@app/utils/functions";
import React from "react";
import StatusSetter from "./StatusSetter";
import AdminRoute from "@app/providers/AdminRoute";

export default async function AllPostsPage() {
  const allPosts = await getAllPostsSeparatedByStatus();
  if (!allPosts) return <PostNotFound multiples type="post" />;
  return (
    <AdminRoute>
      <main>
        <h1>All Posts</h1>
        {Object.entries(allPosts).map(([status, posts]) => (
          <section
            key={status}
            className="w-full gap-2 bg-hh-100 bg-opacity-50 text-white rounded-md"
          >
            <h2 className="font-semibold">{status}</h2>
            <article className="flex flex-wrap gap-2 justify-center">
              {posts.map((p) => (
                <div
                  key={p.id}
                  className={`${
                    status === "approved"
                      ? "bg-positive-200"
                      : status === "rejected"
                      ? "bg-negative-200"
                      : "bg-hh-200"
                  } p-2 rounded-md flex  justify-around gap-4 items-center w-[400px] lg:w-[600px]  h-[200px]`}
                >
                  <div className="w-[275px] lg:w-[450px] flex-grow h-full">
                    <HorizontalCard
                      id={p.id}
                      image={p.image ? p.image[0] : ""}
                      title={p.title}
                      description={getPlainText(p.text)}
                    />
                  </div>
                  <div className="h-full flex flex-col items-center justify-center gap-4 text-hh-800 w-[100px]">
                    <StatusSetter
                      status={p.status || "pending"}
                      post={p}
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
