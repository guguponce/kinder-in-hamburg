"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

export default function BurgerMenu() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = React.useState(false);
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <div className="flex w-16 items-center justify-center relative lg:hidden">
      <button
        color="#fefefe"
        aria-label="Options"
        className="mx-1 py-1 px-2 font-semibold rounded-md bg-[#121212] text-[#fefefe] hover:bg-[#fefefe] hover:text-[#121212] active:bg-[#fefefe] active:text-[#121212]"
        onClick={toggleMenu}
      >
        Menu
      </button>
      {menuOpen && (
        <nav
          id="menu-list"
          className="absolute top-full -left-1  px-2 z-[300] flex flex-col"
        >
          {[
            { href: "/", name: "Home" },
            { href: "/posts", name: "Posts" },
            { href: "/categories", name: "Categories" },
            { href: "/bezirke", name: "Bezirke" },
            { href: "/contact", name: "Contact" },
            { href: "/about", name: "About" },
          ].map(({ name, href }, i) => (
            <Link
              className={`${
                pathname === href ? "bg-[#ededed]" : "bg-[#fefefe]"
              } ${
                i !== 0 ? "border-t-2 border-black" : ""
              } p-1  font-semibold w-full`}
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
