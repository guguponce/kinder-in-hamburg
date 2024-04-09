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
  if (!session?.user?.email || post.user_id !== session.user.email) {
    redirect("/");
  }
  return <SuccessfulSubmit postID={postID} submitType="suggestion" />;
}