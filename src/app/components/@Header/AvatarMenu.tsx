"use client";
import Link from "next/link";
import React, { useEffect, useRef } from "react";
import AuthButton from "./AuthButton";

export default function AvatarMenu({
  email,
  avatar,
  initials,
}: {
  email: string | undefined | null;
  avatar: string | undefined | null;
  initials: string;
}) {
  const [imgDisplay, setImgDisplay] = React.useState(false);
  const [menuOpen, setMenuOpen] = React.useState(false);
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };
  const imgRef = React.useRef<HTMLImageElement>(null);

  const menuList = useRef<HTMLElement>(null);
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        menuList.current &&
        !menuList.current.contains(event.target as Node)
      ) {
        setMenuOpen(false); // Close setMenuOpen menu if the click is outside the menu
      }
    };

    if (menuOpen) {
      document.addEventListener("click", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, [menuOpen]);
  return (
    <div className="flex mx-1 w-14 items-center justify-center relative">
      <button
        color="#fefefe"
        aria-label="Options"
        onClick={toggleMenu}
        className="relative w-8 h-8 flex justify-center items-center text-white font-bold text-sm rounded-full bg-hh-700 bg-contain bg-center"
      >
        {initials ? initials : ""}
        {imgDisplay && (
          <img
            src={avatar || ""}
            className="absolute z-[500] w-full h-full rounded-full"
            alt=""
            ref={imgRef}
            onError={() => setImgDisplay(false)}
          />
        )}
      </button>
      {menuOpen && (
        <nav
          ref={menuList}
          id="menu-list"
          className="absolute top-[calc(100%+24px)] -right-2 sm:-right-3 lg:-right-4  shadow-lg sm:w-fit z-[300] flex flex-col bg-gradient-to-b from-hh-200 rounded-[0_0_4px_0] to-hh-100"
        >
          {[
            { href: "/dashboard", name: "Dashboard" },
            { href: "/new-post", name: "New Suggestion" },
          ].map(({ name, href }, i) => (
            <Link
              className={
                "border-b-2 border-black rounded-none py-1 px-2  font-semibold w-full sm:w-fit text-hh-950"
              }
              key={name}
              href={href}
            >
              {name}
            </Link>
          ))}
          <li className="p-2 list-none">
            <AuthButton email={email} />
          </li>
        </nav>
      )}
    </div>
  );
}
