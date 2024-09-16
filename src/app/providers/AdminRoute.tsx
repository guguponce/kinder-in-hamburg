import { getServerUser } from "@app/api/auth/supabaseAuth";
import { redirect } from "next/navigation";
import React from "react";

export default async function AdminRoute({
  children,
}: {
  children: JSX.Element;
}) {
  const session = await getServerUser();
  if (
    !session ||
    !session.user ||
    session.user.user_metadata.email !== process.env.ADMIN_EMAIL
  )
    redirect("/");
  return <>{children}</>;
}
