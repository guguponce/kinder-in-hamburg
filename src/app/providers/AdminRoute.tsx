import { getServerUser } from "@app/api/auth/supabaseAuth";
import { redirect } from "next/navigation";
import React from "react";

export default async function AdminRoute({
  children,
}: {
  children: JSX.Element;
}) {
  const user = await getServerUser();
  if (!user || !user || user.email !== process.env.ADMIN_EMAIL) redirect("/");
  return <>{children}</>;
}
