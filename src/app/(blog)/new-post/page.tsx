import React from "react";
import { getServerUser } from "@app/api/auth/supabaseAuth";
import { redirect } from "next/navigation";
import AdminRoute from "@app/providers/AdminRoute";
import dynamic from "next/dynamic";
import type { Metadata } from "next";
const PostForm = dynamic(() => import("@components/@PostForm/PostForm"));

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "New Post",
    icons: "/favicon.ico",
  };
}

export default async function AddPostPage() {
  const user = await getServerUser();
  if (!user) redirect("/");
  const { email, full_name: name, picture: image } = user;
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
