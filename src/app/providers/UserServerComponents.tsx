import { getServerUser } from "@app/api/auth/supabaseAuth";
import React from "react";

export default async function UserServerComponents({
  children,
  creator,
}: {
  children: React.ReactNode;
  creator: string | undefined | null;
}) {
  const { user } = await getServerUser();
  if (
    !creator ||
    (creator &&
      (!user?.email ||
        ![creator, process.env.ADMIN_EMAIL].includes(user?.email)))
  )
    return <></>;
  return <>{children}</>;
}
