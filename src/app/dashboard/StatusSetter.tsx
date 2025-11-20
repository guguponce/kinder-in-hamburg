"use client";
import { updateEventStatus, updatePostStatus } from "@app/api/dbActions";
import { updateSpielplatzStatus } from "@app/api/spActions";
import DeleteButton from "@components/@Buttons/DeleteButton";
import { isTypeSpielplatz } from "@app/utils/functions";
import { iFlohmarkt, iPost, iSpielplatz } from "@app/utils/types";
import React, { useState } from "react";

export default function StatusSetter({
  target,
  status,
  type = "post",
  horizontal = false,
}: {
  target: iPost | iFlohmarkt | iSpielplatz;
  status: "pending" | "approved" | "rejected" | "old";
  type?: "post" | "flohmarkt" | "event";
  horizontal?: boolean;
}) {
  const typeCorrection = {
    event: "events",
    flohmarkt: "flohmaerkte",
    post: "posts",
  };
  const [currentStatus, setCurrentStatus] = useState(status);
  const handleSetStatus = async () => {
    if (status === currentStatus) return;
    if (type === "post")
      await updatePostStatus(target.id, status, currentStatus, target as iPost);
    if (["flohmarkt", "event"].includes(type))
      await updateEventStatus(
        target.id.toString(),
        currentStatus,
        typeCorrection[type]
      ).then((res) => {
        console.log(res);
      });
    if (isTypeSpielplatz(target)) {
      await updateSpielplatzStatus(target.id, currentStatus).then((res) => {
        console.log(res);
      });
    }
  };

  return (
    <>
      <div
        className={`flex-grow h-full flex flex-wrap justify-around gap-4 ${horizontal ? "flex-row" : "flex-col"}`}
      >
        <div
          className={`flex items-center gap-4  ${horizontal ? "flex-row w-fit" : "flex-col w-full"}`}
        >
          <select
            name="status-select"
            id="status-select"
            className={`rounded border-2 border-hh-800 p-1 w-full max-w-[100px] ${
              currentStatus === "approved"
                ? "bg-positive-400"
                : currentStatus === "rejected"
                  ? "bg-negative-400"
                  : "bg-hh-400"
            }`}
            value={currentStatus}
            onChange={(e) =>
              setCurrentStatus(
                e.target.value as "pending" | "approved" | "rejected" | "old"
              )
            }
          >
            <option value="approved">Approved</option>
            <option value="pending">Pending</option>
            <option value="rejected">Rejected</option>
            <option value="old">Old</option>
          </select>
          <button
            className="p-2 rounded bg-hh-700 hover:bg-hh-800 text-white w-fit"
            onClick={handleSetStatus}
          >
            Set Status {'"'}
            {currentStatus}
            {'"'}
          </button>
        </div>
        <DeleteButton
          id={target.id}
          title={target.title}
          deleteFrom="all"
          type={type}
          size={horizontal ? "medium" : "small"}
          callbackURL={`/dashboard/${typeCorrection[type]}`}
        />
      </div>
    </>
  );
}
