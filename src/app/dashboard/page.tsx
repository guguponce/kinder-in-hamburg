import {
  getAllSuggestedPosts,
  getUserFlohmaerkte,
  getUsersSuggestions,
} from "@app/api/dbActions";
import RefreshButton from "@components/RefreshButton";
import StackedCards from "@components/@Cards/StackedCards";
import AdminComponents from "@app/providers/AdminServerComponents";
import { getDescription, getPlainText, parsePost } from "@app/utils/functions";
import { iPost } from "@app/utils/types";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";
import ScrollableCardList from "@components/@Cards/ScrollableCardList";
import ScrollableContainer from "@components/ScrollableContainer";
import FlohmarktPoster from "@components/@PostForm/FlohmarktPoster";
import FlohPostersList from "@components/FlohPostersList";

export default async function DashboardPage() {
  const session = await getServerSession();
  if (!session?.user?.email || !session?.user?.name) {
    redirect("/api/auth/signin");
  }
  const userPosts = await getUsersSuggestions(session.user.email);
  const userFlohs = await getUserFlohmaerkte(session.user.email);

  return (
    <main className="w-[calc(100%-2rem)] max-w-[1000px] p-4 bg-hh-100 rounded-md mx-auto flex flex-col items-center gap-8">
      <h2 className="text-2xl font-semibold">
        Hi, {session.user.name.split(" ")[0]}!{session.user.email}
      </h2>
      <section className=" w-full max-w-[800px] flex justify-between items-center flex-wrap-reverse gap-4 border-2 border-hh-700 p-4 rounded-md">
        <div className="flex gap-4 flex-wrap">
          <Link
            className="block mx-auto w-fit p-2 my-4 rounded-md bg-hh-700 text-white font-semibold hover:bg-hh-600 active:bg-hh-800"
            href="/new-post"
          >
            Suggest a new spot
          </Link>
          <Link
            className="block mx-auto w-fit p-2 my-4 rounded-md bg-hh-700 text-white font-semibold hover:bg-hh-600 active:bg-hh-800"
            href="/new-flohmarkt"
          >
            Suggest a new Flea Market
          </Link>
        </div>

        <AdminComponents>
          <section className="flex flex-col items-center">
            <Link
              href="/posts-approval"
              className="p-2 rounded-md bg-hh-700 text-white"
            >
              Check the Suggested Posts
            </Link>
          </section>
        </AdminComponents>
      </section>
      {userFlohs && Object.values(userFlohs).some((a) => !!a) && (
        <section className="w-full max-w-[800px] flex flex-col gap-2">
          <h3 className="text-lg font-semibold">Your Flea Markets</h3>
          {Object.entries(userFlohs).map(([status, flohs]) =>
            !!flohs.length ? (
              <div
                key={status}
                className="p-2 w-full rounded-sm bg-hh-600 text-hh-50"
              >
                <h4 className="text-lg font-semibold ml-6">
                  {status.toUpperCase()}
                </h4>
                <div className="flex w-full items-center overflow-hidden pr-4">
                  <div className="flex items-center gap-2 w-fit overflow-x-auto">
                    <ScrollableContainer>
                      <FlohPostersList
                        flohList={flohs}
                        prefixLink={
                          status === "approved"
                            ? "/flohmaerkte/"
                            : "/flohmarkt-suggestion/"
                        }
                      />
                    </ScrollableContainer>
                  </div>
                </div>
              </div>
            ) : (
              <></>
            )
          )}
        </section>
      )}
      {userPosts && Object.values(userPosts).some((a) => !!a) && (
        <section className="w-full max-w-[800px] flex flex-col gap-2">
          <h3 className="text-lg font-semibold">Your Suggested Posts</h3>
          {Object.entries(userPosts).map(([status, posts]) =>
            !!posts.length ? (
              <div
                key={status}
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
            ) : (
              <></>
            )
          )}
        </section>
      )}
    </main>
  );
}

// {posts.slice(0,3).map(({ id, title, text, image }) => (
//   <React.Fragment key={id}>
//     <ImageCard
//       aspectRatio={0.5}
//       size="large"
//       id={id}
//       title={title}
//       description={getPlainText(text)}
//       image={
//         image
//           ? image[0]
//           : `https://dummyimage.com/200x100/47596b/fff.jpg&text=${title}`
//       }
//       link={
//         status === "pending"
//           ? `/update-suggestion/${id}`
//           : status === "approved"
//           ? `/posts/${id}`
//           : undefined
//       }
//     />
//   </React.Fragment>
// ))}
