import { getServerUser } from "@app/api/auth/supabaseAuth";
import React from "react";

export default async function AdminServerComponent({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = await getServerUser();
  if (user?.email !== process.env.ADMIN_EMAIL) return <></>;

  return <>{children}</>;
}
