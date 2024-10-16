"use client";
import React from "react";
import {
  deleteApprovedPost,
  deleteFlohmarkt,
  deleteSuggestion,
  rejectFlohmarkt,
  updatePostStatus,
} from "@app/api/dbActions";
import { useRouter } from "next/navigation";
import {
  revalidateFlohmarkt,
  revalidatePost,
} from "@app/utils/actions/revalidate";
import { deleteAllImagesFromPost } from "@app/api/storageActions";
import {
  deleteSpielplatz,
  rejectSpielplatz,
  revalidateSpielplatz,
} from "@app/api/spActions";

export default function DeleteModal({
  id,
  title,
  setDeleteModal,
  deleteFrom,
  type,
  callbackURL,
}: {
  callbackURL?: string;
  type: "flohmarkt" | "post" | "spielplatz";
  id: number;
  title: string;
  setDeleteModal: React.Dispatch<React.SetStateAction<boolean>>;
  deleteFrom: "suggested" | "approved" | "all";
}) {
  const [titleInput, setTitleInput] = React.useState("");
  const router = useRouter();
  const handleDelete = async () => {
    if (titleInput !== title) {
      return alert("You didn't write the title correctly");
    }
    if (type === "post") {
      if (deleteFrom === "suggested") {
        await updatePostStatus(id, "pending", "rejected");
      } else if (deleteFrom === "approved") {
        await deleteApprovedPost(id);
      } else if (deleteFrom === "all") {
        await deleteSuggestion(id);
        await deleteApprovedPost(id);
        await deleteAllImagesFromPost(id.toString());
      }
    } else if (type === "flohmarkt") {
      if (deleteFrom === "all" || deleteFrom === "suggested") {
        await deleteFlohmarkt(id.toString());
      } else {
        await rejectFlohmarkt(id.toString());
      }
    } else if (type === "spielplatz") {
      if (deleteFrom === "approved" || deleteFrom === "suggested") {
        await rejectSpielplatz(id);
      } else {
        await deleteSpielplatz(id);
      }
    }

    if (type === "post") {
      revalidatePost().then(() => {
        router.push(callbackURL || "/posts");
      });
    }
    if (type === "flohmarkt") {
      revalidateFlohmarkt().then(() => {
        router.push(callbackURL || "/flohmaerkte");
      });
    }
    if (type === "spielplatz") {
      revalidateSpielplatz().then(() => {
        router.push(callbackURL || "/spielplaetze");
      });
    }
  };
  return (
    <div className="fixed left-0 top-0 flex h-screen w-screen items-center justify-center bg-black bg-opacity-50 text-gray-800 z-[300]">
      <div className="flex h-[30vh] min-h-fit w-full flex-col items-center justify-center">
        <div className="rounded-lg bg-negative-100 p-4">
          <h1 className="text-xl font-bold">
            If you want to delete this {type}, write: &quot;{title}&quot;
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
              className="flex h-10 w-fit items-center justify-center rounded bg-negative-500 px-2 py-2 font-bold text-white hover:bg-negative-700"
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
