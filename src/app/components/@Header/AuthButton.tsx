"use client";
import React from "react";
import { signIn, signOut } from "next-auth/react";

export default function AuthButton({
  email,
}: {
  email: string | undefined | null;
}) {
  if (email) {
    return (
      <button
        className="px-2 py-1 rounded-md font-semibold border-2 bg-hh-800 text-hh-100 border-hh-800"
        onClick={() => signOut()}
      >
        Sign out
      </button>
    );
  }

  return (
    <button
      className="px-2 py-1 rounded-md font-semibold border-2  border-hh-800"
      onClick={() => signIn()}
    >
      Sign in
    </button>
  );
}
