import { getApprovedPostWithID } from "@app/api/dbActions";
import NotFound from "@components/@NotFound/NotFound";
import PostTemplate from "@components/PostTemplate";
import React from "react";
import AdminRoute from "@app/providers/AdminRoute";
import AdminEditButtons from "@app/components/AdminEditButtons";
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
