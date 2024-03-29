import Link from "next/link";
import React from "react";

export default function SuccessfulSubmit({
  postID,
  update,
}: {
  update?: boolean;
  postID: string;
}) {
  return (
    <section className="mx-auto flex h-fit w-full max-w-[400px] flex-col items-center justify-center rounded-md bg-hh-100 p-4 gap-4 text-center">
      <h2 className="font-semibold">
        Your post: {postID} <br /> has been successfully{" "}
        {update ? "updated" : "submitted"}
      </h2>
      <Link
        className="px-2 py-1 rounded-md font-semibold bg-hh-700 text-white hover:bg-hh-600"
        href={`/posts/${postID}`}
      >
        Go check it out!
      </Link>
    </section>
  );
}
