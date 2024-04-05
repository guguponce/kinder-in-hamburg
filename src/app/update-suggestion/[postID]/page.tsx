import React from "react";
import PostForm from "@components/@PostForm/PostForm";
import { getServerSession } from "next-auth";
import {
  getApprovedPostWithID,
  getSuggestedPostWithID,
} from "@app/api/dbActions";
import { parseAddress, parsePost } from "@app/utils/functions";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function updateSuggestedPostPage({
  params,
}: {
  params: { postID: string };
}) {
  const session = await getServerSession();
  const { postID } = params;
  const approvedPost = await getApprovedPostWithID(postID);

  if (approvedPost)
    return (
      <main className="mx-auto flex h-fit w-full max-w-[400px] flex-col items-center justify-center rounded-md bg-hh-100 p-4 gap-4 text-center">
        <h2 className="font-semibold text-xl">
          Your suggestion: {'"'}
          {approvedPost.title}
          {'"'} <br /> has already been approved
        </h2>
        <p>That means that you can not change it anymore</p>
        <Link
          className="px-2 py-1 rounded-md font-semibold bg-hh-700 text-white hover:bg-hh-600"
          href={`/posts/${postID}`}
        >
          Go check it out!
        </Link>
      </main>
    );

  const suggestedPost = parsePost(await getSuggestedPostWithID(postID));
  if (
    !session?.user?.email ||
    ![process.env.ADMIN_EMAIL, suggestedPost.user_id].includes(
      session.user.email
    )
  )
    redirect("/");

  return (
    <main className="body-font relative mb-10 mt-6 max-w-[1000px] bg-[hsl(35,73%,57%,0.9)] p-4 text-gray-200 lg:mx-8">
      <div className="h-full w-full bg-[rgb(255,255,255,0.6)] p-5 px-5">
        <h1 className="title-font mb-4 text-center text-xl font-bold text-gray-900 sm:text-3xl">
          UPDATE SUGGESTION
        </h1>
        <PostForm
          postType="update-suggestion"
          PostForm={{
            ...suggestedPost,
            address: suggestedPost.address
              ? parseAddress(suggestedPost.address)
              : undefined,
          }}
          user={session.user}
        />
      </div>
    </main>
  );
}
