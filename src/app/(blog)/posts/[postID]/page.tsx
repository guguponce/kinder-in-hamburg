import { checkIfPostExists, getApprovedPostWithID } from "@app/api/dbActions";
import NotFound from "@components/@NotFound/NotFound";
import PostTemplate from "@components/PostTemplate";
import React from "react";
import AdminRoute from "@app/providers/AdminRoute";
import AdminEditButtons from "@components/@Buttons/AdminEditButtons";
import { redirect } from "next/navigation";
import { getServerUser } from "@app/api/auth/supabaseAuth";
export default async function CurrentPostPage({
  params,
}: {
  params: { postID: string };
}) {
  const { postID } = params;
  const post = await getApprovedPostWithID(postID);
  if (post === false) {
    const user = await getServerUser();
    if (!!user) {
      const postExists = await checkIfPostExists(postID, "kih-suggestions");
      if (postExists) {
        redirect(`/post-suggestion/${postID}`);
      }
    }
  }
  if (!post) return <NotFound />;
  return (
    <>
      {post.categories.includes("Badeplatz") ? (
        <>
          <AdminEditButtons
            deleteButton={{
              type: "post",
              deleteFrom: "approved",
              id: post.id,
              title: post.title,
              size: "medium",
            }}
            updateButton={{
              link: `/update-post/${postID}`,
              size: "medium",
              status: post.status,
              type: "post",
            }}
            addLatLonButton={{
              item: post,
            }}
          />
          <PostTemplate post={post} />
        </>
      ) : (
        <AdminRoute>
          <>
            <AdminEditButtons
              deleteButton={{
                type: "post",
                deleteFrom: "approved",
                id: post.id,
                title: post.title,
                size: "medium",
              }}
              updateButton={{
                link: `/update-post/${postID}`,
                size: "medium",
                status: post.status,
                type: "post",
              }}
              addLatLonButton={{
                item: post,
              }}
            />
            <PostTemplate post={post} />
          </>
        </AdminRoute>
      )}
    </>
  );
}
