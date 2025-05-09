"use client";
import Button from "@components/@Buttons/Button";
import {
  revalidateFlohmarkt,
  revalidatePost,
} from "@app/utils/actions/revalidate";
import React from "react";

export default function RevalidateButton() {
  return (
    <Button
      variant="positive-dark"
      onClick={() => {
        revalidatePost();
        revalidateFlohmarkt();
      }}
      className="self-center mx-auto"
    >
      Refresh
    </Button>
  );
}
