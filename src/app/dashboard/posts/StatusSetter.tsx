"use client";
import { updatePostStatus } from "@app/api/dbActions";
import DeleteButton from "@app/components/DeleteButton";
import { iPost } from "@app/utils/types";
import React, { useState } from "react";

export default function StatusSetter({
  post,
  status,
}: {
  post: iPost;
  status: "pending" | "approved" | "rejected";
}) {
  const [currentStatus, setCurrentStatus] = useState(status);
  const handleSetStatus = async () => {
    if (status === currentStatus) return;
    console.log("status", status, "currentStatus", currentStatus);
    await updatePostStatus(post, post.id, status, currentStatus);
  };

  return (
    <>
      <select
        name="status-select"
        id="status-select"
        className="rounded w-full"
        value={currentStatus}
        onChange={(e) =>
          setCurrentStatus(
            e.target.value as "pending" | "approved" | "rejected"
          )
        }
      >
        <option value="approved">Approved</option>
        <option value="pending">Pending</option>
        <option value="rejected">Rejected</option>
      </select>
      <button
        className="p-2 rounded bg-hh-700 hover:bg-hh-800 text-white w-fit"
        onClick={handleSetStatus}
      >
        Set Status {'"'}
        {currentStatus}
        {'"'}
      </button>
      <DeleteButton
        id={post.id}
        title={post.title}
        deleteFrom="all"
        type="post"
        callbackURL="/dashboard/posts"
      />
    </>
  );
}
