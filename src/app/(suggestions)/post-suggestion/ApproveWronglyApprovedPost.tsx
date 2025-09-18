"use client";
import { approveWronglyApprovedPost } from "@app/api/dbActions";
import Button from "@app/components/@Buttons/Button";
import { iPost } from "@app/utils/types";
import React from "react";

export default function ApproveWronglyApprovedPost({ post }: { post: iPost }) {
  return (
    <Button
      variant="positive"
      size="fit"
      onClick={() => {
        approveWronglyApprovedPost(post)
          .then(() => {
            console.log("Post has been approved again.");
          })
          .catch((error) => {
            console.error("Error approving the post again:", error);
          });
      }}
    >
      Approve Wrongly Approved Post
    </Button>
  );
}
