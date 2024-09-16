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
      setMenuOpen(false);
    };

    if (menuOpen) {
      document.addEventListener("click", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, [menuOpen]);
  return (
    <div className="flex items-center justify-center relative lg:hidden">
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
