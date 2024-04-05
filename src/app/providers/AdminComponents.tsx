import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import React from "react";

export default async function AdminRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();
  if (session?.user?.email !== "mockupap@gmail.com") return <></>;

  return <>{children}</>;
}
