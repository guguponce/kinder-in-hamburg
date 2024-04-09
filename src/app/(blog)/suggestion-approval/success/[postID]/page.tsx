import React from "react";
import PostForm from "@components/@PostForm/PostForm";
import { getServerSession } from "next-auth";
import { getSuggestedPostWithID } from "@app/api/dbActions";
import { parseAddress, parsePost } from "@app/utils/functions";
import { redirect } from "next/navigation";

export default async function updateSuggestedPostPage({
  params,
}: {
  params: { postID: string };
}) {
  const session = await getServerSession();
  if (!session?.user || session.user.email !== process.env.ADMIN_EMAIL)
    redirect("/");
  const { postID } = params;
  const post = await getSuggestedPostWithID(postID);
  return (
    <section className="body-font relative mb-10 mt-6 max-w-[1000px] bg-[hsl(35,73%,57%,0.9)] p-4 text-gray-200 lg:mx-8">
      <div className="h-full w-full bg-[rgb(255,255,255,0.6)] p-5 px-5">
        <h1 className="title-font mb-4 text-center text-2xl font-medium text-gray-900 sm:text-3xl">
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
