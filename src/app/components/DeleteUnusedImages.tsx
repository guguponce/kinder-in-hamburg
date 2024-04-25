"use client";
import { getAllFlohs, getSuggestedFlohmaerkte } from "@app/api/dbActions";
import {
  deleteUnusedFlohmaerkteImages,
  deleteUnusedImages,
} from "@app/api/storageActions";
import { iFlohmarkt } from "@app/utils/types";
import React from "react";

export default function DeleteUnusedImages() {
  return (
    <>
      <button
        onClick={async () => {
          await deleteUnusedImages();
          await deleteUnusedFlohmaerkteImages();
        }}
        className="p-2 rounded-md bg-negative-700 hover:bg-negative-600 active:bg-negative-800 text-white"
      >
        Delete unused Flohmaerkte Images
      </button>
    </>
  );
}
