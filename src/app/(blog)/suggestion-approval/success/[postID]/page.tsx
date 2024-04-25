import React from "react";
import PostForm from "@components/@PostForm/PostForm";
import { getServerSession } from "next-auth";
import { getSuggestedPostWithID } from "@app/api/dbActions";
import { parseAddress, parsePost } from "@app/utils/functions";
import { redirect } from "next/navigation";
import PostNotFound from "@components/@PostForm/PostNotFound";

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
  if (!post) return <PostNotFound />;
  return (
    <main className="relative mb-10 mt-6 max-w-[1000px] bg-hh-100 rounded-xl p-4 text-gray-200 lg:mx-8">
      <section className="h-full w-full bg-hh-200 p-5 px-5">
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
      </section>
    </main>
  );
}
