import React from "react";
import PostForm from "@components/@PostForm/PostForm";
import { getServerSession } from "next-auth";
import { getPostWithID } from "@app/api/dbActions";
import { parseAddress, parsePost } from "@app/utils/functions";
import { redirect } from "next/navigation";

export default async function UpdatePostPage({
  params,
}: {
  params: { postID: string };
}) {
  const session = await getServerSession();
  if (!session?.user || session.user.email !== "mockupap@gmail.com")
    redirect("/api/auth/signin");
  const { postID } = params;
  const post = parsePost(await getPostWithID(postID));
  console.log("text", typeof post.address);
  return (
    <section className="body-font relative mb-10 mt-6 max-w-[1000px] bg-[hsl(35,73%,57%,0.9)] p-4 text-gray-200 lg:mx-8">
      <div className="h-full w-full bg-[rgb(255,255,255,0.6)] p-5 px-5">
        <h1 className="title-font mb-4 text-center text-2xl font-medium text-gray-900 sm:text-3xl">
          Update post
        </h1>
        <PostForm
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
