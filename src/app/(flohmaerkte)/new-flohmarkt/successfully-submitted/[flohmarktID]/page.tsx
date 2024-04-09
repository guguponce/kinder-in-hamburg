import React from "react";
import { revalidate } from "@app/utils/actions/revalidate";
import SuccessfulSubmit from "@components/@PostForm/SuccessfulSubmit";
import { getFlohmarktWithID } from "@app/api/dbActions";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import FlohmarktPoster from "@app/components/@PostForm/FlohmarktPoster";
import PostNotFound from "@app/components/@PostForm/PostNotFound";
export default async function SuccessfulPage({
  params: { flohmarktID },
}: {
  params: { flohmarktID: string };
}) {
  if (flohmarktID) {
    revalidate();
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
  return (
    <main className="flex flex-col items-center gap-4">
      <SuccessfulSubmit
        title={flohmarkt.title}
        type="flohmarkt"
        postID={flohmarktID}
        submitType="suggestion"
      />
      <article className="w-3/4 max-w-[400px] aspect-[0.66] rounded bg-hh-100 bg-opacity-20">
        <FlohmarktPoster flohmarkt={flohmarkt} />
      </article>
    </main>
  );
}
