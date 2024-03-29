"use client";
import React from "react";
import DeleteModal from "./DeleteModal";

export default function DeletePost({
  id,
  title,
}: {
  id: number;
  title: string;
}) {
  const [deleteModal, setDeleteModal] = React.useState(false);

  return (
    <>
      {deleteModal && (
        <DeleteModal id={id} title={title} setDeleteModal={setDeleteModal} />
      )}
      <button
        role="button"
        className="flex h-10 w-fit items-center justify-center rounded bg-red-500 px-2 py-2 font-bold text-white hover:bg-red-700 "
        onClick={(e) => {
          e.preventDefault();
          setDeleteModal(true);
        }}
      >
        Delete Post
      </button>
    </>
  );
}
