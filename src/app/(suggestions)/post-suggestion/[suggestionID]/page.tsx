import { getSuggestedPostWithID } from "@app/api/dbActions";
import ApprovePostButton from "@components/ApproveButton";
import PostNotFound from "@components/@PostForm/PostNotFound";
import PostTemplate from "@components/PostTemplate";
import Link from "next/link";
import React from "react";
import AdminServerComponent from "@app/providers/AdminServerComponents";
import AdminRoute from "@app/providers/AdminRoute";
import AddLatLonFlohmarkt from "@app/components/AddLatLonFlohmarkt";

export default async function CurrentPostPage({
  params,
}: {
  params: { suggestionID: string };
}) {
  const { suggestionID } = params;
  const post = await getSuggestedPostWithID(suggestionID);
  if (!post) return <PostNotFound />;

  return (
    <AdminRoute>
      <PostTemplate post={post}>
        <div className="flex self-center justify-center items-center rounded-md border-2 border-hh-600 bg-hh-200 mb-4 p-2">
          {post.status === "approved" ? (
            <div className="flex flex-col items-center">
              <h2 className="text-xl font-semibold">
                This sugggestion has already been approved
              </h2>
              <Link href={`/posts/${post.id}`}>Check it out!</Link>
            </div>
          ) : post.status === "rejected" ? (
            <div className="flex flex-col items-center bg-negative-800 text-white rounded-md p-2">
              <h2 className="text-xl font-semibold">
                This sugggestion has been rejected
              </h2>
            </div>
          ) : (
            <div className="flex flex-col items-center ">
              <h2 className="text-xl font-semibold">
                This sugggestion has still not been approved
              </h2>
              <small className="text-xs">(You can modify it if you want)</small>
              <Link
                href={`/update-suggestion/${suggestionID}`}
                className="px-2 py-1 bg-hh-700 hover:bg-hh-600 active:bg-hh-500 text-white rounded-md"
              >
                Update suggestion
              </Link>
            </div>
          )}
        </div>
        <AdminServerComponent>
          <AddLatLonFlohmarkt item={post} />
          <ApprovePostButton post={post} />
          <Link
            href={`/update-suggestion/${suggestionID}`}
            className="my-2 bg-hh-700 rounded-md text-center flex justify-center p-2 text-white hover:bg-hh-800 active:bg-hh-600"
          >
            Update Suggestion
          </Link>
        </AdminServerComponent>
      </PostTemplate>
    </AdminRoute>
  );
}
