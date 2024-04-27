import AuthButton from "@app/components/@Header/AuthButton";
import { getServerSession } from "next-auth";
import React from "react";

export default async function page() {
  const session = await getServerSession();
  return (
    <div>
      <AuthButton email={session?.user.email}></AuthButton>
    </div>
  );
}
