"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useRef } from "react";

export default function BurgerMenu() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = React.useState(false);
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const menuList = useRef<HTMLElement>(null);
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      // if (
      //   menuList.current &&
      //   !menuList.current.contains(event.target as Node)
      // ) {
      setMenuOpen(false); // Close setMenuOpen menu if the click is outside the menu
      // }
    };

    if (menuOpen) {
      document.addEventListener("click", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, [menuOpen]);
  return (
    <div className="flex w-16 items-center justify-center relative lg:hidden">
      <button
        color="#fefefe"
        aria-label="Options"
        className="rounded-md mx-1 py-1 px-2 font-semibold bg-hh-700 text-white hover:bg-hh-600 active:bg-hh-700"
        onClick={toggleMenu}
      >
        Menu
      </button>
      {menuOpen && (
        <nav
          ref={menuList}
          id="menu-list"
          className="absolute top-[calc(100%+24px)]  -left-3 shadow-lg  z-[300] flex flex-col bg-gradient-to-b from-hh-200 rounded-[0_0_4px_0] to-hh-100"
        >
          {[
            { href: "/", name: "Home" },
            { href: "/posts", name: "Posts" },
            { href: "/flohmaerkte", name: "Flohmärkte" },
            { href: "/categories", name: "Categories" },
            { href: "/bezirke", name: "Bezirke" },
          ].map(({ name, href }, i) => (
            <Link
              className={`${
                pathname === href ? "bg-black bg-opacity-20" : "bg-transparent"
              } ${
                i !== 0 ? "border-t-2 border-black rounded-none" : ""
              } py-1 px-2  font-semibold w-full text-hh-950`}
              key={name}
              href={href}
            >
              {name}
            </Link>
          ))}
        </nav>
      )}
    </div>
  );
}
