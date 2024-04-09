import Link from "next/link";
import React from "react";

export default function PostNotFound() {
  return (
    <main className="flex flex-col items-center justify-center p-6 rounded-md bg-hh-100 w-[500px] max-w-full m-2 gap-4">
      <h2 className="text-lg font-bold text-hh-950">Post not found</h2>
      <p className="text-base text-hh-600">Check out our active posts</p>
      <Link
        className="p-2 rounded-md bg-hh-800 hover:bg-hh-700 active:bg-hh-600 text-white"
        href={"/posts"}
      >
        All Posts
      </Link>
    </main>
  );
}
