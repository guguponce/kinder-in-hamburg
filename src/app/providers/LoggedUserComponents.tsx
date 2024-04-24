import { getServerSession } from "next-auth";
import React from "react";

export default async function LoggedUserComponents({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();
  if (!session?.user?.email) return <></>;

  return <>{children}</>;
}
