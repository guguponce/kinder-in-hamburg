"use client";
import React from "react";
import { deletePost } from "@app/api/dbActions";
import { useRouter } from "next/navigation";
import { revalidate } from "@app/utils/actions/revalidate";

export default function DeleteModal({
  id,
  title,
  setDeleteModal,
}: {
  id: number;
  title: string;
  setDeleteModal: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [titleInput, setTitleInput] = React.useState("");
  const router = useRouter();
  const handleDelete = async () => {
    if (titleInput !== title)
      return alert("You didn't write the title correctly");
    deletePost(id);
    revalidate().then(() => {
      router.push("/posts");
    });
  };
  return (
    <div className="fixed left-0 top-0 flex h-screen w-screen items-center justify-center bg-black bg-opacity-50 text-gray-800">
      <div className="flex h-[30vh] min-h-fit w-full flex-col items-center justify-center">
        <div className="rounded-lg bg-red-100 p-4">
          <h1 className="text-xl font-bold">
            If you want to delete this post, write: {title}{" "}
          </h1>
          <input
            type="text"
            autoFocus
            value={titleInput}
            className="my-2 h-10 w-full rounded-md border-2 border-gray-500 p-2"
            onChange={(e) => setTitleInput(e.target.value)}
          />
          <div className="flex gap-4">
            <button
              className="flex h-10 w-fit items-center justify-center rounded bg-red-500 px-2 py-2 font-bold text-white hover:bg-red-700"
              onClick={(e) => {
                e.preventDefault();
                handleDelete();
              }}
            >
              Delete
            </button>
            <button
              className="flex h-10 w-fit items-center justify-center rounded bg-gray-500 px-2 py-2 font-bold text-white hover:bg-gray-700"
              onClick={(e) => {
                e.preventDefault();
                setDeleteModal(false);
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
