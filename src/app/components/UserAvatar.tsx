import { getServerSession } from "next-auth";
import React from "react";

export default async function UserAvatar({
  avatar,
  name,
}: {
  name: string | undefined | null;
  avatar: string | undefined | null;
}) {
  if (!avatar) return <></>;
  return (
    <div>
      <img
        className="w-8 h-8 rounded-full"
        src={avatar}
        alt={name
          ?.split(" ")
          .map((n) => n[0])
          .join("")}
      />
    </div>
  );
}
