import React from "react";
import { revalidatePost } from "@app/utils/actions/revalidate";
import SuccessfulSubmit from "@components/@PostForm/SuccessfulSubmit";
import { getSuggestedPostWithID } from "@app/api/dbActions";
import { getServerUser } from "@app/api/auth/supabaseAuth";
import { redirect } from "next/navigation";
import NotFound from "@components/@NotFound/NotFound";
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
  if (!post) return <NotFound />;
  const user = await getServerUser();
  if (!user?.email || post.user_id !== user?.email) {
    redirect("/");
  }
  return (
    <AdminRoute>
      <SuccessfulSubmit postID={postID} submitType="suggestion" />
    </AdminRoute>
  );
}
