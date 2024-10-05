import { getUserFlohmaerkte, getUsersSuggestions } from "@app/api/dbActions";
import AdminComponents from "@app/providers/AdminServerComponents";
import { getServerUser } from "@app/api/auth/supabaseAuth";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";
import ScrollableCardList from "@components/@Cards/ScrollableCardList";
import DeleteUnusedImages from "@app/components/DeleteUnusedImages";
import AdminRoute from "@app/providers/AdminRoute";
import FlohmaerkteSearchList from "./FlohmaerkteSearchList";

export default async function DashboardPage() {
  const session = await getServerUser();
  if (!session?.user?.email || !session?.user?.user_metadata.name) {
    redirect("/");
  }
  const userPosts = await getUsersSuggestions(session.user.user_metadata.email);
  const userFlohs = await getUserFlohmaerkte(session.user.user_metadata.email);
  return (
    <AdminRoute>
      <main className="w-[calc(100%-2rem)] max-w-[1000px] p-4 bg-hh-100 rounded-md mx-auto flex flex-col items-center gap-8">
        <h2 className="text-2xl font-semibold text-center">
          Hi, {session.user.user_metadata.name.split(" ")[0]}!
          <span className="block text-sm">
            ({session.user.user_metadata.email})
          </span>
        </h2>

        <ul>
          <li>URLfilteredlist</li>
          <li>Search Fonts</li>
          <li>Search Jugend Zentrum</li>
          <li>Flohmarkt page show that is old, change status to approved</li>
          <li>metadata de sommer in hamburg, spielplatz, post...</li>
        </ul>
        <section className=" w-full max-w-[800px] flex justify-between items-center flex-wrap-reverse gap-4 border-2 border-hh-700 p-4 rounded-md">
          <div className="flex flex-col items-start gap-2">
            <Link
              className="block w-fit p-2  rounded-md bg-positive-700 text-white font-semibold hover:bg-positive-600 active:bg-positive-800"
              href="/new-post"
            >
              Suggest a new spot
            </Link>
            <Link
              className="block w-fit p-2  rounded-md bg-positive-700 text-white font-semibold hover:bg-positive-600 active:bg-positive-800"
              href="/new-flohmarkt"
            >
              Suggest a new Flea Market
            </Link>
          </div>

          <AdminComponents>
            <section className="flex flex-col items-end gap-2">
              <Link
                href="/posts-approval"
                className="p-2 rounded-md bg-hh-700 hover:bg-hh-600 active:bg-hh-800 text-white"
              >
                Check the Suggested Posts
              </Link>
              <Link
                href="/flohmaerkte-approval"
                className="p-2 rounded-md bg-hh-700 hover:bg-hh-600 active:bg-hh-800 text-white"
              >
                Check the Suggested Flea Markets
              </Link>
              <DeleteUnusedImages />
            </section>
          </AdminComponents>
        </section>
        {userFlohs && <FlohmaerkteSearchList userFlohs={userFlohs} />}
        {userPosts && Object.values(userPosts).some((a) => !!a.length) && (
          <section className="w-full max-w-[800px] flex flex-col gap-2">
            <h3 className="text-lg font-semibold">Your Suggested Posts</h3>
            {Object.entries(userPosts).map(([status, posts]) =>
              !!posts.length ? (
                <div
                  key={status + "posts"}
                  className="p-2 w-full rounded-sm bg-hh-600 text-hh-50"
                >
                  <h4 className="text-lg font-semibold ml-6">
                    {status.toUpperCase()}
                  </h4>
                  <div className="flex w-full items-center overflow-hidden pr-4">
                    <div className="flex items-center gap-2 w-fit overflow-x-auto">
                      <ScrollableCardList
                        cardType="text-priority"
                        size="small"
                        posts={posts}
                        linkPrefix={
                          status === "approved" ? "" : "/post-suggestion/"
                        }
                        descriptions={true}
                      />
                    </div>
                  </div>
                </div>
              ) : null
            )}
          </section>
        )}
      </main>
    </AdminRoute>
  );
}
