import { getSuggestedPostWithID } from "@app/api/dbActions";
import NotFound from "@components/@NotFound/NotFound";
import PostTemplate from "@components/PostTemplate";
import React from "react";
import AdminRoute from "@app/providers/AdminRoute";
import AdminEditButtons from "@app/components/@Buttons/AdminEditButtons";
import StatusDisplay from "@app/components/StatusDisplay";
import { getServerUser } from "@app/api/auth/supabaseAuth";

export default async function CurrentPostPage({
  params,
}: {
  params: { suggestionID: string };
}) {
  const user = await getServerUser();
  const { suggestionID } = params;
  const post = await getSuggestedPostWithID(suggestionID);
  if (!post) return <NotFound />;
  if (post.status === "approved" && !user) return <PostTemplate post={post} />;

  return (
    <AdminRoute>
      <>
        <StatusDisplay status={post.status}>
          <StatusDisplay.Title>
            {post.status === "approved"
              ? "Dieser Post wurde schon angenommen"
              : post.status === "rejected"
                ? "Dieser Post wurde abgelehnt"
                : "Dieser Post wurde noch nicht angenommen"}
          </StatusDisplay.Title>
          <StatusDisplay.Link
            href={
              post.status === "approved"
                ? `/posts/${post.id}`
                : `/update-suggestion/${suggestionID}`
            }
            status={post.status}
          >
            {post.status === "approved" ? "Check it out!" : "Update suggestion"}
          </StatusDisplay.Link>
        </StatusDisplay>
        <AdminEditButtons
          deleteButton={{
            type: "post",
            deleteFrom: post.status ? "approved" : "suggested",
            id: post.id,
            title: post.title,
            size: "medium",
          }}
          updateButton={{
            link: `/update-suggestion/${suggestionID}`,
            size: "medium",
            status: post.status,
            type: "post",
          }}
          addLatLonButton={{
            item: post,
          }}
          approveButton={
            post.status !== "approved"
              ? {
                  contributor: post.addedBy,
                  post: post,
                  size: "medium",
                }
              : undefined
          }
        />
        <PostTemplate post={post} />
      </>
    </AdminRoute>
  );
}
