import React from "react";
import { revalidate } from "@app/utils/actions/revalidate";
import SuccessfulSubmit from "@components/@PostForm/SuccessfulSubmit";
import { getSuggestedPostWithID } from "@app/api/dbActions";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import PostNotFound from "@app/components/@PostForm/PostNotFound";
export default async function SuccessfulPage({
  params: { postID },
}: {
  params: { postID: string };
}) {
  if (postID) {
    revalidate();
  }
  const post = await getSuggestedPostWithID(postID);
  if (!post) return <PostNotFound />;
  const session = await getServerSession();
  if (
    !session?.user?.email ||
    ![process.env.ADMIN_EMAIL, post.user_id].includes(session.user.email)
  ) {
    redirect("/");
  }
  return <SuccessfulSubmit submitType="suggestion" postID={postID} />;
}
