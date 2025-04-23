import React from "react";
import { getServerUser } from "@app/api/auth/supabaseAuth";
import {
  getApprovedPostWithID,
  getSuggestedPostWithID,
} from "@app/api/dbActions";
import { parseAddress, parsePost } from "@app/utils/functions";
import { redirect } from "next/navigation";
import Link from "next/link";
import NotFound from "@components/@NotFound/NotFound";
import AdminRoute from "@app/providers/AdminRoute";
import { iUserMetadata } from "@app/api/auth/types";
import dynamic from "next/dynamic";
const PostForm = dynamic(() => import("@components/@PostForm/PostForm"));

export default async function updateSuggestedPostPage({
  params,
}: {
  params: { postID: string };
}) {
  const user = await getServerUser();
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

  const suggestedPost = await getSuggestedPostWithID(postID);
  if (!suggestedPost) return <NotFound />;

  if (
    !user?.email ||
    ![process.env.ADMIN_EMAIL, suggestedPost.user_id].includes(user.email)
  )
    redirect("/");
  const { email, full_name: name, picture: image } = user;

  return (
    <AdminRoute>
      <main className="relative mb-10 mt-6 max-w-[1000px] bg-hh-100 rounded-xl p-4 text-gray-200 lg:mx-8">
        <section className="h-full w-full bg-hh-300 p-5 px-5">
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
            user={{ email, name, image }}
          />
        </section>
      </main>
    </AdminRoute>
  );
}
