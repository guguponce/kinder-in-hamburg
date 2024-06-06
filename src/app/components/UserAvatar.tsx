"use client";
import Link from "next/link";
import React from "react";

export default function UserAvatar({
  avatar,
  name,
  link,
  email,
}: {
  name: string | undefined | null;
  avatar: string | undefined | null;
  link: string;
  email?: string | undefined | null;
}) {
  const [imgDisplay, setImgDisplay] = React.useState(false);
  const imgRef = React.useRef<HTMLImageElement>(null);
  if (!avatar) return <></>;
  const initials = name
    ?.split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("");
  return (
    <Link
      href={link}
      title={email ? email : ""}
      className="relative w-8 h-8 flex justify-center items-center text-white font-bold text-sm rounded-full bg-hh-700 bg-contain bg-center"
    >
      {initials ? initials : ""}
      {imgDisplay && (
        <img
          loading="lazy"
          src={avatar}
          className="absolute z-[500] w-full h-full rounded-full"
          alt=""
          ref={imgRef}
          onError={() => setImgDisplay(false)}
        />
      )}
    </Link>
  );
}
