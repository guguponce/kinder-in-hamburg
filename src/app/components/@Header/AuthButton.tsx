import React from "react";
import { getServerUser, signIn, signOut } from "@app/api/auth/supabaseAuth";

export default async function AuthButton({
  email,
}: {
  email?: string | undefined | null;
}) {
  const { user } = !!email ? { user: { email } } : await getServerUser();
  if (!!user && user?.email) {
    return (
      <form action={signOut}>
        <button className="px-2 py-1 rounded-md font-semibold border-2 bg-hh-800 text-hh-100 border-hh-800">
          Sign out
        </button>
      </form>
    );
  }

  return (
    <form action={signIn}>
      <button className="px-2 py-1 rounded-md font-semibold border-2  border-hh-800">
        Sign in
      </button>
    </form>
  );
}
