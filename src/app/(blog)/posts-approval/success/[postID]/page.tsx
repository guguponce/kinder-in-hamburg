import React from "react";
import { revalidatePost } from "@app/utils/actions/revalidate";
import SuccessfulSubmit from "@components/@PostForm/SuccessfulSubmit";
import { getApprovedPostWithID } from "@app/api/dbActions";
import { getServerUser } from "@app/api/auth/supabaseAuth";
import { redirect } from "next/navigation";
import NotFound from "@components/@NotFound/NotFound";
export default async function SuccessfulPage({
  params: { postID },
}: {
  params: { postID: string };
}) {
  if (postID) {
    revalidatePost();
  }
  const post = await getApprovedPostWithID(postID);
  if (!post) return <NotFound />;
  const session = await getServerUser();
  if (
    session?.user?.user_metadata.email !== process.env.ADMIN_EMAIL &&
    !post.id
  ) {
    redirect("/");
  }
  return (
    <SuccessfulSubmit
      postID={postID}
      submitType="approval"
      image={post.image ? post.image[0] : ""}
      title={post.title}
    />
  );
}
