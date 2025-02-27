"use client";
import { cn } from "@app/utils/functions";
import "./style/header.scss";
import { GetUserHook } from "@app/api/auth/supabaseClient";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useRef } from "react";
import CloseIcon2 from "../@Icons/CloseIcon2";

function BurgerIcon({
  onClick,
  className,
  menuOpen,
}: {
  className?: string;
  onClick: () => void;
  menuOpen?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      aria-label="Options"
      className={cn(
        "relative rounded bg-opacity-25 bg-hh-800 hover:bg-opacity-30 active:bg-opacity-40 w-10 h-10  mx-2",
        className
      )}
    >
      <div
        className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full p-1 flex flex-col items-center justify-between ${menuOpen ? "opacity-out blur-out hiding" : "opacity-in blur-in showing"}`}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          width="100%"
          height="100%"
        >
          <g clipPath="url(#a)">
            <path
              d="M3 6h18M3 12h18M3 18h18"
              stroke="#f0f1f2"
              strokeWidth={2.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
          <defs>
            <clipPath id="a">
              <path fill="#f0f1f2" d="M0 0H24V24H0z" />
            </clipPath>
          </defs>
        </svg>
      </div>
      <div
        className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full flex flex-col justify-between ${menuOpen ? "opacity-in blur-in showing" : "opacity-out blur-out hiding"}`}
      >
        <CloseIcon2 rotate={0} size="100%" color="#f0f1f2" />
      </div>
    </button>
  );
}

export default function BurgerMenu({}) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = React.useState(false);
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };
  const user = GetUserHook();
  const menuList = useRef<HTMLElement>(null);
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      setMenuOpen(false);
    };

    if (menuOpen) {
      document.addEventListener("click", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, [menuOpen]);
  if (!user) return null;
  return (
    <div className="flex items-center justify-center relative lg:hidden">
      <BurgerIcon onClick={toggleMenu} menuOpen={menuOpen} />
      {menuOpen && (
        <nav
          ref={menuList}
          id="menu-list"
          className="absolute top-[calc(100%+20px)] left-0 shadow-lg z-[300] flex flex-col gap-0 bg-gradient-to-b from-hh-200 rounded-[0_0_4px_0] to-hh-100"
        >
          {[
            { href: "/", name: "Home", auth: true },
            { href: "/posts", name: "Posts", auth: true },
            { href: "/flohmaerkte", name: "Flohmärkte", auth: true },
            { href: "/categories", name: "Categories", auth: true },
            { href: "/bezirke", name: "Bezirke", auth: true },
          ].map(({ name, href, auth }, i) =>
            auth ? (
              <React.Fragment key={href}>
                <Link
                  className={`${
                    pathname === href
                      ? "bg-black bg-opacity-20"
                      : "bg-transparent"
                  } ${
                    i !== 0 ? "border-t-2 border-black rounded-none" : ""
                  } py-1 px-2  font-semibold w-full text-hh-950`}
                  key={name}
                  href={href}
                >
                  {name}
                </Link>
              </React.Fragment>
            ) : (
              <Link
                className={`${
                  pathname === href
                    ? "bg-black bg-opacity-20"
                    : "bg-transparent"
                } ${
                  i !== 0 ? "border-t-2 border-black rounded-none" : ""
                } py-1 px-2  font-semibold w-full text-hh-950`}
                key={name}
                href={href}
              >
                {name}
              </Link>
            )
          )}
        </nav>
      )}
    </div>
  );
}
