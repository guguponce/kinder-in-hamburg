"use client";
import {
  setAllPreviousFlohmaerkteAsOld,
  setFlohmarktAsOld,
} from "@app/api/dbActions";
import React from "react";

export default function OldButtonSetter() {
  return (
    <button
      className="bg-orange-300 p-2"
      onClick={async () => {
        const oldFlohs = await setAllPreviousFlohmaerkteAsOld();
        if (!oldFlohs) return false;
      }}
    >
      Set old Flohmaerkte as Old
    </button>
  );
}
