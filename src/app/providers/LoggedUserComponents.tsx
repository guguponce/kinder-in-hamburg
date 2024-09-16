import { getServerUser } from "@app/api/auth/supabaseAuth";
import React from "react";

export default async function LoggedUserComponents({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = await getServerUser();
  if (!user?.email) return <></>;

  return <>{children}</>;
}
