import { getUsersSuggestions } from "@app/api/dbActions";
import RefreshButton from "@app/components/RefreshButton";
import StackedCards from "@app/components/@Cards/StackedCards";
import AdminComponents from "@app/providers/AdminComponents";
import { getDescription, getPlainText, parsePost } from "@app/utils/functions";
import { iParsedRetrievedPost } from "@app/utils/types";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";
import ScrollableCardList from "@app/components/@Cards/ScrollableCardList";

export default async function DashboardPage() {
  const session = await getServerSession();
  if (!session?.user?.email || !session?.user?.name) {
    redirect("/api/auth/signin");
  }

  const userSuggestions = await getUsersSuggestions(session.user.email);
  const suggestions =
    typeof userSuggestions === "string"
      ? userSuggestions
      : userSuggestions.reduce((acc, curr) => {
          const status = curr.status || "pending";
          if (acc[status]) {
            acc[status].push(parsePost(curr));
          } else {
            acc[status] = [parsePost(curr)];
          }
          return acc;
        }, {} as { [key: string]: iParsedRetrievedPost[] });

  return (
    <main className="w-[calc(100%-2rem)] w-max-[800px] p-4 bg-hh-100 rounded-md mx-auto flex flex-col items-center">
      <h2 className="text-xl font-semibold self-start">
        Hi, {session.user.name.split(" ")[0]}!
      </h2>

      <AdminComponents>
        <section className="flex flex-col items-center">
          <Link
            href="/posts-approval"
            className="p-2 rounded-md bg-hh-700 text-white"
          >
            Suggested Posts
          </Link>
        </section>
      </AdminComponents>
      <Link
        className="block mx-auto w-fit p-2 my-4 rounded-md bg-hh-700 text-white font-semibold hover:bg-hh-600 active:bg-hh-800"
        href="/new-post"
      >
        Suggest a new spot
      </Link>

      <div className="w-full flex flex-col">
        <h3 className="text-lg font-semibold">Your Suggestions</h3>
        {typeof suggestions === "string" ? (
          <article>
            <h4 className="text-lg font-semibold">{suggestions}</h4>
            <RefreshButton />
          </article>
        ) : (
          Object.entries(suggestions).map(([status, posts]) => (
            <section key={status} className="p-2 w-full rounded-sm bg-hh-300 ">
              <h4 className="text-lg font-semibold">{status.toUpperCase()}</h4>
              <div className="flex w-full items-center overflow-hidden my-4">
                <div className="flex items-center gap-2 w-fit overflow-x-auto py-2">
                  <ScrollableCardList
                    cardType="text-priority"
                    size="small"
                    posts={posts}
                    descriptions={true}
                  />
                </div>
              </div>
            </section>
          ))
        )}
      </div>
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