import { getServerSession } from "next-auth";
import React from "react";

export default async function UserServerComponents({
  children,
  creator,
}: {
  children: React.ReactNode;
  creator: string | undefined | null;
}) {
  const session = await getServerSession();
  if (
    !creator ||
    (creator &&
      (!session?.user?.email ||
        ![creator, process.env.ADMIN_EMAIL].includes(session?.user?.email)))
  )
    return <></>;
  return <>{children}</>;
}
