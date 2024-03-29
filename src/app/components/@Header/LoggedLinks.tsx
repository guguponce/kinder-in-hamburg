import Link from "next/link";
import React from "react";
import LinkActive from "./LinkActive";

export default function LoggedLinks({
  email,
}: {
  email: string | undefined | null;
}) {
  if (!email) return null;
  return (
    <div>
      <Link href={"/new-post"}>
        New Post
        <LinkActive linkHref="/new-post" />
      </Link>
    </div>
  );
}
