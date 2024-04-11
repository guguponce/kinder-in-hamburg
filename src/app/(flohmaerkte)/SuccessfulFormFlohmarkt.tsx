import React from "react";
import { revalidatePost } from "@app/utils/actions/revalidate";
import SuccessfulSubmit from "@components/@PostForm/SuccessfulSubmit";
import { getFlohmarktWithID } from "@app/api/dbActions";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import PostNotFound from "@components/@PostForm/PostNotFound";
import FlohmarktPoster from "@components/@PostForm/FlohmarktPoster";
export default async function SuccessfulFormFlohmarkt({
  flohmarktID,
  submitType,
}: {
  flohmarktID: string;
  submitType: "approval" | "suggestion" | "update";
}) {
  if (flohmarktID) {
    revalidatePost();
  }
  const flohmarkt = await getFlohmarktWithID(flohmarktID);
  if (!flohmarkt) return <PostNotFound />;
  const session = await getServerSession();
  if (
    !session?.user?.email ||
    ![process.env.ADMIN_EMAIL, flohmarkt.addedBy.email].includes(
      session.user.email
    )
  ) {
    redirect("/");
  }
  const { title, image, date, bezirk, id, status } = flohmarkt;
  return (
    <main className="flex flex-col items-center gap-4">
      <SuccessfulSubmit
        title={flohmarkt.title}
        type="flohmarkt"
        postID={flohmarktID}
        submitType={
          !(status === "pending") || !status ? "suggestion" : "update"
        }
      />
      <article className="w-3/4 max-w-[400px] aspect-[0.66] rounded bg-hh-100 bg-opacity-20">
        <FlohmarktPoster
          title={title}
          image={image}
          date={date}
          bezirk={bezirk}
          prefixLink="/flohmarkt-suggestion/"
          id={id}
        />
      </article>
    </main>
  );
}
