import { getServerUser } from "@app/api/auth/supabaseAuth";
import { redirect } from "next/navigation";
import React from "react";

export default async function AdminServerComponent({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getServerUser();
  if (user?.email !== process.env.ADMIN_EMAIL) redirect("/");

  return <>{children}</>;
}
