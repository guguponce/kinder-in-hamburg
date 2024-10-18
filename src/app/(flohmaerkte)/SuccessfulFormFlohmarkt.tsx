import React from "react";
import { revalidatePost } from "@app/utils/actions/revalidate";
import SuccessfulSubmit from "@components/@PostForm/SuccessfulSubmit";
import { getEventWithID } from "@app/api/dbActions";
import { getServerUser } from "@app/api/auth/supabaseAuth";
import { redirect } from "next/navigation";
import NotFound from "@components/@NotFound/NotFound";
import FlohmarktPoster from "@app/components/FlohmarktPoster";
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
  const flohmarkt = await getEventWithID(flohmarktID);
  if (!flohmarkt) return <NotFound />;
  const user = await getServerUser();
  if (
    !user?.email ||
    ![process.env.ADMIN_EMAIL, flohmarkt.addedBy.email].includes(user.email)
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
