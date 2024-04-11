"use client";
import React, { useState } from "react";
import DeleteModal from "./DeleteModal";

export default function DeleteButton({
  id,
  title,
  deleteFrom,
  size,
  type,
}: {
  id: number;
  type: "flohmarkt" | "post";
  title: string;
  deleteFrom: "suggested" | "approved" | "all";
  size?: "small" | "medium" | "large";
}) {
  const [deleteModal, setDeleteModal] = useState(false);

  return (
    <>
      {deleteModal && (
        <DeleteModal
          type={type}
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
        } items-center justify-center rounded  px-2 ${
          size === "small" ? "py-1" : "py-2"
        } font-semibold text-white bg-negative-500 hover:bg-negative-700`}
        onClick={(e) => {
          e.preventDefault();
          setDeleteModal(true);
        }}
      >
        {deleteFrom === "all" ? "Reject " : "Delete "}
        {deleteFrom === "suggested"
          ? "Suggestion"
          : type === "post"
          ? "Post"
          : "Flohmarkt"}
        {deleteFrom === "all" ? " Forever" : ""}
      </button>
    </>
  );
}
