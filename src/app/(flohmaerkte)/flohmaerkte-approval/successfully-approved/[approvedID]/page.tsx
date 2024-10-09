import React from "react";
import { revalidatePost } from "@app/utils/actions/revalidate";
import SuccessfulSubmit from "@components/@PostForm/SuccessfulSubmit";
import { getFlohmarktWithID } from "@app/api/dbActions";
import { getServerUser } from "@app/api/auth/supabaseAuth";
import { redirect } from "next/navigation";
import NotFound from "@components/@NotFound/NotFound";
export default async function SuccessfulApprovedFlohmarktPage({
  params: { approvedID },
}: {
  params: { approvedID: string };
}) {
  if (approvedID) {
    revalidatePost();
  }
  const session = await getServerUser();
  if (
    !session?.user?.email ||
    session.user.user_metadata.email !== process.env.ADMIN_EMAIL
  )
    redirect("/flohmaerkte/" + approvedID);
  const flohmarkt = await getFlohmarktWithID(approvedID);
  if (!flohmarkt) return <NotFound />;
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
