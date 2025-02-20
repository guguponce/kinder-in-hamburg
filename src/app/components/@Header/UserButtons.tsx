import { getServerUser } from "@app/api/auth/supabaseAuth";
import React from "react";
import AuthButton from "./AuthButton";
import AvatarMenu from "./AvatarMenu";
import { iUserMetadata } from "@app/api/auth/types";
import { User } from "@supabase/supabase-js";

export default async function UserButtons({ user }: { user?: User | null }) {
  const userData = user?.user_metadata || (await getServerUser());
  if (!userData) return <AuthButton email={null} />;
  const { email, full_name: name, picture: image } = userData as iUserMetadata;
  return (
    <div className="lg:ml-4 flex gap-2 items-center">
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
        avatar={image}
      >
        <li className="p-2 list-none flex justify-center">
          <AuthButton email={email} />
        </li>
      </AvatarMenu>{" "}
    </div>
  );
}
