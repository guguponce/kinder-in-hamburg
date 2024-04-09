import React from "react";
import { revalidate } from "@app/utils/actions/revalidate";
import SuccessfulSubmit from "@components/@PostForm/SuccessfulSubmit";
import { getFlohmarktWithID } from "@app/api/dbActions";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import PostNotFound from "@app/components/@PostForm/PostNotFound";
export default async function SuccessfulUpdateFlohmarktPage({
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
    <SuccessfulSubmit
      title={flohmarkt.title}
      type="flohmarkt"
      postID={flohmarktID}
      submitType="update"
    />
  );
}
