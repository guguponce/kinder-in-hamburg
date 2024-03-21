import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import React from "react";

export default async function ProtectedRoute({
  children,
}: {
  children: JSX.Element;
}) {
  const session = await getServerSession();
  if (!session || !session.user) redirect("/api/auth/signin");
  return <>{children}</>;
}
