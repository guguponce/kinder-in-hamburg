"use client";
import React, { useState } from "react";
import DeleteModal from "./DeleteModal";

export default function DeleteButton({
  id,
  title,
  deleteFrom,
  size,
  type,
  callbackURL,
}: {
  callbackURL?: string;
  id: number;
  type: "flohmarkt" | "post" | "spielplatz" | "event";
  title: string;
  deleteFrom: "suggested" | "approved" | "all";
  size?: "small" | "medium" | "large";
}) {
  const [deleteModal, setDeleteModal] = useState(false);
  const bSize = size === "small" ? "py-1" : size === "medium" ? "py-2" : "py-4";
  const bWidth =
    size === "large"
      ? "w-full max-w-[1000px]"
      : size === "medium"
        ? "w-fit"
        : "max-w-24";
  return (
    <>
      {deleteModal && (
        <DeleteModal
          type={type}
          id={id}
          title={title}
          setDeleteModal={setDeleteModal}
          deleteFrom={deleteFrom}
          callbackURL={callbackURL}
        />
      )}
      <button
        role="button"
        className={`${bSize} ${bWidth} rounded px-2 font-semibold bg-negative-600 text-center text-white hover:bg-negative-500 active:bg-negative-700`}
        onClick={(e) => {
          e.preventDefault();
          setDeleteModal(true);
        }}
      >
        {deleteFrom === "all" ? "Delete " : "Reject "}
        {deleteFrom === "suggested"
          ? "Suggestion"
          : type === "post"
            ? "Post"
            : type === "event"
              ? "Event"
              : "Flohmarkt"}
        {deleteFrom === "all" ? " Forever" : ""}
      </button>
    </>
  );
}
