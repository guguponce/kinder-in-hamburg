import React from "react";
import { getServerUser } from "@app/api/auth/supabaseAuth";
import { getSuggestedPostWithID } from "@app/api/dbActions";
import { parseAddress, parsePost } from "@app/utils/functions";
import { redirect } from "next/navigation";
import NotFound from "@components/@NotFound/NotFound";
import AdminRoute from "@app/providers/AdminRoute";
import AddLatLon from "@components/@Buttons/AddLatLon";
import dynamic from "next/dynamic";
const PostForm = dynamic(() => import("@components/@PostForm/PostForm"));

export default async function updateSuggestedPostPage({
  params,
}: {
  params: { postID: string };
}) {
  const user = await getServerUser();
  if (!user || user.email !== process.env.ADMIN_EMAIL) redirect("/");
  const { postID } = params;
  const post = await getSuggestedPostWithID(postID);
  if (!post) return <NotFound />;
  const { email, full_name: name, picture: image } = user;
  return (
    <AdminRoute>
      <main className="relative mb-10 mt-6 max-w-[1000px] bg-hh-100 rounded-xl p-4 text-gray-200 lg:mx-8">
        <AddLatLon item={post} />
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
            user={{ email, name, image }}
          />
        </section>
      </main>
    </AdminRoute>
  );
}
