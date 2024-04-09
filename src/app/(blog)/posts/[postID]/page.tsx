import { getApprovedPostWithID } from "@app/api/dbActions";
import PostNotFound from "@app/components/@PostForm/PostNotFound";
import DeletePostButton from "@app/components/DeletePostButton";
import PostTemplate from "@app/components/PostTemplate";
import AdminServerComponent from "@app/providers/AdminServerComponents";
import Link from "next/link";
import React from "react";

export default async function CurrentPostPage({
  params,
}: {
  params: { postID: string };
}) {
  const { postID } = params;
  const post = await getApprovedPostWithID(postID);
  if (!post) return <PostNotFound />;

  return (
    <>
      <AdminServerComponent>
        <DeletePostButton
          deleteFrom="approved"
          id={post.id}
          title={post.title}
          size="large"
        />
      </AdminServerComponent>

      <Link
        href={`/update-post/${postID}`}
        className="w-full max-w-[1000px] my-2 bg-hh-700 rounded-md text-center flex justify-center p-2 text-white hover:bg-hh-800 active:bg-hh-600"
      >
        Update Approved Post
      </Link>
      <PostTemplate post={post} />
    </>
  );
}
