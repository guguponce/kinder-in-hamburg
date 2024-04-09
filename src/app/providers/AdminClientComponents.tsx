"use client";
import { useSession } from "next-auth/react";
import React from "react";

export default function AdminClientComponent({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data } = useSession();
  if (data?.user?.email !== process.env.NEXT_PUBLIC_ADMIN_EMAIL) return <></>;
  return <>{children}</>;
}
