import { getServerSession } from "next-auth";
import React from "react";
import AuthButton from "./AuthButton";
import AvatarMenu from "./AvatarMenu";

export default async function UserButtons() {
  const session = await getServerSession();
  if (!session?.user) return <AuthButton email={null} />;
  return (
    <AvatarMenu
      email={session?.user?.email}
      initials={
        session?.user?.name
          ? session.user.name
              ?.split(" ")
              .slice(0, 2)
              .map((n) => n[0])
              .join("")
          : ""
      }
      avatar={session?.user?.image}
    />
  );
}
