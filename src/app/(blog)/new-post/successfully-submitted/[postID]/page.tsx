import React from "react";
import { revalidatePost } from "@app/utils/actions/revalidate";
import SuccessfulSubmit from "@components/@PostForm/SuccessfulSubmit";
import { getSuggestedPostWithID } from "@app/api/dbActions";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import PostNotFound from "@components/@PostForm/PostNotFound";
import AdminRoute from "@app/providers/AdminRoute";
export default async function SuccessfulPage({
  params: { postID },
}: {
  params: { postID: string };
}) {
  if (postID) {
    revalidatePost();
  }
  const post = await getSuggestedPostWithID(postID);
  if (!post) return <PostNotFound />;
  const session = await getServerSession();
  if (!session?.user?.email || post.user_id !== session.user.email) {
    redirect("/");
  }
  return (
    <AdminRoute>
      <SuccessfulSubmit postID={postID} submitType="suggestion" />
    </AdminRoute>
  );
}
