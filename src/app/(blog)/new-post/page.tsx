import React from "react";
import { getServerUser } from "@app/api/auth/supabaseAuth";
import { redirect } from "next/navigation";
import AdminRoute from "@app/providers/AdminRoute";
import { iUserMetadata } from "@app/api/auth/types";
import dynamic from "next/dynamic";
const PostForm = dynamic(() => import("@app/components/@PostForm/PostForm"));

export default async function AddPostPage() {
  const session = await getServerUser();
  if (!session?.user) redirect("log-in");
  const {
    email,
    name,
    avatar_url: image,
  } = session.user.user_metadata as iUserMetadata;
  return (
    <AdminRoute>
      <section className="relative mb-10 mt-6 max-w-[1000px] bg-hh-100 rounded-xl p-4 text-gray-200 lg:mx-8">
        <div className="h-full w-full bg-hh-200 p-5 px-5">
          <h1 className="title-font mb-4 text-center text-2xl font-medium text-gray-900 sm:text-3xl">
            Add a new post
          </h1>
          <PostForm
            postType="new-suggestion"
            PostForm={{}}
            user={{ email, name, image }}
          />
        </div>
      </section>
    </AdminRoute>
  );
}
