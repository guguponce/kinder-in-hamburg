import React from "react";
import { revalidatePost } from "@app/utils/actions/revalidate";
import SuccessfulSubmit from "@components/@PostForm/SuccessfulSubmit";
import { getApprovedPostWithID } from "@app/api/dbActions";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import PostNotFound from "@components/@PostForm/PostNotFound";
export default async function SuccessfulPage({
  params: { postID },
}: {
  params: { postID: string };
}) {
  if (postID) {
    revalidatePost();
  }
  const post = await getApprovedPostWithID(postID);
  if (!post) return <PostNotFound />;

  const session = await getServerSession();
  if (session?.user?.email !== process.env.ADMIN_EMAIL || !post.id) {
    redirect("/");
  }

  return <SuccessfulSubmit submitType="update" postID={postID} />;
}
