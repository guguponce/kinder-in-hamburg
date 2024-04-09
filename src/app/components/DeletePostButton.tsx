"use client";
import React, { useState } from "react";
import DeleteModal from "./DeleteModal";
import { useSession } from "next-auth/react";

export default function DeletePostButton({
  id,
  title,
  deleteFrom,
  size,
}: {
  id: number;
  title: string;
  deleteFrom: "suggested" | "approved" | "all";
  size?: "small" | "medium" | "large";
}) {
  const [deleteModal, setDeleteModal] = useState(false);

  return (
    <>
      {deleteModal && (
        <DeleteModal
          id={id}
          title={title}
          setDeleteModal={setDeleteModal}
          deleteFrom={deleteFrom}
        />
      )}
      <button
        role="button"
        className={`flex ${
          size === "large" ? "w-full max-w-[1000px]" : "w-fit"
        } items-center justify-center rounded bg-negative-500 px-2 ${
          size === "small" ? "py-1" : "h-10 py-2"
        } font-bold text-white hover:bg-negative-700 mb-2`}
        onClick={(e) => {
          e.preventDefault();
          setDeleteModal(true);
        }}
      >
        Delete {deleteFrom === "suggested" ? "Suggestion" : "Post"}
      </button>
    </>
  );
}
