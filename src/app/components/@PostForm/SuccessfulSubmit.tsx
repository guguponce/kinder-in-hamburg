import Link from "next/link";
import React from "react";

export default function SuccessfulSubmit({
  postID,
  submitType,
  type = "post",
  title,
  image,
}: {
  image?: string | null;
  title?: string;
  postID: string;
  type?: "flohmarkt" | "post";
  submitType?: "update" | "approval" | "suggestion";
}) {
  return (
    <section className="mx-auto flex h-fit w-full max-w-[400px] flex-col items-center justify-center rounded-md bg-hh-100 p-4 gap-4 text-center">
      <h2 className="font-semibold flex flex-col gap-1">
        The {type}:<br /> {title || postID} <br /> has been successfully{" "}
        {submitType === "update"
          ? "updated"
          : submitType === "approval"
          ? "approved"
          : "submitted"}
      </h2>

      {!!image && (
        <img src={image} alt={title} className="w-[300px] h-auto rounded " />
      )}
      <Link
        className="px-2 py-1 rounded-md font-semibold bg-hh-700 text-white hover:bg-hh-600"
        href={
          type === "post"
            ? submitType === "suggestion"
              ? `/post-suggestion/${postID}`
              : `/posts/${postID}`
            : type === "flohmarkt" &&
              submitType &&
              ["suggestion", "update"].includes(submitType)
            ? `/flohmarkt-suggestion/${postID}`
            : `/flohmaerkte/${postID}`
        }
      >
        Go check it out!
      </Link>
    </section>
  );
}
