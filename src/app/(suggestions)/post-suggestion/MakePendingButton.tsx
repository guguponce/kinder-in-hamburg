"use client";
import { makePendingPostApproved } from "@app/api/dbActions";
import Button from "@app/components/@Buttons/Button";
import React from "react";

export default function MakePendingButton({ id }: { id: number }) {
  return (
    <Button
      variant="negative"
      onClick={() => {
        makePendingPostApproved(id);
      }}
    >
      Make Pending
    </Button>
  );
}
