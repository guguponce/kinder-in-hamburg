import React from "react";
import { getServerUser } from "@app/api/auth/supabaseAuth";
import { getApprovedPostWithID } from "@app/api/dbActions";
import { parseAddress } from "@app/utils/functions";
import { redirect } from "next/navigation";
import NotFound from "@components/@NotFound/NotFound";
import AdminRoute from "@app/providers/AdminRoute";
import AddLatLon from "@app/components/AddLatLon";
import { iUserMetadata } from "@app/api/auth/types";
import dynamic from "next/dynamic";
const PostForm = dynamic(() => import("@app/components/@PostForm/PostForm"));

export default async function updateApprovedPostPage({
  params,
}: {
  params: { postID: string };
}) {
  const session = await getServerUser();
  if (
    !session?.user ||
    session.user.user_metadata.email !== process.env.ADMIN_EMAIL
  )
    redirect("/");
  const { postID } = params;
  const post = await getApprovedPostWithID(postID);
  if (!post) return <NotFound />;
  const {
    email,
    name,
    avatar_url: image,
  } = session.user.user_metadata as iUserMetadata;
  return (
    <AdminRoute>
      <main className="relative mb-10 mt-6 max-w-[1000px] bg-hh-100 rounded-xl p-4 text-gray-200 lg:mx-8">
        <AddLatLon item={post} />
        <section className="h-full w-full bg-hh-200 p-5 px-5">
          <h1 className="title-font mb-4 text-center text-2xl font-bold text-gray-900 sm:text-3xl">
            UPDATE APPROVED POST
          </h1>
          <PostForm
            postType="update-approved-post"
            PostForm={{
              ...post,
              address: post.address ? parseAddress(post.address) : undefined,
            }}
            user={{ email, name, image }}
          />
        </section>
      </main>
    </AdminRoute>
  );
}
