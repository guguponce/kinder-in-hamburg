import { getServerSession } from "next-auth";
import React from "react";

export default async function AdminServerComponent({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();
  if (session?.user?.email !== process.env.ADMIN_EMAIL) return <></>;

  return <>{children}</>;
}
