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
import PostNotFound from "@app/components/@PostForm/PostNotFound";

export default async function ApproveSuggestedPostPage({
  params,
}: {
  params: { suggestionID: string };
}) {
  const session = await getServerSession();
  if (!session?.user || session.user.email !== process.env.ADMIN_EMAIL)
    redirect("/");
  const { suggestionID } = params;

  const approvedPost = await getApprovedPostWithID(suggestionID);

  if (approvedPost)
    return (
      <main className="mx-auto flex h-fit w-full max-w-[400px] flex-col items-center justify-center rounded-md bg-hh-100 p-4 gap-4 text-center">
        <h2 className="font-semibold text-xl">
          The suggestion: {'"'}
          {approvedPost.title}
          {'"'} <br /> has already been approved
        </h2>
        <p>That means that it can not be changed anymore</p>
        <Link
          className="px-2 py-1 rounded-md font-semibold bg-hh-700 text-white hover:bg-hh-600"
          href={`/posts/${suggestionID}`}
        >
          Go check it out!
        </Link>
        {session.user.email === process.env.ADMIN_EMAIL && (
          <div className="flex flex-col items-center mt-4 p-4">
            <h3 className="font-semibold text-xl">
              You could though update the approved post
            </h3>
            <Link
              className="px-2 py-1 rounded-md font-semibold bg-hh-700 text-white hover:bg-hh-600"
              href={`/update-suggestion/${suggestionID}`}
            >
              Update the approved post
            </Link>
          </div>
        )}
      </main>
    );

  const post = await getSuggestedPostWithID(suggestionID);
  if (!post) return <PostNotFound />;
  return (
    <section className="body-font relative mb-10 mt-6 max-w-[1000px] bg-[hsl(35,73%,57%,0.9)] p-4 text-gray-200 lg:mx-8">
      <div className="h-full w-full bg-[rgb(255,255,255,0.6)] p-5 px-5">
        <h1 className="title-font mb-4 text-center text-2xl font-bold text-gray-900 sm:text-3xl">
          APPROVE POST
        </h1>
        <PostForm
          postType="suggested-to-approved"
          PostForm={{
            ...post,
            address: post.address ? parseAddress(post.address) : undefined,
          }}
          user={session.user}
        />
      </div>
    </section>
  );
}
