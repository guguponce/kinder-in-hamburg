import { getApprovedPostWithID } from "@app/api/dbActions";
import NotFound from "@components/@NotFound/NotFound";
import DeletePostButton from "@app/components/DeleteButton";
import PostTemplate from "@components/PostTemplate";
import AdminServerComponent from "@app/providers/AdminServerComponents";
import Link from "next/link";
import React from "react";
import AdminRoute from "@app/providers/AdminRoute";
import AddLatLon from "@app/components/AddLatLon";
export default async function CurrentPostPage({
  params,
}: {
  params: { postID: string };
}) {
  const { postID } = params;
  const post = await getApprovedPostWithID(postID);
  if (!post) return <NotFound />;
  return (
    <>
      {post.categories.includes("Badeplatz") ? (
        <>
          <AdminServerComponent>
            <DeletePostButton
              type="post"
              deleteFrom="approved"
              id={post.id}
              title={post.title}
              size="large"
            />

            <AddLatLon item={post} />

            <Link
              href={`/update-post/${postID}`}
              className="w-full max-w-[1000px] my-2 bg-hh-700 rounded-md text-center flex justify-center p-2 text-white hover:bg-hh-800 active:bg-hh-600"
            >
              Update Approved Post
            </Link>
          </AdminServerComponent>
          <PostTemplate post={post} />
        </>
      ) : (
        <AdminRoute>
          <>
            <AdminServerComponent>
              <DeletePostButton
                type="post"
                deleteFrom="approved"
                id={post.id}
                title={post.title}
                size="large"
              />

              <AddLatLon item={post} />

              <Link
                href={`/update-post/${postID}`}
                className="w-full max-w-[1000px] my-2 bg-hh-700 rounded-md text-center flex justify-center p-2 text-white hover:bg-hh-800 active:bg-hh-600"
              >
                Update Approved Post
              </Link>
            </AdminServerComponent>
            <PostTemplate post={post} />
          </>
        </AdminRoute>
      )}
    </>
  );
}
