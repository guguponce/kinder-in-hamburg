"use client";
import { GetUserHook } from "@app/api/auth/supabaseClient";
import { useSupabaseSession } from "@app/providers/SessionContext";
import React from "react";

function AdminFetchedClientComponent({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = GetUserHook();

  if (!user || user?.email !== process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
    return <></>;
  }
  return <>{children}</>;
}
export default function AdminClientComponent({
  children,
  admin,
}: {
  admin?: boolean;
  children: React.ReactNode;
}) {
  if (!!admin) {
    return <>{children}</>;
  }
  return <AdminFetchedClientComponent>{children}</AdminFetchedClientComponent>;
}
