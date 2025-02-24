"use client";
import {
  deleteUnusedFlohmaerkteImages,
  deleteUnusedPostsImages,
} from "@app/api/storageActions";
import React from "react";

export default function DeleteUnusedImages() {
  return (
    <>
      <button
        onClick={async () => {
          await deleteUnusedPostsImages();
          await deleteUnusedFlohmaerkteImages();
        }}
        className="p-2 rounded-md bg-negative-700 hover:bg-negative-600 active:bg-negative-800 text-white"
      >
        Delete unused Flohmaerkte and Posts Images
      </button>
    </>
  );
}
