import Link from "next/link";
import React from "react";
import LinkActive from "./LinkActive";

export default function LoggedLinks() {
  const logged = false;
  const logOut = () => {
    console.log("log out");
  };
  if (!logged) return null;
  return (
    <div>
      <Link href={"/new-post"}>
        New Post
        <LinkActive linkHref="/new-post" />
      </Link>

      <Link href="/logged-out" onClick={() => logOut()}>
        Log out
      </Link>
    </div>
  );
}
