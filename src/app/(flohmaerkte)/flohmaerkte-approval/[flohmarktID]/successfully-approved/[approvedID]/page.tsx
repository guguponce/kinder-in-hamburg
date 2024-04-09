import React from "react";
import { revalidate } from "@app/utils/actions/revalidate";
import SuccessfulSubmit from "@components/@PostForm/SuccessfulSubmit";
import { getFlohmarktWithID } from "@app/api/dbActions";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import PostNotFound from "@app/components/@PostForm/PostNotFound";
export default async function SuccessfulApprovedFlohmarktPage({
  params: { flohmarktID },
}: {
  params: { flohmarktID: string };
}) {
  if (flohmarktID) {
    revalidate();
  }
  const session = await getServerSession();
  if (!session?.user?.email || session.user.email !== process.env.ADMIN_EMAIL)
    redirect("/flohmaerkte/" + flohmarktID);
  const flohmarkt = await getFlohmarktWithID(flohmarktID);
  if (!flohmarkt) return <PostNotFound />;
  if (flohmarkt.status !== "approved")
    redirect(`/flohmaerkte-approval/${flohmarktID}`);

  return (
    <SuccessfulSubmit
      title={flohmarkt.title}
      type="flohmarkt"
      postID={flohmarktID}
      submitType="approval"
    />
  );
}
