import React from "react";
import { revalidatePost } from "@app/utils/actions/revalidate";
import SuccessfulSubmit from "@components/@PostForm/SuccessfulSubmit";
import { getFlohmarktWithID } from "@app/api/dbActions";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import PostNotFound from "@components/@PostForm/PostNotFound";
export default async function SuccessfulApprovedFlohmarktPage({
  params: { approvedID },
}: {
  params: { approvedID: string };
}) {
  if (approvedID) {
    revalidatePost();
  }
  const session = await getServerSession();
  if (!session?.user?.email || session.user.email !== process.env.ADMIN_EMAIL)
    redirect("/flohmaerkte/" + approvedID);
  const flohmarkt = await getFlohmarktWithID(approvedID);
  if (!flohmarkt) return <PostNotFound />;
  if (flohmarkt.status !== "approved")
    redirect(`/flohmaerkte-approval/${approvedID}`);

  return (
    <SuccessfulSubmit
      title={flohmarkt.title}
      type="flohmarkt"
      postID={approvedID}
      submitType="approval"
    />
  );
}
