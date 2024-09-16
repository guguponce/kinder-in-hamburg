import { getServerUser } from "@app/api/auth/supabaseAuth";
import React from "react";
import AuthButton from "./AuthButton";
import AvatarMenu from "./AvatarMenu";
import { iUserMetadata } from "@app/api/auth/types";
import { User } from "@supabase/supabase-js";

export default async function UserButtons({ user }: { user?: User | null }) {
  const { user: userData } =
    user === null || !!user ? { user } : await getServerUser();
  if (!userData) return <AuthButton email={null} />;
  const { email, name, avatar_url } = userData.user_metadata as iUserMetadata;
  return (
    <AvatarMenu
      email={email}
      initials={
        name
          ? name
              ?.split(" ")
              .slice(0, 2)
              .map((n) => n[0])
              .join("")
          : ""
      }
      avatar={avatar_url}
    >
      <li className="p-2 list-none flex justify-center">
        <AuthButton email={email} />
      </li>
    </AvatarMenu>
  );
}
