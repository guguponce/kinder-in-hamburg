import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import React from "react";

export default async function AdminRoute({
  children,
}: {
  children: JSX.Element;
}) {
  const session = await getServerSession();
  if (
    !session ||
    !session.user ||
    session.user.email !== process.env.ADMIN_EMAIL
  )
    redirect("/");
  return <>{children}</>;
}
