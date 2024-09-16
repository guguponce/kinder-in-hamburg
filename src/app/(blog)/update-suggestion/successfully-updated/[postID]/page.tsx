import React from "react";
import { revalidatePost } from "@app/utils/actions/revalidate";
import SuccessfulSubmit from "@components/@PostForm/SuccessfulSubmit";
import { getSuggestedPostWithID } from "@app/api/dbActions";
import { getServerUser } from "@app/api/auth/supabaseAuth";
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
  const post = await getSuggestedPostWithID(postID);
  if (!post) return <PostNotFound />;
  const session = await getServerUser();
  if (
    !session?.user?.email ||
    ![process.env.ADMIN_EMAIL, post.user_id].includes(
      session.user.user_metadata.email
    )
  ) {
    redirect("/");
  }
  return <SuccessfulSubmit submitType="suggestion" postID={postID} />;
}
